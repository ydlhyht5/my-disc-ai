
import React from 'react';
import { AnalysisReport as ReportType } from '../types.ts';

interface Props {
  report: ReportType;
  onReset: () => void;
}

export const AnalysisReport: React.FC<Props> = ({ report, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 pb-20">
      <header className="text-center space-y-4">
        <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold">
          DISC 深度分析报告
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          您是一个 <span className="text-blue-600">{report.overallTitle}</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {report.summary}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mr-3">✨</span>
            典型特质
          </h2>
          <ul className="space-y-2">
            {report.traits.map((trait, idx) => (
              <li key={idx} className="text-gray-700 flex items-start italic">
                <span className="mr-2 text-indigo-400">#</span>{trait}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-3">💪</span>
            核心优势
          </h2>
          <ul className="space-y-2">
            {report.strengths.map((s, idx) => (
              <li key={idx} className="text-gray-700 flex items-start">
                <span className="mr-2 text-green-500">✓</span>{s}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mr-3">🚀</span>
            成长机会
          </h2>
          <ul className="space-y-2">
            {report.growthAreas.map((g, idx) => (
              <li key={idx} className="text-gray-700 flex items-start">
                <span className="mr-2 text-orange-400">!</span>{g}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mr-3">💼</span>
            职业建议
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">{report.careerAdvice}</p>
        </section>
      </div>

      <section className="bg-blue-600 p-8 rounded-3xl shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-4">🤝 人际沟通指南</h2>
        <p className="text-blue-50 leading-relaxed">{report.interpersonalAdvice}</p>
      </section>

      <div className="flex justify-center">
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all shadow-lg"
        >
          重新分析另一张图
        </button>
      </div>
    </div>
  );
};
