import React, { useState } from 'react';
import axios from 'axios';
import { Layers, Zap, Info, Play, X, ChevronRight } from 'lucide-react';
import FileUpload from './components/FileUpload';
import IntentSelector from './components/IntentSelector';
import ResultDisplay from './components/ResultDisplay';

function App() {
  const [file, setFile] = useState(null);
  const [intent, setIntent] = useState('describe');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  const handleProcess = async () => {
    if (!file) {
      setError("Please upload a file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('intent', intent);

    try {
      const response = await axios.post('http://localhost:3000/api/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Connection refused. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center p-4 sm:p-8">

      <header className="w-full max-w-6xl flex items-center justify-between mb-12 animate-enter">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Multi-Modal Orchestration</h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Multi Modal AI Pipeline</p>
          </div>
        </div>

        <button
          onClick={() => setShowGuide(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 transition-all text-sm font-medium"
        >
          <Info className="w-4 h-4" />
          <span>User Guide</span>
        </button>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">

        <div className="lg:col-span-5 space-y-6 animate-enter" style={{ animationDelay: '0.1s' }}>

          <div className="glass-effect p-6 rounded-2xl">
            <FileUpload file={file} setFile={setFile} />
          </div>

          <div className="glass-effect p-6 rounded-2xl">
            <IntentSelector selectedIntent={intent} setIntent={setIntent} />

            <button
              onClick={handleProcess}
              disabled={loading || !file}
              className={`
                group w-full mt-6 py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300
                flex items-center justify-center gap-2
                ${loading || !file
                  ? 'bg-slate-800 cursor-not-allowed text-slate-500 shadow-none'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/40 hover:scale-[1.02]'}
              `}
            >
              {loading ? (
                <>Processing...</>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> Run Pipeline
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
              <span className="text-xs font-medium text-slate-400">System Status</span>
            </div>
            <span className="text-xs font-bold text-slate-300">{loading ? 'PROCESSING' : 'IDLE'}</span>
          </div>
        </div>

        <div className="lg:col-span-7 h-full animate-enter" style={{ animationDelay: '0.2s' }}>
          <ResultDisplay result={result} loading={loading} error={error} />
        </div>

      </main>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-enter">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-400" /> User Guide
            </h2>

            <div className="space-y-4 text-sm text-slate-400">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-200 font-bold border border-slate-700">1</div>
                <div>
                  <h4 className="text-slate-200 font-medium mb-1">Upload Data</h4>
                  <p>Drag and drop an image (JPG, PNG) or audio file (MP3, WAV). The system will automatically detect the modality.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-200 font-bold border border-slate-700">2</div>
                <div>
                  <h4 className="text-slate-200 font-medium mb-1">Select Intent</h4>
                  <p>Choose how you want the AI to analyze the data. "Describe" provides a narrative, while "Technical" focuses on specs.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-200 font-bold border border-slate-700">3</div>
                <div>
                  <h4 className="text-slate-200 font-medium mb-1">Analyze</h4>
                  <p>Click "Run Pipeline". The system converts the input to text and runs a multi-step reasoning chain.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowGuide(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium text-sm"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
