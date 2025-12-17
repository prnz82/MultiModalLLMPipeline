import React from 'react';
import { Clock, Cpu, FileText, Zap } from 'lucide-react';

const ResultDisplay = ({ result, loading, error }) => {
    if (loading) return (
        <div className="h-full min-h-[400px] flex flex-col items-center justify-center glass-effect rounded-2xl border border-slate-800 p-8">
            <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-medium text-slate-200 mb-2">Orchestrating Pipeline...</h3>
            <div className="flex flex-col gap-2 text-sm text-slate-500 text-center">
                <span className="animate-pulse">Reducing modality...</span>
                <span className="animate-pulse delay-75">Reasoning on content...</span>
                <span className="animate-pulse delay-150">Synthesizing output...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="h-full min-h-[200px] flex flex-col items-center justify-center glass-effect rounded-2xl border border-red-500/20 p-8 bg-red-500/5">
            <div className="p-3 bg-red-500/10 rounded-full text-red-400 mb-4">
                <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-red-200 mb-2">Processing Error</h3>
            <p className="text-red-300/70 text-center max-w-md">{error}</p>
        </div>
    );

    if (!result) return (
        <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl p-8 text-center bg-slate-900/30">
            <div className="p-4 bg-slate-800/50 rounded-full mb-4 opacity-50">
                <Cpu className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-slate-400 font-medium mb-1">Awaiting Input</h3>
            <p className="text-xs text-slate-600 uppercase tracking-widest">System Ready</p>
        </div>
    );

    return (
        <div className="h-full flex flex-col gap-6 animate-enter">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Latency</p>
                        <p className="text-lg font-mono text-slate-200">{result.latencyMs}ms</p>
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                        <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Est. Tokens</p>
                        <p className="text-lg font-mono text-slate-200">{result.tokenEstimate}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 glass-effect rounded-2xl border border-indigo-500/20 p-6 overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50"></div>

                <h3 className="flex items-center gap-2 text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-4">
                    <Zap className="w-4 h-4" /> Synthesized Response
                </h3>

                <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-slate-100 max-w-none overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                    <p className="whitespace-pre-wrap leading-loose text-[15px]">{result.result}</p>
                </div>

                {result.cached && (
                    <div className="absolute top-4 right-4 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] text-emerald-400 font-medium uppercase tracking-wider">
                        Cache Hit
                    </div>
                )}
            </div>

            <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50">
                <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <p className="text-xs text-slate-500 font-bold uppercase">Intermediate Modality Reduction</p>
                </div>
                <p className="text-xs text-slate-400 font-mono line-clamp-2 hover:line-clamp-none transition-all cursor-default">
                    {result.intermediateText}
                </p>
            </div>
        </div>
    );
};

export default ResultDisplay;
