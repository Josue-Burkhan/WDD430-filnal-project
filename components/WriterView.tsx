import React, { useState } from 'react';
import { PenTool, BookOpen, Copy, Check, Loader2 } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { WriterState } from '../types';

export const WriterView: React.FC = () => {
  const [state, setState] = useState<WriterState>({
    topic: '',
    tone: 'Professional',
    output: '',
    isLoading: false
  });
  const [copied, setCopied] = useState(false);

  const tones = ['Professional', 'Casual', 'Humorous', 'Academic', 'Dramatic'];

  const handleGenerate = async () => {
    if (!state.topic.trim()) return;
    
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await GeminiService.generateCreativeContent(state.topic, state.tone);
      setState(prev => ({ ...prev, output: result }));
    } catch (error) {
      setState(prev => ({ ...prev, output: "Failed to generate content." }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(state.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50">
      <div className="p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white tracking-tight">Writer Studio</h2>
        <p className="text-slate-400 text-sm">AI-assisted content creation</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Controls */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Topic or Concept</label>
              <input
                type="text"
                value={state.topic}
                onChange={(e) => setState(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="E.g., The future of sustainable energy..."
                className="w-full bg-slate-900 text-white rounded-xl px-4 py-3 border border-slate-700 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tone</label>
              <div className="flex flex-wrap gap-2">
                {tones.map(t => (
                  <button
                    key={t}
                    onClick={() => setState(prev => ({ ...prev, tone: t }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      state.tone === t 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!state.topic.trim() || state.isLoading}
              className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {state.isLoading ? <Loader2 className="animate-spin" /> : <PenTool className="w-4 h-4" />}
              Generate Draft
            </button>
          </div>

          {/* Output */}
          {state.output && (
            <div className="relative bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="absolute top-4 right-4">
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <h3 className="flex items-center gap-2 text-indigo-400 font-semibold mb-6">
                <BookOpen className="w-5 h-5" />
                Generated Content
              </h3>
              <div className="prose prose-invert prose-lg max-w-none leading-relaxed text-slate-300">
                 <p className="whitespace-pre-wrap">{state.output}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};