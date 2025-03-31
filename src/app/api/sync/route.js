import { NextResponse } from 'next/server';
import { syncArticles, syncWebsiteData, syncAllData } from '@/lib/syncData';
import { verifyToken } from '@/lib/auth';

// GET方法处理同步请求
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = request.cookies.get('auth_token')?.value;
  const isAdmin = token ? verifyToken(token) : false;
  
  // 验证请求是否来自管理员
  if (!isAdmin) {
    return NextResponse.json(
      { error: '未授权访问' }, 
      { status: 401 }
    );
  }
  
  const type = searchParams.get('type') || 'all';
  const locale = searchParams.get('locale') || 'zh';
  
  try {
    let result;
    switch (type) {
      case 'articles':
        result = await syncArticles();
        return NextResponse.json({ success: true, data: result });
      
      case 'websites':
        result = await syncWebsiteData(locale);
        return NextResponse.json({ success: true, data: result });
      
      case 'all':
      default:
        result = await syncAllData();
        return NextResponse.json(result);
    }
  } catch (error) {
    console.error('同步时出错:', error);
    return NextResponse.json(
      { success: false, error: '同步数据时出错: ' + error.message }, 
      { status: 500 }
    );
  }
} 