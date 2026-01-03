
import React, { useState, useEffect } from 'react';
import { TraceNode } from '../types';

// 模拟不同产品的溯源数据，增加长文本测试
const BATCH_DATA_MAP: Record<string, { nodes: TraceNode[], years: number, agingStatus: string }> = {
  'DEFAULT': {
    years: 3,
    agingStatus: '核心产区 · 天马',
    nodes: [
      { 
        id: '4', 
        nodeName: '成品出库', 
        description: '经过严格的感官评审与农残检测，各项指标均符合新会陈皮地理标志产品标准。本批次采用传统麻袋封装，进入成品库待发。', 
        mediaUrls: ['https://picsum.photos/seed/out/400/400'], 
        nodeTime: '2024.03.15', 
        operator: '张主管' 
      },
      { 
        id: '3', 
        nodeName: '2023年冬至翻晒', 
        description: '挑选冬至前后的连续晴天进行翻晒。此时空气干燥，利于陈皮内部水分均匀散发。翻晒过程中需人工定时翻动，确保每一瓣陈皮都能充分接触阳光，剔除少量受潮或变质个体。', 
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
    years: 6,
    agingStatus: '核心产区 · 梅江',
    nodes: [
      { id: '10', nodeName: '六年陈化完成', description: '经历六载寒暑，陈皮表面油室饱满，香气由清香转化为醇厚的陈香。药用价值达到理想平衡点点。', mediaUrls: ['https://picsum.photos/seed/aging/400/400'], nodeTime: '2024.01.10', operator: '资深药剂师' },
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
  const [firstScanTime] = useState('2024-05-20 14:30:05');

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsLoading(true);
      setTimeout(() => {
        const mockIds = ['DEFAULT', 'PREMIUM_2018'];
        const randomId = mockIds[Math.floor(Math.random() * mockIds.length)];
        setProductData(BATCH_DATA_MAP[randomId]);
        setScanCount(prev => prev + 1);
        setHasData(true);
        setIsLoading(false);
      }, 1000);
    }, 1500);
  };

  const getSecurityStatus = () => {
    if (scanCount === 1) {
      return (
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center space-x-3 mb-8">
          <div className="bg-green-500 text-white p-1.5 rounded-full shadow-lg shadow-green-200">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <div>
            <p className="text-green-800 text-sm font-bold">正品认证：首位查询</p>
            <p className="text-green-600/70 text-[10px]">溯源码首次被扫描，确保正宗新会出产。</p>
          </div>
        </div>
      );
    } else if (scanCount > 1 && scanCount < 5) {
      return (
        <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex items-center space-x-3 mb-8">
          <div className="bg-yellow-500 text-white p-1.5 rounded-full shadow-lg shadow-yellow-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <div>
            <p className="text-yellow-800 text-sm font-bold">注意：重复查询</p>
            <p className="text-yellow-600/70 text-[10px]">该码已被查询 {scanCount} 次。首次查询：{firstScanTime}。</p>
          </div>
        </div>
      );
    } else if (scanCount >= 5) {
      return (
        <div className="bg-red-50 border border-red-100 p-5 rounded-xl flex flex-col items-center text-center space-y-2 mb-8 animate-pulse">
          <div className="bg-red-600 text-white p-3 rounded-full shadow-xl shadow-red-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <div>
            <p className="text-red-700 text-base font-bold">高危预警</p>
            <p className="text-red-500 text-[10px]">查询过于频繁，疑似复制码，请核实产品真伪！</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#FAFAEE] min-h-screen pb-24 relative font-serif select-none">
      {/* 扫码动画遮罩 */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="relative w-64 h-64 border border-[#F5F5DC]/20 rounded-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent shadow-[0_0_20px_rgba(250,204,21,0.9)] animate-[scan_2.5s_infinite]"></div>
            <div className="absolute inset-0 border-[20px] border-black/40"></div>
          </div>
          <p className="mt-10 text-[#F5F5DC]/80 text-sm tracking-[0.3em] font-light animate-pulse">正在对准溯源码...</p>
          <style>{`
            @keyframes scan {
              0% { transform: translateY(0); }
              50% { transform: translateY(256px); }
              100% { transform: translateY(0); }
            }
          `}</style>
        </div>
      )}

      {/* 加载中 */}
      {isLoading && (
        <div className="fixed inset-0 z-[99] bg-[#FAFAEE] flex flex-col items-center justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-2 border-[#8B4513]/10 rounded-full"></div>
            <div className="absolute inset-0 border-t-2 border-[#8B4513] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-[#8B4513] font-bold tracking-tighter">读取中</div>
          </div>
        </div>
      )}

      {!hasData ? (
        <div className="flex flex-col items-center justify-center min-h-screen px-10 text-center">
          <div className="relative w-40 h-40 mb-12">
            <div className="absolute inset-0 bg-[#8B4513]/5 rounded-full scale-125 animate-pulse"></div>
            <div className="absolute inset-0 border border-[#8B4513]/10 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-[#8B4513]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#8B4513] mb-4 tracking-[0.4em]">匠心守拙</h2>
          <p className="text-gray-400 text-xs leading-relaxed mb-12 font-serif italic">
            "三时陈皮，百年匠心"<br/>每一份档案都承载着新会土地的记忆
          </p>
          <button 
            onClick={handleScan}
            className="w-full bg-[#8B4513] text-[#F5F5DC] py-4 rounded-full shadow-2xl shadow-[#8B4513]/30 font-bold tracking-[0.2em] active:scale-95 transition-transform"
          >
            开启溯源验证
          </button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="relative h-[22rem] overflow-hidden shadow-xl">
            <img 
              src="https://picsum.photos/seed/chenpi-detail/1200/900" 
              alt="Detail" 
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAEE] via-transparent to-black/20"></div>
            <div className="absolute bottom-10 left-8 right-8 text-white">
              <div className="inline-flex items-center px-3 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[9px] tracking-widest uppercase mb-3 border border-white/20">
                {productData.agingStatus}
              </div>
              <h1 className="text-5xl font-bold tracking-[0.15em] text-[#8B4513] drop-shadow-sm">
                年份 · <span className="text-[#8B4513]">{productData.years}</span>
                <span className="text-2xl ml-2 font-normal">年</span>
              </h1>
            </div>
          </div>

          <div className="px-5 -mt-6 relative z-10">
            {getSecurityStatus()}

            {/* Timeline Section */}
            <div className="relative">
              {/* Vertical Trace Line */}
              <div className="absolute left-[0.9rem] top-4 bottom-4 w-[1px] bg-gradient-to-b from-[#8B4513]/40 via-[#8B4513]/10 to-transparent"></div>

              <div className="flex flex-col gap-10">
                {productData.nodes.map((node, index) => (
                  <div key={node.id} className="relative flex">
                    {/* Node Dot - Aligned with the first line of content */}
                    <div className="flex-none w-8 flex justify-center mt-1.5">
                      <div className="relative z-20">
                        <div className="w-4 h-4 rounded-full bg-[#8B4513] border-[3px] border-[#FAFAEE] shadow-sm"></div>
                        <div className="absolute inset-0 w-4 h-4 rounded-full bg-[#8B4513]/20 animate-ping"></div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="flex-1 ml-4 min-w-0">
                      <div className="text-[10px] text-[#8B4513]/50 font-bold tracking-tight mb-2 flex items-center">
                        <svg className="w-3 h-3 mr-1 opacity-40" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
                        {node.nodeTime}
                      </div>
                      
                      <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-[#E5E5CA]/40 shadow-sm hover:shadow-md transition-all">
                        <h3 className="text-lg font-bold text-gray-800 mb-2.5 tracking-wide flex items-center">
                          {node.nodeName}
                          {index === 0 && <span className="ml-2 text-[9px] bg-[#8B4513]/5 text-[#8B4513] px-1.5 py-0.5 rounded border border-[#8B4513]/10">最新节点</span>}
                        </h3>
                        
                        <p className="text-xs text-gray-500 leading-relaxed mb-5 font-serif text-justify break-words hyphens-auto">
                          {node.description}
                        </p>
                        
                        {/* Media Grid - Intelligent Layout */}
                        <div className={`grid gap-2 ${node.mediaUrls.length === 1 ? 'grid-cols-1' : node.mediaUrls.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                          {node.mediaUrls.map((url, i) => (
                            <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group">
                              <img 
                                src={url} 
                                alt="Node" 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Card Footer */}
                        <div className="mt-5 flex justify-between items-center pt-4 border-t border-[#8B4513]/5">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-[#8B4513] to-[#A0522D] rounded-full flex items-center justify-center text-[8px] text-white font-bold italic shadow-sm">
                              {node.operator.charAt(0)}
                            </div>
                            <span className="text-[10px] text-gray-400">经办人：<span className="text-gray-600">{node.operator}</span></span>
                          </div>
                          <div className="flex items-center text-[#8B4513]/60 text-[9px] tracking-widest font-bold">
                             <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                             链上加密存证
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* FAB */}
      {hasData && (
        <button 
          onClick={handleScan}
          className="fixed bottom-8 right-6 w-14 h-14 bg-[#8B4513] text-[#F5F5DC] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-50 group"
        >
          <svg className="w-7 h-7 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default ConsumerLanding;
