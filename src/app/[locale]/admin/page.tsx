'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Separator } from '@/components/ui/separator';
import { FileText, BoxesIcon, RefreshCwIcon, LogOut } from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
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
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4">Error: {error}</div>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      setError('登出失败。请重试。');
    }
  }

  const menuItems = [
    {
      title: '文章管理',
      description: '创建、编辑和管理网站上的文章内容',
      href: '/admin/articles',
      icon: <FileText className="h-10 w-10" />,
    },
    {
      title: '机场网站管理',
      description: '添加、编辑和管理机场网站列表和分类',
      href: '/admin/category',
      icon: <BoxesIcon className="h-10 w-10" />,
    },
    {
      title: '数据同步',
      description: '将GitHub上的更改同步到本地，确保前端和后端数据一致',
      href: '/admin/sync',
      icon: <RefreshCwIcon className="h-10 w-10" />,
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className='mt-6'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="text-3xl font-bold mb-6">管理面板</h1>
      <p className="mb-8 text-muted-foreground">欢迎使用管理面板，请从下方选择要管理的内容。</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <Link href={item.href} key={index}>
            <div className="border rounded-lg p-6 h-full hover:shadow-md transition-shadow flex flex-col">
              <div className="mb-4 text-primary">
                {item.icon}
              </div>
              <h2 className="text-xl font-bold mb-2">{item.title}</h2>
              <p className="text-muted-foreground flex-grow">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
      
      <Separator className="my-8" />
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          退出登录
        </Button>
      </div>
    </div>
  );
}