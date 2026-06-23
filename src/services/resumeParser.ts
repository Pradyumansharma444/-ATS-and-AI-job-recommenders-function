/**
 * Resume Parser Service
 * Handles parsing of PDF, DOCX, and TXT resume files
 */

import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import type { ParsedResume, ResumeSection } from '@/types';

// Set PDF.js worker
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.mjs?url');
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;

export async function parseResume(file: File): Promise<ParsedResume> {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  let rawText = '';

  switch (fileType) {
    case 'pdf':
      rawText = await parsePDF(file);
      break;
    case 'docx':
      rawText = await parseDOCX(file);
      break;
    case 'txt':
      rawText = await parseTXT(file);
      break;
    default:
      throw new Error(`Unsupported file format: ${fileType}. Please upload PDF, DOCX, or TXT files.`);
  }

  const sections = extractSections(rawText);

  return {
    text: rawText,
    sections,
    rawText,
  };
}

async function parsePDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(' ');
    text += pageText + '\n';
  }

  return cleanText(text);
}

async function parseDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return cleanText(result.value);
}

async function parseTXT(file: File): Promise<string> {
  const text = await file.text();
  return cleanText(text);
}

function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function extractSections(text: string): ResumeSection[] {
  const sections: ResumeSection[] = [];

  // Common section headers
  const sectionPatterns = [
    { name: 'Header/Contact', regex: /^(.*?)(?=(?:SUMMARY|PROFILE|OBJECTIVE|EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|AWARDS|\n{2,}))/ims },
    { name: 'Professional Summary', regex: /(?:SUMMARY|PROFILE|OBJECTIVE|PROFESSIONAL SUMMARY)[\s:]*\n?(.*?)(?=(?:EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|AWARDS|$))/is },
    { name: 'Work Experience', regex: /(?:EXPERIENCE|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT)[\s:]*\n?(.*?)(?=(?:EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|AWARDS|SUMMARY|$))/is },
    { name: 'Education', regex: /(?:EDUCATION|ACADEMIC|QUALIFICATIONS)[\s:]*\n?(.*?)(?=(?:EXPERIENCE|SKILLS|PROJECTS|CERTIFICATIONS|AWARDS|SUMMARY|$))/is },
    { name: 'Skills', regex: /(?:SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|TECHNOLOGIES)[\s:]*\n?(.*?)(?=(?:EXPERIENCE|EDUCATION|PROJECTS|CERTIFICATIONS|AWARDS|SUMMARY|$))/is },
    { name: 'Projects', regex: /(?:PROJECTS|PERSONAL PROJECTS|KEY PROJECTS)[\s:]*\n?(.*?)(?=(?:EXPERIENCE|EDUCATION|SKILLS|CERTIFICATIONS|AWARDS|SUMMARY|$))/is },
    { name: 'Certifications', regex: /(?:CERTIFICATIONS|CERTIFICATES|LICENSES)[\s:]*\n?(.*?)(?=(?:EXPERIENCE|EDUCATION|SKILLS|PROJECTS|AWARDS|SUMMARY|$))/is },
  ];

  const weights: Record<string, number> = {
    'Header/Contact': 5,
    'Professional Summary': 10,
    'Work Experience': 25,
    'Education': 10,
    'Skills': 20,
    'Projects': 15,
    'Certifications': 5,
  };

  for (const pattern of sectionPatterns) {
    const match = text.match(pattern.regex);
    if (match && match[1] && match[1].trim().length > 10) {
      sections.push({
        name: pattern.name,
        content: match[1].trim(),
        weight: weights[pattern.name] || 5,
      });
    }
  }

  // If no sections found, create a single content section
  if (sections.length === 0) {
    sections.push({
      name: 'Content',
      content: text,
      weight: 100,
    });
  }

  return sections;
}

export function extractKeywords(text: string): string[] {
  // Common technical and professional keywords
  const keywordPatterns = [
    // Programming languages
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'swift', 'kotlin',
    'ruby', 'php', 'scala', 'r', 'matlab', 'perl', 'lua', 'dart',
    // Frontend
    'react', 'vue', 'angular', 'svelte', 'html', 'css', 'sass', 'less', 'tailwind',
    'bootstrap', 'jquery', 'webpack', 'vite', 'next.js', 'nuxt', 'gatsby',
    // Backend
    'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails',
    'fastapi', 'nestjs', 'graphql', 'rest', 'api', 'microservices',
    // Databases
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
    'dynamodb', 'firebase', 'sqlite', 'oracle', 'cassandra',
    // Cloud/DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'github actions',
    'terraform', 'ansible', 'circleci', 'travis', 'gitlab ci',
    // Data/ML
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas',
    'numpy', 'scikit-learn', 'keras', 'opencv', 'nlp', 'data science',
    // Soft skills
    'leadership', 'communication', 'teamwork', 'problem solving', 'agile',
    'scrum', 'project management', 'collaboration', 'mentoring',
    // Tools
    'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'figma',
    'sketch', 'adobe', 'vscode', 'intellij', 'postman',
  ];

  const textLower = text.toLowerCase();
  const found = keywordPatterns.filter(kw => textLower.includes(kw.toLowerCase()));

  return [...new Set(found)];
}

export function extractEmails(text: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  return [...text.matchAll(emailRegex)].map(m => m[0]);
}

export function extractPhoneNumbers(text: string): string[] {
  const phoneRegex = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  return [...text.matchAll(phoneRegex)].map(m => m[0]);
}

export function extractLinks(text: string): string[] {
  const linkRegex = /(?:https?:\/\/)?(?:www\.)?(?:linkedin\.com|github\.com|portfolio|website)[\/\w\-.]*/gi;
  return [...text.matchAll(linkRegex)].map(m => m[0]);
}
