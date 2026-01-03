
import React, { useState } from 'react';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'generate'>('upload');

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <div className="flex space-x-4 mb-8 border-b">
        <button 
          onClick={() => setActiveTab('upload')}
          className={`pb-2 px-4 ${activeTab === 'upload' ? 'border-b-2 border-[#8B4513] text-[#8B4513] font-bold' : 'text-gray-400'}`}
        >
          节点数据上传
        </button>
        <button 
          onClick={() => setActiveTab('generate')}
          className={`pb-2 px-4 ${activeTab === 'generate' ? 'border-b-2 border-[#8B4513] text-[#8B4513] font-bold' : 'text-gray-400'}`}
        >
          批量生码管理
        </button>
      </div>

      {activeTab === 'upload' ? (
        <div className="space-y-6">
          <div className="p-6 bg-[#FAFAEE] rounded-lg border border-[#E5E5CA]">
            <h2 className="text-lg font-bold mb-4">功能 A：节点上链 & 状态更新 (Service层伪代码)</h2>
            <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm overflow-x-auto">
              <pre>{`
/**
 * @description 添加溯源节点逻辑
 */
async createTraceNode(batchId: string, nodeData: any) {
  // ... 多媒体上传并写入 trace_nodes 表
}

/**
 * @description 更新批次生命周期状态
 * @param batchId 批次ID
 * @param status 新状态 ('陈化中' | '已出库')
 */
async updateBatchStatus(batchId: string, status: string) {
  const result = await this.prisma.batches.update({
    where: { id: batchId },
    data: { status }
  });
  
  // 状态变更记录也作为一个特殊的溯源节点自动生成
  await this.createTraceNode(batchId, {
    name: '状态变更: ' + status,
    desc: '批次状态已由系统管理员手动更新。'
  });
  
  return result;
}
              `}</pre>
            </div>
          </div>
          <form className="space-y-4 border p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">关联批次</label>
                <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                  <option>2021-TM-001 (天马核心产区-圈枝)</option>
                  <option>2023-MG-005 (梅江核心产区-驳枝)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">更新批次状态</label>
                <div className="mt-1 flex space-x-2">
                  <select className="flex-1 border-gray-300 rounded-md shadow-sm p-2 border">
                    <option value="陈化中">陈化中 (Aging)</option>
                    <option value="已出库">已出库 (Shipped)</option>
                  </select>
                  <button type="button" className="bg-[#8B4513]/10 text-[#8B4513] px-3 py-1 rounded-lg text-xs font-bold border border-[#8B4513] hover:bg-[#8B4513] hover:text-white transition-colors">
                    确认更新
                  </button>
                </div>
              </div>
            </div>

            <hr className="my-4 border-gray-100" />

            <div>
              <label className="block text-sm font-medium text-gray-700">节点名称</label>
              <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border" placeholder="如：翻晒、施肥、入库" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">节点描述</label>
              <textarea className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border h-20" placeholder="请详细描述该节点的操作内容..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">图片/视频上传</label>
              <div className="mt-1 border-2 border-dashed border-gray-300 p-8 text-center rounded-lg text-gray-400 hover:border-[#8B4513] transition cursor-pointer">
                点击或拖拽文件上传 (支持 JPG, PNG, MP4)
              </div>
            </div>
            <button type="button" className="w-full bg-[#8B4513] text-white py-2 rounded-lg font-bold">提交上链</button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
           <div className="p-6 bg-[#FAFAEE] rounded-lg border border-[#E5E5CA]">
            <h2 className="text-lg font-bold mb-4">功能 B：批量生码逻辑 (Service层伪代码)</h2>
            <div className="bg-gray-900 text-blue-400 p-4 rounded-md font-mono text-sm overflow-x-auto">
              <pre>{`
/**
 * @description 批量生成一物一码
 */
async generateBatchCodes(count: number, batchId: string) {
  // ... 生成 UUID 序列并批量插入数据库
}
              `}</pre>
            </div>
          </div>
          <div className="border p-6 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">选择生码批次</label>
              <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                <option>2021-TM-001 (当前库存 500kg)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">生成数量</label>
              <input type="number" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border" defaultValue={1000} />
            </div>
            <button type="button" className="w-full bg-[#8B4513] text-white py-2 rounded-lg font-bold">立即生成并导出 Excel</button>
            <p className="text-xs text-gray-400 text-center">系统将自动生成不重复的 UUID 并建立批次关联</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
