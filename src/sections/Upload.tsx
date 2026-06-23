import { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { parseResume } from '@/services/resumeParser';
import { analyzeResume } from '@/services/aiService';
import type { AnalysisResult } from '@/types';

interface UploadProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export default function UploadSection({ onAnalysisComplete }: UploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError('');

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  }, []);

  const validateAndSetFile = (f: File) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    const validExtensions = ['pdf', 'docx', 'txt'];
    const ext = f.name.split('.').pop()?.toLowerCase() || '';

    if (!validTypes.includes(f.type) && !validExtensions.includes(ext)) {
      setError('Unsupported format. Please upload a PDF, DOCX, or TXT file.');
      return;
    }

    if (f.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.');
      return;
    }

    setFile(f);
  };

  const removeFile = () => {
    setFile(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError('');

    try {
      setLoadingStep('Reading resume contents...');
      const parsedResume = await parseResume(file);
      
      setLoadingStep('Scanning keywords & structuring analysis...');
      const result = await analyzeResume(parsedResume, jobDescription);
      
      setLoadingStep('Saving results...');
      onAnalysisComplete(result);
      
      // Delay navigation slightly so user sees completion
      setTimeout(() => {
        navigate('/questionnaire');
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing your resume.');
      setIsAnalyzing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <section className="section-padding min-h-[85vh] flex items-center justify-center pt-24 bg-[#FAFAFA]">
      <div className="content-max max-w-[700px] w-full">
        {/* Title Block */}
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 text-xs font-bold border-2 border-black rounded-full bg-[#86EFAC] mb-3 uppercase tracking-wider shadow-[1px_1px_0px_0px_#000]">
            Step 1 • Upload
          </span>
          <h2 className="text-h2 text-ink">Upload Your Resume</h2>
          <p className="text-small text-slate mt-2 max-w-[450px] mx-auto">
            Analyze your resume local-first. We support PDF, DOCX, and TXT files up to 5MB.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000]">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={48} className="animate-spin text-[#C084FC] mb-4 stroke-[2.5]" />
              <h3 className="text-h3 text-xl mb-1 text-black font-extrabold animate-pulse">Running AI Engine</h3>
              <p className="text-small text-slate font-bold uppercase tracking-wider">{loadingStep}</p>
            </div>
          ) : (
            <>
              {/* Drop Zone */}
              <div
                className={`rounded-xl border-2 border-dashed transition-all duration-150 cursor-pointer ${
                  isDragging
                    ? 'border-black bg-[#86EFAC]/20'
                    : file
                    ? 'border-black bg-[#FAFAFA]'
                    : 'border-black bg-[#FAFAFA] hover:bg-gray-50'
                }`}
                style={{ minHeight: '200px' }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !file && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={handleFileSelect}
                />

                {file ? (
                  <div className="flex flex-col items-center justify-center p-6 min-h-[200px]">
                    <div className="w-12 h-12 rounded-lg border-2 border-black bg-[#C084FC] flex items-center justify-center mb-3 shadow-[2px_2px_0px_0px_#000]">
                      <FileText size={24} className="text-black" />
                    </div>
                    <p className="text-base font-extrabold text-black text-center truncate max-w-full px-4">
                      {file.name}
                    </p>
                    <p className="text-xs font-bold text-slate mt-1">{formatFileSize(file.size)}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="mt-4 flex items-center gap-1.5 text-xs font-bold text-red-600 border-2 border-black bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all"
                    >
                      <X size={14} />
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 min-h-[200px] text-center">
                    <Upload size={36} className="text-black mb-3" />
                    <p className="text-body text-black font-extrabold">
                      Drag & drop your resume file here
                    </p>
                    <p className="text-xs text-slate mt-1 font-bold">
                      or click to search computer
                    </p>
                  </div>
                )}
              </div>

              {/* Error box */}
              {error && (
                <div className="mt-4 p-3 rounded-lg border-2 border-black bg-red-50 text-red-700 text-small font-bold text-center">
                  ⚠️ {error}
                </div>
              )}

              {/* Job Description Area */}
              <div className="mt-6">
                <label className="text-xs font-black text-black uppercase tracking-wider block mb-2">
                  Paste Target Job Description (Optional)
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the requirements of the job you are targeting. This helps check for missing keywords..."
                  className="w-full min-h-[120px] p-3 border-2 border-black rounded-xl text-body text-black placeholder:text-gray-400 focus:ring-0 outline-none transition-all resize-y shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  maxLength={5000}
                />
                <div className="text-right text-[10px] font-bold text-slate mt-1.5">
                  {jobDescription.length}/5000 characters
                </div>
              </div>

              {/* Analyze Button */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={!file}
                  className={`btn-neo-primary w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 ${
                    !file ? 'opacity-50 cursor-not-allowed shadow-[1px_1px_0px_0px_#000]' : 'shadow-[3px_3px_0px_0px_#000]'
                  }`}
                >
                  Analyze Resume
                  <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
