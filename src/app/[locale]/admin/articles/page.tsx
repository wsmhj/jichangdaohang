'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslations } from 'next-intl';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const t = useTranslations('admin.articles');
  const tCommon = useTranslations('admin.common');
  const tDashboard = useTranslations('admin.dashboard');

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/check-auth');
      const data = await response.json();
      if (!data.isLoggedIn) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/login');
    }
  }, [router]);

  const fetchArticles = useCallback(async (sync = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/articles${sync ? '?sync=true' : ''}`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      // @ts-ignore
      setError('Failed to fetch articles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    fetchArticles();
  }, [checkAuth, fetchArticles]);

  const handleSync = useCallback(() => {
    fetchArticles(true);
  }, [fetchArticles]);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  if (isLoading) return <div className="container mx-auto p-4">{tCommon('loading')}</div>;
  if (error) return <div className="container mx-auto p-4">{tCommon('error')}: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className='my-6'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">{tDashboard('title')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/articles">{t('title')}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      <div className="mb-4 flex justify-between">
        <div>
          <Button onClick={handleSync} className="mr-2">{tCommon('sync')}</Button>
          <Link href="/admin/articles/create">
            <Button>{t('create')}</Button>
          </Link>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('name')}</TableHead>
            <TableHead>{t('description')}</TableHead>
            <TableHead>{t('createdAt')}</TableHead>
            <TableHead>{t('updatedAt')}</TableHead>
            <TableHead>{tCommon('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article, index) => (
            <TableRow key={index}>
              {/* @ts-ignore */}
              <TableCell>{article.title}</TableCell>
              {/* @ts-ignore */}
              <TableCell>{article.description}</TableCell>
              {/* @ts-ignore */}
              <TableCell>{new Date(article.date).toLocaleDateString()}</TableCell>
              {/* @ts-ignore */}
              <TableCell>{new Date(article.lastModified).toLocaleString()}</TableCell>
              <TableCell>
                {/* @ts-ignore */}
                <Link href={`/admin/articles/edit?path=${encodeURIComponent(article.path)}`}>
                  <Button>{tCommon('edit')}</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="my-8">
        <Button onClick={handleLogout}>{tCommon('logout')}</Button>
      </div>
    </div>
  );
}