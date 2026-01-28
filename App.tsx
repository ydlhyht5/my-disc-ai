
import React, { useState, useCallback } from 'react';
import { AppState, AnalysisReport as ReportType } from './types';
import { analyzeDiscImage } from './services/geminiService';
import { LoadingOverlay } from './components/LoadingOverlay';
import { AnalysisReport } from './components/AnalysisReport';

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
        
        if (result.isDiscImage) {
          setReport(result);
          setState('REPORT');
        } else {
          setError('检测到图片内容与 DISC 测评结果不符。请上传包含 D/I/S/C 分数的截图。');
          setState('IDLE');
        }
      } catch (err) {
        console.error(err);
        setError('分析过程中遇到错误，请重试。可能是图片太模糊或 API 连接异常。');
        setState('IDLE');
      }
    };
    reader.readAsDataURL(file);
    
    // Reset file input so the same file can be uploaded again if needed
    event.target.value = '';
  };

  const handleReset = useCallback(() => {
    setState('IDLE');
    setReport(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
              D
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:inline">AI DISC 测评专家</span>
          </div>
          <button 
            onClick={handleReset}
            className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            开始新测试
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
                上传您的 DISC 性格测试结果截图，让 AI 心理顾问为您揭示数据背后的性格深度、职业偏好与人际密码。
              </p>
            </header>

            <div className="relative group max-w-xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 transition-all hover:border-blue-400 group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-3xl group-hover:scale-110 transition-transform">
                    📷
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">上传结果截图</p>
                    <p className="text-sm text-gray-400 mt-1">支持 PNG, JPG, JPEG 格式</p>
                  </div>
                  <button className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors pointer-events-none">
                    点击或拖拽上传
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="max-w-md mx-auto p-4 bg-orange-50 text-orange-700 rounded-xl border border-orange-200 text-sm animate-bounce">
                ⚠️ {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
              <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-2">深度解读</h3>
                <p className="text-gray-500 text-sm">不仅是分数，更从心理学角度剖析您的潜意识行为模式。</p>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-2">职场指南</h3>
                <p className="text-gray-500 text-sm">提供精准的职业匹配建议与职场生存法则。</p>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-2">沟通策略</h3>
                <p className="text-gray-500 text-sm">针对您的性格特点，量身定制的人际互动方案。</p>
              </div>
            </div>
          </div>
        )}

        {state === 'ANALYZING' && <LoadingOverlay />}

        {state === 'REPORT' && report && (
          <AnalysisReport report={report} onReset={handleReset} />
        )}
      </main>

      <footer className="py-8 border-t border-gray-200 text-center text-gray-400 text-sm">
        <p>© 2024 AI DISC 测评专家 | 基于 Google Gemini 3.0 大模型驱动</p>
      </footer>
    </div>
  );
};

export default App;
