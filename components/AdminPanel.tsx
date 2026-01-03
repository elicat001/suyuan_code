
import React, { useState, useEffect, useRef } from 'react';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'generate'>('upload');
  const [batchStatus, setBatchStatus] = useState<'陈化中' | '已出库' | '待质检' | '成品入库'>('陈化中');
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'zh-CN';
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDescription(prev => prev + transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('您的浏览器不支持语音识别功能。');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const handleStatusUpdate = () => {
    setShowUpdateToast(true);
    setTimeout(() => setShowUpdateToast(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen relative font-serif">
      {/* 提示信息 */}
      {showUpdateToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-[#8B4513] text-[#F5F5DC] px-8 py-4 rounded-3xl shadow-2xl flex items-center space-x-3 animate-slideIn">
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          <span className="text-sm font-black tracking-widest uppercase">状态已更新：{batchStatus}</span>
        </div>
      )}

      <div className="flex space-x-8 mb-10 border-b border-gray-100">
        <button 
          onClick={() => setActiveTab('upload')}
          className={`pb-4 px-2 transition-all text-sm tracking-[0.2em] font-black ${activeTab === 'upload' ? 'border-b-2 border-[#8B4513] text-[#8B4513]' : 'text-gray-300'}`}
        >
          节点数据录入
        </button>
        <button 
          onClick={() => setActiveTab('generate')}
          className={`pb-4 px-2 transition-all text-sm tracking-[0.2em] font-black ${activeTab === 'generate' ? 'border-b-2 border-[#8B4513] text-[#8B4513]' : 'text-gray-300'}`}
        >
          一物一码生成
        </button>
      </div>

      {activeTab === 'upload' ? (
        <div className="space-y-10 animate-fadeInAdmin">
          {/* Logic Display Section */}
          <div className="p-8 bg-[#FAFAEE] rounded-[2rem] border border-[#E5E5CA] shadow-sm group">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#8B4513] font-black tracking-widest flex items-center text-sm uppercase">
                <svg className="w-5 h-5 mr-3 opacity-60" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>
                Core Trace Service
              </h2>
              <span className="text-[10px] bg-[#8B4513] text-[#F5F5DC] px-3 py-1 rounded-full font-black tracking-widest">v2.5 STABLE</span>
            </div>
            <div className="bg-gray-900 text-green-400/90 p-5 rounded-2xl font-mono text-[11px] overflow-x-auto shadow-inner border border-gray-800 leading-relaxed">
              <pre>{`
/**
 * @description 同步陈化状态至链上节点
 */
async updateBatchStatus(id: string, status: string) {
  const result = await this.db.batch.update({
    where: { uuid: id },
    data: { status, updatedAt: new Date() }
  });
  return this.blockchain.syncNode(result);
}
              `}</pre>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] space-y-10">
            <div className="flex items-center">
              <span className="w-1.5 h-6 bg-[#8B4513] rounded-full mr-4"></span>
              <h3 className="text-gray-800 font-black tracking-widest">批次生命周期管理</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">关联溯源批次</label>
                <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-bold focus:ring-4 focus:ring-[#8B4513]/5 focus:border-[#8B4513] outline-none transition-all appearance-none cursor-pointer">
                  <option>BATCH-2021-TM-圈枝 (天马核心)</option>
                  <option>BATCH-2023-MG-驳枝 (梅江核心)</option>
                </select>
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">更新生命周期状态</label>
                <div className="flex space-x-3">
                  <select 
                    value={batchStatus}
                    onChange={(e) => setBatchStatus(e.target.value as any)}
                    className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-bold focus:ring-4 focus:ring-[#8B4513]/5 focus:border-[#8B4513] outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="陈化中">陈化中 (Aging)</option>
                    <option value="待质检">待质检 (Pending Quality Check)</option>
                    <option value="成品入库">成品入库 (Stocked)</option>
                    <option value="已出库">已出库 (Shipped)</option>
                  </select>
                  <button 
                    onClick={handleStatusUpdate}
                    className="bg-[#8B4513] text-[#F5F5DC] px-8 py-4 rounded-2xl text-[10px] font-black tracking-widest shadow-xl shadow-[#8B4513]/20 hover:scale-105 active:scale-95 transition-all uppercase whitespace-nowrap"
                  >
                    确认更新
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50 space-y-8">
              <div className="flex items-center">
                <span className="w-1.5 h-6 bg-[#8B4513] rounded-full mr-4"></span>
                <h3 className="text-gray-800 font-black tracking-widest">新增溯源节点记录</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">节点标题</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold" placeholder="例如：2024年小满翻晒" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">详细存证描述</label>
                    <button 
                      onClick={toggleVoiceInput}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all text-[9px] font-black tracking-widest ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-[#8B4513]/5 text-[#8B4513] hover:bg-[#8B4513]/10'}`}
                    >
                      <svg className={`w-3 h-3 ${isRecording ? 'text-white' : 'text-[#8B4513]'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" />
                      </svg>
                      <span>{isRecording ? '正在听取...' : '语音录入'}</span>
                    </button>
                  </div>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold h-40 resize-none outline-none focus:ring-4 focus:ring-[#8B4513]/5 focus:border-[#8B4513] transition-all" 
                    placeholder="记录环境温湿度、操作规范及细节..."
                  ></textarea>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">多媒体存证上传</label>
                  <div className="group border-2 border-dashed border-gray-100 p-16 rounded-[2rem] flex flex-col items-center justify-center text-gray-400 hover:border-[#8B4513]/30 hover:bg-[#8B4513]/5 transition-all cursor-pointer relative overflow-hidden">
                    <svg className="w-16 h-16 mb-5 group-hover:text-[#8B4513] transition-colors opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase">Click to upload encrypted evidence</p>
                    <p className="text-[9px] mt-2 opacity-40 font-serif italic">支持 4K 视频及高清微距照片存证</p>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#8B4513] text-[#F5F5DC] py-6 rounded-[1.5rem] font-black tracking-[0.5em] text-sm shadow-2xl shadow-[#8B4513]/30 hover:scale-[1.01] active:scale-[0.99] transition-all mt-6 uppercase">
                签署并同步至区块链
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-fadeInAdmin space-y-8">
          <div className="bg-white border border-gray-100 p-12 rounded-[2.5rem] shadow-sm space-y-10">
            <h3 className="text-gray-800 font-black tracking-widest text-center text-lg">批量生码中心</h3>
            <div className="max-w-md mx-auto space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">绑定生码批次</label>
                <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold">
                  <option>2021-TM-001 (当前库存 480kg)</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">申请生码总量</label>
                <input type="number" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold" defaultValue={500} />
              </div>
              <button className="w-full bg-[#8B4513] text-white py-5 rounded-2xl font-black tracking-[0.2em] text-xs shadow-xl shadow-[#8B4513]/20 hover:bg-[#5C2E0C] transition-colors">
                生成安全 UUID 并导出
              </button>
              <div className="flex items-center justify-center space-x-2 text-[9px] text-gray-300 font-serif italic">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                <span>采用 AES-256 标准生成不可逆转唯一加密标识符</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translate(-50%, -40px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-slideIn { animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        @keyframes fadeInAdmin {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInAdmin { animation: fadeInAdmin 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AdminPanel;
