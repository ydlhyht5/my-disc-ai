
import React, { useState, useCallback } from 'react';
import { AppState, AnalysisReport as ReportType } from './types.ts';
import { analyzeDiscImage } from './services/geminiService.ts';
import { LoadingOverlay } from './components/LoadingOverlay.tsx';
import { AnalysisReport } from './components/AnalysisReport.tsx';

// 专业的 SVG Logo 组件 - 优化了尺寸控制
const MainLogo: React.FC<{ sizeClass?: string; containerSize?: string }> = ({ 
  sizeClass = "w-10 h-10", 
  containerSize = "40px" 
}) => (
  <div 
    style={{ width: containerSize, height: containerSize }}
    className={`${sizeClass} relative flex items-center justify-center group transition-transform hover:scale-105 duration-300`}
  >
    {/* 四象限背景网格 */}
    <div className="grid grid-cols-2 gap-0.5 w-full h-full rotate-45 transform overflow-hidden rounded-md shadow-sm">
      <div className="bg-red-500 opacity-90"></div>
      <div className="bg-yellow-400 opacity-90"></div>
      <div className="bg-green-500 opacity-90"></div>
      <div className="bg-blue-600 opacity-90"></div>
    </div>
    {/* 中心 AI 洞察星光 */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-2/5 h-2/5 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-100">
        <svg viewBox="0 0 24 24" className="w-3/4 h-3/4 text-indigo-600 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        </svg>
      </div>
    </div>
  </div>
);

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
        setError('分析过程中遇到错误，请重试。请确认已在 Vercel 环境变量中配置 API_KEY。');
        setState('IDLE');
      }
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
      {/* 导航栏 */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <MainLogo sizeClass="w-10 h-10" containerSize="40px" />
            <span className="font-bold text-gray-900 text-xl tracking-tight">AI DISC 测评专家</span>
          </div>
          <button 
            onClick={handleReset} 
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          >
            返回首页
          </button>
        </div>
      </nav>

      <main className="flex-grow flex flex-col pt-8">
        {state === 'IDLE' && (
          <div className="max-w-4xl mx-auto px-6 py-12 text-center space-y-12">
            <header className="space-y-6">
              <div className="flex justify-center mb-8">
                <MainLogo sizeClass="w-24 h-24" containerSize="96px" />
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
                看见真实的<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">自己</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                上传您的 DISC 测试结果截图，由 AI 顾问为您提供深度心理学解读、职场建议与成长指南。
              </p>
            </header>

            <div className="relative group max-w-xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-white border-2 border-dashed border-gray-200 rounded-[2.5rem] p-16 hover:border-blue-400 transition-all shadow-sm">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-inner text-blue-600">
                    📷
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-800">上传测评截图</p>
                    <p className="text-gray-400 mt-2">点击此处或拖拽文件到这里</p>
                  </div>
                  <div className="inline-block px-10 py-4 bg-gray-900 text-white rounded-full font-bold shadow-2xl transition-transform active:scale-95">
                    立即分析
                  </div>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="max-w-md mx-auto p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl animate-pulse">
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

      <footer className="py-12 border-t border-gray-100 text-center text-gray-400 text-sm">
        <div className="flex justify-center mb-4 grayscale opacity-40">
          <MainLogo sizeClass="w-6 h-6" containerSize="24px" />
        </div>
        <p>© 2026 AI DISC 测评专家 · 专业心理分析引擎</p>
      </footer>
    </div>
  );
};

export default App;
