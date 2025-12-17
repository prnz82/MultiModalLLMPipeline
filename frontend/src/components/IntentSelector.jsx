import React from 'react';
import { Target, Check, Sparkles } from 'lucide-react';

const intents = [
    { id: 'describe', label: 'Describe', desc: 'Detailed visual or auditory description' },
    { id: 'explain technically', label: 'Technical Analysis', desc: 'In-depth breakdown with terminology' },
    { id: 'simplify for a beginner', label: 'Simplify', desc: 'ELI5 explanation for beginners' },
    { id: 'summarize', label: 'Summarize', desc: 'Concise executive summary' },
];

const IntentSelector = ({ selectedIntent, setIntent }) => {
    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Processing Intent</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {intents.map((intent) => {
                    const isSelected = selectedIntent === intent.id;

                    return (
                        <button
                            key={intent.id}
                            onClick={() => setIntent(intent.id)}
                            className={`
                group relative flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-300
                ${isSelected
                                    ? 'bg-indigo-500/10 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                                    : 'bg-card border-slate-800 hover:border-slate-600 hover:bg-slate-800/50'}
              `}
                        >
                            <div className="flex items-center justify-between w-full mb-1">
                                <span className={`font-bold font-sans ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                                    {intent.label}
                                </span>
                                {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                            </div>

                            <p className={`text-xs ${isSelected ? 'text-indigo-200/70' : 'text-slate-500'} transition-colors`}>
                                {intent.desc}
                            </p>

                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${isSelected ? 'hidden' : 'block'}`} />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default IntentSelector;
