
import React from 'react';

const SystemSpecs: React.FC = () => {
  return (
    <div className="p-6 bg-[#F5F5DC] min-h-screen">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Project Roadmap */}
        <section>
          <h2 className="text-2xl font-bold text-[#8B4513] border-l-4 border-[#8B4513] pl-4 mb-6">1. 生产级分端部署架构</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E5CA]">
              <h3 className="font-bold mb-4 text-[#8B4513]">📱 消费者端 (Consumer App)</h3>
              <ul className="text-sm space-y-2 text-gray-600">
                <li><span className="font-bold">载体：</span> 微信小程序 / H5 落地页</li>
                <li><span className="font-bold">核心：</span> 快速渲染、新中式 UI、防伪展示</li>
                <li><span className="font-bold">技术：</span> Vue3 + Tailwind + 轻量级状态管理</li>
              </ul>
              <div className="mt-4 text-xs bg-gray-50 p-2 rounded">
                注：由 QR 码 UUID 直接引导进入，无需登录。
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E5CA]">
              <h3 className="font-bold mb-4 text-[#8B4513]">💻 管理员端 (Admin Portal)</h3>
              <ul className="text-sm space-y-2 text-gray-600">
                <li><span className="font-bold">载体：</span> PC Web 管理后台</li>
                <li><span className="font-bold">核心：</span> 批次管理、批量生码、OSS 上传、权限控制</li>
                <li><span className="font-bold">技术：</span> Vue3 + Element Plus / Ant Design</li>
              </ul>
              <div className="mt-4 text-xs bg-gray-50 p-2 rounded">
                注：需对接 LDAP 或 统一身份认证系统。
              </div>
            </div>
          </div>
        </section>

        {/* Directory Structure */}
        <section>
          <h2 className="text-2xl font-bold text-[#8B4513] border-l-4 border-[#8B4513] pl-4 mb-6">2. 推荐项目目录 (Monorepo)</h2>
          <div className="bg-gray-900 text-gray-300 p-6 rounded-xl font-mono text-sm overflow-x-auto">
            <pre>{`
/xh-chenpi-workspace
├── packages/
│   ├── api-server/        # NestJS 后端核心 (共享数据库模型)
│   ├── app-consumer/      # 消费者端 (uniapp/vue3) - 侧重 H5/小程序
│   ├── web-admin/         # 管理员端 (vue-element-admin) - 侧重 PC
│   └── shared-utils/      # 共享逻辑 (防伪算法、类型定义)
├── deploy/                # Docker / K8s 部署脚本
└── README.md
            `}</pre>
          </div>
        </section>

        {/* SQL Schema */}
        <section>
          <h2 className="text-2xl font-bold text-[#8B4513] border-l-4 border-[#8B4513] pl-4 mb-6">3. 核心 API 概览</h2>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E5CA]">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-[#8B4513]">接口类型</th>
                  <th className="py-2 text-[#8B4513]">端</th>
                  <th className="py-2">描述</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b">
                  <td className="py-2 font-mono">/trace/:uuid</td>
                  <td className="py-2">C端</td>
                  <td>获取溯源时间轴与扫码次数</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">/admin/batch/create</td>
                  <td className="py-2">B端</td>
                  <td>新建生产批次 (需要 Auth 令牌)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">/admin/node/upload</td>
                  <td className="py-2">B端</td>
                  <td>上传视频/图片并关联节点信息</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">/admin/product/export</td>
                  <td className="py-2">B端</td>
                  <td>导出产品唯一码 Excel (供印刷厂)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SystemSpecs;
