
import React, { useState, useCallback } from 'react';
import { AppState, AnalysisReport as ReportType } from './types.ts';
import { analyzeDiscImage } from './services/geminiService.ts';
import { LoadingOverlay } from './components/LoadingOverlay.tsx';
import { AnalysisReport } from './components/AnalysisReport.tsx';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('IDLE');
  const [report, setReport] = useState<ReportType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setState('ANALYZING');
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      try {
        const result = await analyzeDiscImage(base64);
        
        if (result && result.isDiscImage) {
          setReport(result);
          setState('REPORT');
        } else {
          setError('检测到图片内容与 DISC 测评结果不符。请上传包含 D/I/S/C 分数的截图。');
          setState('IDLE');
        }
      } catch (err) {
        console.error("分析失败:", err);
        setError('分析过程中遇到错误，请重试。可能是图片太模糊、API 连接异常或 API Key 未配置。');
        setState('IDLE');
      }
    };
    reader.onerror = () => {
      setError('读取文件失败，请重新选择图片。');
      setState('IDLE');
    };
    reader.readAsDataURL(file);
    
    event.target.value = '';
  };

  const handleReset = useCallback(() => {
    setState('IDLE');
    setReport(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
              D
            </div>
            <span className="font-bold text-gray-900 text-lg">AI DISC 测评专家</span>
          </div>
          <button 
            onClick={handleReset}
            className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            返回首页
          </button>
        </div>
      </nav>

      <main className="flex-grow flex flex-col pt-8">
        {state === 'IDLE' && (
          <div className="max-w-4xl mx-auto px-6 py-12 text-center space-y-12">
            <header className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                看见真实的<span className="text-blue-600">自己</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                上传您的 DISC 性格测试结果截图，让 AI 心理顾问为您揭示数据背后的性格深度。
              </p>
            </header>

            <div className="relative group max-w-xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 transition-all hover:border-blue-400">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                    📷
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">上传结果截图</p>
                    <p className="text-sm text-gray-400 mt-1">支持图片格式，点击或拖拽均可</p>
                  </div>
                  <div className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-full font-semibold shadow-lg shadow-blue-200">
                    选择文件
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="max-w-md mx-auto p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
                ⚠️ {error}
              </div>
            )}
          </div>
        )}

        {state === 'ANALYZING' && <LoadingOverlay />}

        {state === 'REPORT' && report && (
          <AnalysisReport report={report} onReset={handleReset} />
        )}
      </main>

      <footer className="py-8 border-t border-gray-200 text-center text-gray-400 text-sm">
        <p>© 2024 AI DISC 测评专家</p>
      </footer>
    </div>
  );
};

export default App;
