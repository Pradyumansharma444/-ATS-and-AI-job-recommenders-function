import { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import Home from '@/pages/Home';
import UploadSection from '@/sections/Upload';
import Questionnaire from '@/pages/Questionnaire';
import Dashboard from '@/pages/Dashboard';
import JobMatcher from '@/pages/JobMatcher';
import Awareness from '@/pages/Awareness';
import type { AnalysisResult } from '@/types';
import type { QuestionnaireAnswers } from '@/pages/Questionnaire';

function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<QuestionnaireAnswers | null>(null);

  const handleAnalysisComplete = useCallback((result: AnalysisResult) => {
    setAnalysisResult(result);
  }, []);

  const handleSaveAnswers = useCallback((answers: QuestionnaireAnswers) => {
    setQuestionnaireAnswers(answers);
  }, []);

  return (
    <div className="min-h-screen bg-white font-body flex flex-col justify-between">
      <div>
        {/* Navigation */}
        <Navigation />

        {/* Page Content Routes */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/upload"
              element={<UploadSection onAnalysisComplete={handleAnalysisComplete} />}
            />
            <Route
              path="/questionnaire"
              element={
                <Questionnaire
                  analysisResult={analysisResult}
                  onSaveAnswers={handleSaveAnswers}
                />
              }
            />
            <Route path="/dashboard" element={<Dashboard analysisResult={analysisResult} />} />
            <Route
              path="/jobs"
              element={<JobMatcher analysisResult={analysisResult} answers={questionnaireAnswers} />}
            />
            <Route path="/awareness" element={<Awareness />} />
          </Routes>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
