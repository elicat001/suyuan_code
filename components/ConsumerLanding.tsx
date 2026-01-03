
import React, { useState, useEffect } from 'react';
import { TraceNode } from '../types';
import { GoogleGenAI } from "@google/genai";

// 模拟不同产品的溯源数据
const BATCH_DATA_MAP: Record<string, { nodes: TraceNode[], years: number, agingStatus: string, initialScanCount: number, origin: string }> = {
  'DEFAULT': {
    origin: '新会天马',
    years: 3,
    agingStatus: '核心产区 · 天马',
    initialScanCount: 0,
    nodes: [
      { 
        id: '4', 
        nodeName: '成品出库', 
        description: '经过严格的感官评审与农残检测，各项指标均符合新会陈皮地理标志产品标准。本批次采用传统麻袋封装，进入成品库待发。包装采用了三层防护设计，确保在运输过程中防潮防霉。', 
        mediaUrls: ['https://picsum.photos/seed/out/400/400'], 
        nodeTime: '2024.03.15', 
        operator: '张主管' 
      },
      { 
        id: '3', 
        nodeName: '2023年冬至翻晒', 
        description: '挑选冬至前后的连续晴天进行翻晒。此时空气干燥，利于陈皮内部水分均匀散发。翻晒过程中需人工定时翻动，确保每一瓣陈皮都能充分接触阳光，剔除少量受潮或变质个体。这一过程是陈皮陈化的关键节点，决定了香气的纯正度。', 
        mediaUrls: [
          'https://picsum.photos/seed/dry1/300/300',
          'https://picsum.photos/seed/dry2/300/300',
          'https://picsum.photos/seed/dry3/300/300'
        ], 
        nodeTime: '2023.12.22', 
        operator: '李技师' 
      },
      { 
        id: '1', 
        nodeName: '核心产区采摘', 
        description: '于天马核心产区古梨园采摘。采摘时严格遵循“三不采”原则：下雨不采、有雾不采、果色不熟不采。确保每一颗茶枝柑都处于最佳生理成熟期。', 
        mediaUrls: ['https://picsum.photos/seed/harvest/400/400', 'https://picsum.photos/seed/citrus/400/400'], 
        nodeTime: '2021.11.05', 
        operator: '老陈' 
      }
    ]
  },
  'PREMIUM_2018': {
    origin: '新会梅江',
    years: 6,
    agingStatus: '核心产区 · 梅江',
    initialScanCount: 7, 
    nodes: [
      { id: '10', nodeName: '六年陈化完成', description: '经历六载寒暑，陈皮表面油室饱满，香气由清香转化为醇厚的陈香。药用价值达到理想平衡点。在此期间，仓库始终保持恒温恒湿，最大限度保留了活性成分。', mediaUrls: ['https://picsum.photos/seed/aging/400/400'], nodeTime: '2024.01.10', operator: '资深药剂师' },
      { id: '9', nodeName: '2021年定期维护', description: '每季度例行检查仓库温湿度。对部分陈皮进行抽样复晒，保持干燥。', mediaUrls: ['https://picsum.photos/seed/warehouse/400/400'], nodeTime: '2021.06.15', operator: '仓库管理员' },
      { id: '8', nodeName: '2018年冬至开皮', description: '正宗三瓣开皮法，刀口整齐，不伤及果肉油室。采用传统吊挂自然晾干。', mediaUrls: ['https://picsum.photos/seed/peel6/400/400'], nodeTime: '2018.12.01', operator: '传统手艺人' }
    ]
  }
};

const ConsumerLanding: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [productData, setProductData] = useState(BATCH_DATA_MAP['DEFAULT']);
  const [aiCritique, setAiCritique] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [firstScanTime] = useState('2024-05-20 14:30:05');

  const generateAiCritique = async (data: typeof productData) => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `你是一位拥有40年经验的新会陈皮鉴定大师。请根据以下批次数据写一段3句左右、富有诗意、高端雅致的中文品鉴语：产地：${data.origin}，陈化：${data.years}年，包含采摘、翻晒、出库等节点。请侧重分析其可能的香气演变和收藏价值。`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiCritique(response.text || '暂无大师点评。');
    } catch (error) {
      console.error("AI Critique error:", error);
      setAiCritique('大师正在闭关，请稍后再试。');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsLoading(true);
      setTimeout(() => {
        const mockIds = ['DEFAULT', 'PREMIUM_2018'];
        const randomId = mockIds[Math.floor(Math.random() * mockIds.length)];
        const data = BATCH_DATA_MAP[randomId];
        
        setProductData(data);
        setScanCount(data.initialScanCount + 1);
        setHasData(true);
        setIsLoading(false);
        generateAiCritique(data);
      }, 1200);
    }, 1500);
  };

  const getSecurityStatus = () => {
    const threshold = 5;
    const progress = Math.min((scanCount / threshold) * 100, 100);
    
    let colorClass = "from-green-400 to-green-600";
    let bgClass = "bg-green-100";
    let textClass = "text-green-600";

    if (scanCount > 1 && scanCount < threshold) {
      colorClass = "from-yellow-400 to-yellow-600";
      bgClass = "bg-yellow-100";
      textClass = "text-yellow-600";
    } else if (scanCount >= threshold) {
      colorClass = "from-red-500 to-red-700";
      bgClass = "bg-red-200";
      textClass = "text-red-700";
    }

    const renderContent = () => {
      if (scanCount === 1) {
        return (
          <div className="bg-green-50 border border-green-200 p-5 rounded-2xl flex flex-col space-y-4 mb-8 shadow-sm animate-fadeIn">
            <div className="flex items-center space-x-4">
              <div className="flex-none bg-green-500 text-white p-2.5 rounded-full shadow-lg shadow-green-100 ring-4 ring-green-50">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <div className="flex-1">
                <p className="text-green-800 text-sm font-bold tracking-wider">正品认证</p>
                <p className="text-green-700 text-[10px] mt-0.5 leading-relaxed font-serif">您是第 1 位查询者，请放心食用。</p>
              </div>
            </div>
            {renderProgressBar(progress, colorClass, bgClass, textClass)}
          </div>
        );
      } else if (scanCount > 1 && scanCount < threshold) {
        return (
          <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-2xl flex flex-col space-y-4 mb-8 shadow-sm animate-fadeIn">
            <div className="flex items-center space-x-4">
              <div className="flex-none bg-yellow-500 text-white p-2.5 rounded-full shadow-lg shadow-yellow-100 ring-4 ring-yellow-50">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <div className="flex-1">
                <p className="text-yellow-800 text-sm font-bold tracking-wider">重复查询警告</p>
                <p className="text-yellow-700 text-[10px] mt-0.5 leading-relaxed font-serif">
                  该码已被查询 <span className="font-bold underline text-yellow-900">{scanCount}</span> 次，首次查询：<span className="font-serif italic">[{firstScanTime}]</span>
                </p>
              </div>
            </div>
            {renderProgressBar(progress, colorClass, bgClass, textClass)}
          </div>
        );
      } else {
        return (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md"></div>
            <div className="relative bg-red-600 p-8 rounded-[2.5rem] text-white text-center shadow-[0_20px_80px_rgba(220,38,38,0.6)] border-4 border-white/10 max-w-sm w-full animate-shake">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-white/5">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h2 className="text-3xl font-black tracking-[0.2em] mb-4">高危警报</h2>
              <p className="text-[11px] leading-relaxed font-bold font-serif px-2 mb-8">
                警报：该码已被查询超过 <span className="text-yellow-300 text-2xl">{scanCount}</span> 次，极有可能是复制码，请谨防假冒！
              </p>
              <div className="space-y-2 mb-10">
                <div className="flex justify-between items-center text-[10px] text-white/60 font-black px-1 uppercase tracking-widest">
                  <span>危及安全</span>
                  <span>{scanCount} / {threshold} 次</span>
                </div>
                <div className="w-full h-2.5 bg-red-900/40 rounded-full overflow-hidden p-[1.5px] border border-white/10">
                  <div 
                    className="h-full bg-white shadow-[0_0_15px_white] transition-all duration-1000 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setHasData(false)}
                  className="w-full bg-white text-red-600 py-4 rounded-2xl font-black tracking-widest text-xs shadow-xl active:scale-95 transition-all"
                >
                  关闭查询窗口
                </button>
              </div>
            </div>
          </div>
        );
      }
    };

    const renderProgressBar = (prog: number, color: string, bg: string, text: string) => (
      <div className="space-y-2">
        <div className={`flex justify-between items-center text-[9px] ${text} font-black px-1 uppercase tracking-[0.2em]`}>
          <span>安全评估</span>
          <span>{scanCount} / {threshold} 次</span>
        </div>
        <div className={`w-full h-2 ${bg} rounded-full overflow-hidden p-[1px]`}>
          <div 
            className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${prog}%` }}
          ></div>
        </div>
      </div>
    );

    return renderContent();
  };

  return (
    <div className="bg-[#FAFAEE] min-h-screen pb-24 relative font-serif select-none overflow-x-hidden">
      {/* 扫码动画遮罩 */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="relative w-72 h-72 border-2 border-[#8B4513]/30 rounded-[3rem] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#8B4513] to-transparent shadow-[0_0_20px_#8B4513] animate-scanLine"></div>
            <div className="absolute inset-0 border-[30px] border-black/50"></div>
          </div>
          <p className="mt-12 text-[#F5F5DC]/60 text-sm tracking-[0.5em] font-light animate-pulse uppercase">Verifying Digital ID</p>
        </div>
      )}

      {/* 加载中 */}
      {isLoading && (
        <div className="fixed inset-0 z-[99] bg-[#FAFAEE] flex flex-col items-center justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-2 border-[#8B4513]/10 rounded-full"></div>
            <div className="absolute inset-0 border-t-2 border-[#8B4513] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-[#8B4513] font-bold tracking-tighter">读取档案</div>
          </div>
        </div>
      )}

      {!hasData ? (
        <div className="flex flex-col items-center justify-center min-h-screen px-12 text-center animate-fadeIn">
          <div className="relative w-48 h-48 mb-16">
            <div className="absolute inset-0 bg-[#8B4513]/5 rounded-full scale-125 animate-pulse"></div>
            <div className="absolute inset-0 border border-[#8B4513]/10 rounded-full shadow-inner flex items-center justify-center">
              <svg className="w-20 h-20 text-[#8B4513]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
            </div>
          </div>
          <h2 className="text-3xl font-black text-[#8B4513] mb-6 tracking-[0.5em]">陈皮档案</h2>
          <p className="text-gray-400 text-[11px] leading-[2.2] mb-16 font-serif italic px-4">
            "三瓣如花，陈久逾香"<br/>每一两陈皮都承载着时光的厚度<br/>请点击开启摄像头扫描产品防伪码
          </p>
          <button 
            onClick={handleScan}
            className="w-full bg-[#8B4513] text-[#F5F5DC] py-5 rounded-full shadow-[0_15px_40px_rgba(139,69,19,0.2)] font-black tracking-[0.4em] active:scale-95 transition-all text-xs uppercase"
          >
            开启溯源验证
          </button>
        </div>
      ) : (
        <div className="animate-fadeIn">
          {/* Header */}
          <div className="relative h-[26rem] overflow-hidden">
            <img 
              src="https://picsum.photos/seed/xh-cp-01/1200/900" 
              alt="Detail" 
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAEE] via-transparent to-black/20"></div>
            <div className="absolute bottom-14 left-8 right-8 text-[#8B4513]">
              <div className="inline-flex items-center px-4 py-1.5 bg-[#8B4513]/10 backdrop-blur-md rounded-full text-[10px] tracking-[0.3em] font-bold uppercase mb-5 border border-[#8B4513]/20 shadow-sm">
                {productData.agingStatus}
              </div>
              <h1 className="text-7xl font-black tracking-widest leading-none">
                {productData.years}
                <span className="text-2xl ml-3 font-bold opacity-80 underline decoration-2 decoration-[#8B4513]/30 underline-offset-8">年份</span>
              </h1>
            </div>
          </div>

          <div className="px-6 -mt-10 relative z-10">
            {getSecurityStatus()}

            {/* AI Master Appraisal Card */}
            <div className="mb-12 bg-white p-8 rounded-[2.5rem] border-2 border-[#8B4513]/5 shadow-xl relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#8B4513]/5 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
               <div className="flex items-center mb-6">
                 <div className="w-10 h-10 bg-[#8B4513] rounded-full flex items-center justify-center text-[#F5F5DC] shadow-lg">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                 </div>
                 <h3 className="ml-4 text-sm font-black text-[#8B4513] tracking-[0.4em] uppercase">AI 大师赏析</h3>
                 {isAiLoading && (
                   <div className="ml-auto flex space-x-1">
                     <div className="w-1 h-1 bg-[#8B4513] rounded-full animate-bounce"></div>
                     <div className="w-1 h-1 bg-[#8B4513] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                     <div className="w-1 h-1 bg-[#8B4513] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
                 )}
               </div>
               <p className={`text-[12px] leading-[2.2] text-gray-700 font-serif italic text-justify transition-opacity duration-500 ${isAiLoading ? 'opacity-30' : 'opacity-100'}`}>
                 {aiCritique || "大师正在细品，请稍候..."}
               </p>
               <div className="mt-6 flex items-center justify-end">
                 <div className="text-[10px] text-[#8B4513]/40 tracking-widest uppercase font-black">Powered by Gemini AI</div>
               </div>
            </div>

            {/* Timeline Section */}
            <div className="relative">
              <div className="absolute left-[1.1rem] top-8 bottom-8 w-[2px] bg-gradient-to-b from-[#8B4513]/40 via-[#8B4513]/5 to-transparent"></div>

              <div className="flex flex-col gap-14">
                {productData.nodes.map((node, index) => (
                  <div key={node.id} className="relative flex">
                    <div className="flex-none w-[2.2rem] flex justify-center pt-2.5">
                      <div className="relative z-20">
                        <div className="w-4.5 h-4.5 rounded-full bg-[#8B4513] border-[4px] border-[#FAFAEE] shadow-md"></div>
                        {index === 0 && <div className="absolute inset-0 w-4.5 h-4.5 rounded-full bg-[#8B4513]/40 animate-ping"></div>}
                      </div>
                    </div>

                    <div className="flex-1 ml-5 min-w-0 pb-2">
                      <div className="text-[10px] text-[#8B4513]/60 font-black tracking-widest mb-4 flex items-center h-6 uppercase font-serif">
                        <svg className="w-4 h-4 mr-2 opacity-40" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
                        {node.nodeTime}
                      </div>
                      
                      <div className="bg-white/95 backdrop-blur-md p-8 rounded-[2.5rem] border border-[#E5E5CA]/40 shadow-[0_4px_30px_rgba(139,69,19,0.04)] hover:shadow-2xl transition-all duration-700 group">
                        <div className="flex items-start justify-between mb-6">
                          <h3 className="text-xl font-black text-gray-800 tracking-wider leading-tight flex-1">
                            {node.nodeName}
                          </h3>
                        </div>
                        
                        <p className="text-[11px] text-gray-500 leading-loose mb-8 font-serif text-justify break-words tracking-tight px-1">
                          {node.description}
                        </p>
                        
                        {node.mediaUrls && node.mediaUrls.length > 0 && (
                          <div className={`grid gap-5 mb-8 ${
                            node.mediaUrls.length === 1 ? 'grid-cols-1' : 
                            node.mediaUrls.length === 2 ? 'grid-cols-2' : 
                            'grid-cols-3'
                          }`}>
                            {node.mediaUrls.map((url, i) => (
                              <div key={i} className="aspect-square rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 group/img relative shadow-inner">
                                <img src={url} alt="Node detail" className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-125" loading="lazy" />
                                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors duration-300"></div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-8 border-t border-[#8B4513]/10">
                          <div className="flex items-center space-x-4">
                            <div className="w-9 h-9 bg-gradient-to-br from-[#8B4513] to-[#5C2E0C] rounded-full flex items-center justify-center text-[10px] text-white font-black italic shadow-xl">
                              {node.operator.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[8px] text-gray-400 font-black uppercase tracking-[0.2em] mb-0.5">档案核实员</span>
                              <span className="text-[13px] text-gray-800 font-black tracking-tight">{node.operator}</span>
                            </div>
                          </div>
                          <div className="flex items-center text-[#8B4513]/40 text-[9px] font-black tracking-[0.3em] italic uppercase">
                             Block-Verified
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      {hasData && scanCount < 5 && (
        <button 
          onClick={handleScan}
          className="fixed bottom-12 right-10 w-16 h-16 bg-[#8B4513] text-[#F5F5DC] rounded-full shadow-[0_20px_50px_rgba(139,69,19,0.4)] flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-[80] group border border-[#F5F5DC]/10"
        >
          <svg className="w-8 h-8 group-hover:rotate-12 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
          </svg>
        </button>
      )}

      <style>{`
        @keyframes scanLine {
          0% { transform: translateY(0); }
          50% { transform: translateY(288px); }
          100% { transform: translateY(0); }
        }
        .animate-scanLine { animation: scanLine 3.5s ease-in-out infinite; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.7s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
};

export default ConsumerLanding;
