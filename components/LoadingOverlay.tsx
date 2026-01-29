
import React from 'react';
import { Language } from '../types.ts';

interface Props {
  lang: Language;
}

export const LoadingOverlay: React.FC<Props> = ({ lang }) => {
  const t = {
    zh: {
      title: "AI 心理专家正在深入解析您的性格色彩...",
      desc: "正在通过大数据与心理学模型生成您的专属报告"
    },
    en: {
      title: "AI Psychologist is diving deep into your personality...",
      desc: "Generating your exclusive report using psychological models and big data"
    }
  }[lang];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 animate-pulse text-center px-6">{t.title}</h3>
      <p className="mt-2 text-gray-500 text-center px-6">{t.desc}</p>
    </div>
  );
};
