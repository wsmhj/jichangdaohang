'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('admin');
  const tCommon = useTranslations('admin.common');

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
      setError('Failed to authenticate. Please try again.');
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  if (isLoading) {
    return <div className="container mx-auto p-4">{tCommon('loading')}</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4">{tCommon('error')}: {error}</div>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className='mt-6'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">{t('dashboard.title')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="text-2xl font-bold my-6">{t('dashboard.title')}</h1>
      <h2 className="text-xl font-bold my-4">{t('dashboard.articles')}</h2>
      <div className="mb-4 pb-8 border-b">
        <Link href="/admin/articles">
          <Button>{t('dashboard.articles')}</Button>
        </Link>
      </div>
      <h2 className="text-xl font-bold mb-4">{t('dashboard.categories')}</h2>
      <div className="mb-8">
        <Link href="/admin/category">
          <Button>{t('dashboard.categories')}</Button>
        </Link>
      </div>
      <div className="my-8">
        <Button onClick={handleLogout}>{tCommon('logout')}</Button>
      </div>
    </div>
  );
}