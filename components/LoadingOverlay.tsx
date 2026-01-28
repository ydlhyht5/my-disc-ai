
import React from 'react';

export const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 animate-pulse">AI 心理专家正在深入解析您的性格色彩...</h3>
      <p className="mt-2 text-gray-500">正在通过大数据与心理学模型生成您的专属报告</p>
    </div>
  );
};
