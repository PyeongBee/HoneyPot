'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, ArrowLeft } from 'lucide-react';
import { NAVIGATION } from '../constants';

export default function NotFound() {
  return (
    <div className="min-h-screen from-brand-50 to-brand-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 로고 */}
        <div className="mb-8">
          <Image
            src={NAVIGATION.LOGO_PATH}
            alt={NAVIGATION.LOGO_ALT}
            width={120}
            height={120}
            className="mx-auto object-contain"
            priority
          />
        </div>

        {/* 404 메시지 */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-brand-500 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.<br />
            URL을 다시 확인해 주세요.
          </p>
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-4">
          <Link
            href="/editor"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 active:bg-brand-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            자소서 에디터로 이동
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            이전 페이지로 돌아가기
          </button>
        </div>

        {/* 추가 도움말 */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            문제가 지속되면{' '}
            <a 
              href="mailto:support@example.com" 
              className="text-brand-500 hover:text-brand-600 underline"
            >
              고객지원
            </a>
            으로 문의해 주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
