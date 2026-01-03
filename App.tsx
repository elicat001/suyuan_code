
import React, { useState } from 'react';
import { ViewMode } from './types';
import ConsumerLanding from './components/ConsumerLanding';
import AdminPanel from './components/AdminPanel';
import SystemSpecs from './components/SystemSpecs';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode | null>(null);

  // 初始进入系统选择端 (模拟真实环境下不同 URL 的跳转)
  if (view === null) {
    return (
      <div className="min-h-screen bg-[#F5F5DC] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-[#8B4513] tracking-widest">新会陈皮</h1>
            <p className="text-[#8B4513]/60 italic font-serif">全生命周期溯源管理系统</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => setView(ViewMode.CONSUMER)}
              className="group bg-white border-2 border-[#8B4513] p-6 rounded-2xl shadow-sm hover:bg-[#8B4513] hover:text-[#F5F5DC] transition-all duration-300 text-left"
            >
              <h2 className="text-xl font-bold mb-1">我是消费者</h2>
              <p className="text-sm opacity-70">扫描产品二维码查看溯源档案与正品认证</p>
            </button>

            <button 
              onClick={() => setView(ViewMode.ADMIN)}
              className="group bg-white border-2 border-[#8B4513] p-6 rounded-2xl shadow-sm hover:bg-[#8B4513] hover:text-[#F5F5DC] transition-all duration-300 text-left"
            >
              <h2 className="text-xl font-bold mb-1">我是管理人员</h2>
              <p className="text-sm opacity-70">批次录入、上链存证、生码管理与数据统计</p>
            </button>

             <button 
              onClick={() => setView(ViewMode.SPECS)}
              className="text-[#8B4513] text-sm underline opacity-60 hover:opacity-100"
            >
              查看技术架构设计文档
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部简易切换（仅供演示使用） */}
      <nav className="bg-[#8B4513] text-[#F5F5DC] p-2 flex justify-between items-center px-4 sticky top-0 z-50 shadow-md">
        <span className="text-xs font-bold tracking-tighter">XINHUI TRACEABILITY</span>
        <div className="flex space-x-2">
          <button 
            onClick={() => setView(null)}
            className="text-[10px] bg-white/10 px-2 py-1 rounded"
          >
            返回入口
          </button>
          <button 
            onClick={() => setView(view === ViewMode.CONSUMER ? ViewMode.ADMIN : ViewMode.CONSUMER)}
            className="text-[10px] border border-white/20 px-2 py-1 rounded"
          >
            切换到{view === ViewMode.CONSUMER ? '管理员' : '消费者'}
          </button>
        </div>
      </nav>

      <main className="flex-1">
        {view === ViewMode.CONSUMER && <ConsumerLanding />}
        {view === ViewMode.ADMIN && <AdminPanel />}
        {view === ViewMode.SPECS && <SystemSpecs />}
      </main>

      <footer className="bg-[#1A1A1A] text-gray-500 text-[10px] py-4 text-center">
        © 2024 新会陈皮溯源平台 · 匠心传承
      </footer>
    </div>
  );
};

export default App;
