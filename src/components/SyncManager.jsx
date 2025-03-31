'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function SyncManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [error, setError] = useState(null);
  const [syncType, setSyncType] = useState('all');
  const [locale, setLocale] = useState('zh');

  const handleSync = async () => {
    setIsLoading(true);
    setSyncResult(null);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append('type', syncType);
      if (syncType === 'websites') {
        queryParams.append('locale', locale);
      }

      const response = await fetch(`/api/sync?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
      }
      
      const data = await response.json();
      setSyncResult(data);
    } catch (err) {
      setError(err.message || '同步过程中发生错误');
      console.error('同步错误:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>数据同步管理</CardTitle>
        <CardDescription>
          将GitHub上的更改同步到本地, 确保前端和后端数据保持一致
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="quick" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="quick">快速同步</TabsTrigger>
            <TabsTrigger value="advanced">高级设置</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quick">
            <div className="flex flex-col gap-4">
              <p>一键同步所有数据，包括文章和网站工具</p>
              <Button 
                onClick={() => {
                  setSyncType('all');
                  handleSync();
                }}
                disabled={isLoading}
              >
                {isLoading ? '同步中...' : '同步所有数据'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="syncType">同步类型</Label>
                  <Select 
                    value={syncType} 
                    onValueChange={setSyncType}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="syncType">
                      <SelectValue placeholder="选择要同步的数据类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有数据</SelectItem>
                      <SelectItem value="articles">仅文章</SelectItem>
                      <SelectItem value="websites">仅网站工具</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {syncType === 'websites' && (
                  <div className="space-y-2">
                    <Label htmlFor="locale">语言</Label>
                    <Select 
                      value={locale} 
                      onValueChange={setLocale}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="locale">
                        <SelectValue placeholder="选择语言" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zh">中文</SelectItem>
                        <SelectItem value="en">英文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={handleSync}
                disabled={isLoading}
                className="mt-4"
              >
                {isLoading ? '同步中...' : '开始同步'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>同步失败</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {syncResult && (
          <Alert variant={syncResult.success ? "default" : "destructive"} className="mt-4">
            {syncResult.success ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>{syncResult.success ? '同步成功' : '同步失败'}</AlertTitle>
            <AlertDescription>
              {syncResult.message || (syncResult.success ? '数据已成功同步' : '同步过程中发生错误')}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          上次同步: {syncResult ? new Date().toLocaleString() : '尚未同步'}
        </p>
      </CardFooter>
    </Card>
  );
} 