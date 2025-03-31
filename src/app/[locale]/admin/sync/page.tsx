'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SyncManager from '@/components/SyncManager';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function AdminSyncPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/check-auth');
        const data = await response.json();
        if (!data.isLoggedIn) {
          router.push('/login');
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setError('认证失败。请重试。');
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  if (isLoading) return <div className="container mx-auto p-4">加载中...</div>;
  if (error) return <div className="container mx-auto p-4">错误: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="my-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">管理面板</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/sync">数据同步</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <h1 className="text-2xl font-bold mb-8">数据同步管理</h1>
      
      <SyncManager />
      
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">同步说明</h2>
        <div className="prose max-w-none">
          <p>同步操作将执行以下任务：</p>
          <ul>
            <li><strong>文章同步</strong>：从GitHub同步所有Markdown文章到本地，并更新articles.json文件</li>
            <li><strong>网站工具同步</strong>：从GitHub同步所有工具分类和工具列表到本地</li>
          </ul>
          <p className="mt-4">同步完成后，前端页面将自动使用最新数据渲染内容，无需重启服务。</p>
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mt-4">
            <h3 className="font-semibold text-yellow-800">注意事项</h3>
            <p className="text-yellow-700">
              同步过程需要正确配置GitHub环境变量，包括GITHUB_TOKEN、GITHUB_OWNER和GITHUB_REPO。
              如果同步失败，请检查这些配置。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 