
import React from 'react';
import { AnalysisReport as ReportType } from '../types.ts';

interface Props {
  report: ReportType;
  onReset: () => void;
}

export const AnalysisReport: React.FC<Props> = ({ report, onReset }) => {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12 pb-24">
      <header className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold border border-indigo-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          基于 {report.testType} 的深度分析
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight">
          您是一个 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">{report.overallTitle}</span>
        </h1>
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute -left-4 top-0 text-6xl text-indigo-100 font-serif">“</div>
          <p className="text-lg text-gray-600 leading-relaxed px-6 whitespace-pre-wrap text-justify">
            {report.summary}
          </p>
          <div className="absolute -right-4 bottom-0 text-6xl text-indigo-100 font-serif">”</div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-gray-100 hover:shadow-2xl transition-shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-indigo-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            核心行为特质
          </h2>
          <ul className="grid grid-cols-1 gap-4">
            {report.traits.map((trait, idx) => (
              <li key={idx} className="group p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                <p className="text-gray-700 leading-relaxed font-medium flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-3"></span>
                  {trait}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-gray-100 hover:shadow-2xl transition-shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-emerald-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            天赋与独特优势
          </h2>
          <ul className="space-y-4">
            {report.strengths.map((s, idx) => (
              <li key={idx} className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex items-start">
                <span className="mr-3 text-emerald-600 font-bold">★</span>
                <span className="text-gray-800 font-medium">{s}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-gray-100 hover:shadow-2xl transition-shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-orange-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            盲点与提升方向
          </h2>
          <div className="space-y-4">
            {report.growthAreas.map((g, idx) => (
              <div key={idx} className="flex items-start p-4 bg-orange-50/30 rounded-2xl border border-orange-100">
                <span className="text-orange-500 mr-3 text-lg">💡</span>
                <p className="text-gray-700 text-sm leading-relaxed font-medium">{g}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-gray-100 hover:shadow-2xl transition-shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-purple-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            职场/长期成长建议
          </h2>
          <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100">
            <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">{report.careerAdvice}</p>
          </div>
        </section>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-900 p-10 md:p-14 rounded-[3rem] shadow-2xl text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black tracking-tight">人际互动深度指南</h2>
          </div>
          <p className="text-xl text-indigo-100/90 leading-relaxed font-light whitespace-pre-wrap">
            {report.interpersonalAdvice}
          </p>
        </div>
      </section>

      <div className="flex flex-col items-center gap-6">
        <button 
          onClick={onReset}
          className="group relative px-12 py-5 bg-indigo-600 text-white rounded-full font-bold text-lg shadow-2xl hover:bg-indigo-700 transition-all active:scale-95"
        >
          <span className="relative z-10">分析下一份测试报告</span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10"></div>
        </button>
        <p className="text-gray-400 text-sm">此报告由 AI 基于截图内容进行心理学推理，仅供个人成长参考</p>
      </div>
    </div>
  );
};
