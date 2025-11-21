import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Sparkles, Loader2 } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { VisionState } from '../types';

export const VisionView: React.FC = () => {
  const [state, setState] = useState<VisionState>({
    image: null,
    imagePreview: null,
    prompt: '',
    result: null,
    isLoading: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result as string,
          result: null
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!state.image) return;

    setState(prev => ({ ...prev, isLoading: true, result: null }));

    try {
      const result = await GeminiService.analyzeImage(
        state.image,
        state.prompt || "Describe this image in detail, focusing on key elements and context."
      );
      setState(prev => ({ ...prev, result }));
    } catch (error) {
      setState(prev => ({ ...prev, result: "Failed to analyze image. Please try again." }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setState({
      image: null,
      imagePreview: null,
      prompt: '',
      result: null,
      isLoading: false
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 overflow-y-auto">
      <div className="p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white tracking-tight">Vision Lab</h2>
        <p className="text-slate-400 text-sm">Multimodal image analysis</p>
      </div>

      <div className="p-6 md:p-8 max-w-5xl mx-auto w-full space-y-8">
        
        {/* Upload Area */}
        {!state.imagePreview ? (
          <div 
            onClick={triggerFileInput}
            className="border-2 border-dashed border-slate-700 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-slate-800/30 transition-all group"
          >
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Upload an image</h3>
            <p className="text-slate-500 text-center max-w-md">
              Drag and drop or click to select an image (JPG, PNG, WEBP).
              <br/>Nexus will analyze it for you.
            </p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Preview Column */}
            <div className="space-y-4">
              <div className="relative group rounded-2xl overflow-hidden border border-slate-700 shadow-xl bg-black">
                <img 
                  src={state.imagePreview} 
                  alt="Preview" 
                  className="w-full h-auto object-contain max-h-[500px]" 
                />
                <button 
                  onClick={clearImage}
                  className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-red-600/80 backdrop-blur-md text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">Custom Prompt (Optional)</label>
                <textarea
                  value={state.prompt}
                  onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="Ask something specific about the image..."
                  className="w-full bg-slate-800 text-white rounded-xl p-4 border border-slate-700 focus:border-indigo-500 focus:outline-none min-h-[100px] resize-none"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={state.isLoading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
                >
                  {state.isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Analyze Image
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Result Column */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent rounded-3xl pointer-events-none" />
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-full min-h-[300px]">
                <div className="flex items-center gap-3 mb-6">
                  <ImageIcon className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-semibold text-white">Analysis Results</h3>
                </div>
                
                {state.result ? (
                  <div className="prose prose-invert prose-indigo max-w-none">
                    <p className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                      {state.result}
                    </p>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 pb-12">
                    <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                    <p>Results will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};