// components/Footer.js
import { Link } from "@/lib/i18n";
import React from 'react'; // 确保导入 React
import Image from "next/image";
import IconImage from "../../public/favicon.svg";
import {useTranslations, useLocale} from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  const size = 30;
  const locale = useLocale();
  
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-muted-foreground border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className='flex flex-col items-start space-y-4'>
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={IconImage}
                className="block opacity-80"
                width={size}
                height={size}
                alt="DomainScore"
              />
              <span className="inline-block font-bold">{locale === 'en' ? 'Airport Recommendations' : '机场推荐'}</span>
            </Link>
            <div className="space-y-2">
              <p className="text-sm">
                {t('description')}
              </p>
              <p className="text-sm">
                {locale === 'en' 
                  ? 'We provide comprehensive recommendations for premium, established, and affordable VPN services, including Clash, Shadowrocket, V2ray, and Trojan airports. Our goal is to help you easily access global internet with stable and reliable nodes.'
                  : '我们提供最全面的高端机场、老牌机场、便宜机场推荐，包含Clash机场、Shadowrocket机场、V2ray机场和Trojan机场等各类付费稳定翻墙节点。致力于帮助您轻松访问全球网络。'
                }
              </p>
              <p className="text-sm">
                {locale === 'en'
                  ? 'All recommendations are carefully selected and regularly updated to ensure the best user experience.'
                  : '所有推荐均经过精心筛选，定期更新，确保为您提供最佳的使用体验。'
                }
              </p>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-8'>
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase">{t('quickLinks')}</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link href="/" className="text-sm hover:text-foreground transition-colors">
                    {t('home')}
                  </Link>
                </li>
                <li>
                  <Link href="/category" className="text-sm hover:text-foreground transition-colors">
                    {t('category')}
                  </Link>
                </li>
                <li>
                  <Link href="/article" className="text-sm hover:text-foreground transition-colors">
                    {t('article')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-center">
            &copy; {new Date().getFullYear()} {locale === 'en' ? 'Airport Recommendations' : '机场推荐'}. {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}