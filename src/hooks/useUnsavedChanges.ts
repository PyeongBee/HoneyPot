import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { useConfirmStore } from '../stores/confirmStore';

interface UseUnsavedChangesProps {
  hasUnsavedChanges: boolean;
  message?: string;
}

export const useUnsavedChanges = ({ 
  hasUnsavedChanges, 
  message = "입력한 내용이 있습니다. 정말 나가시겠습니까? 저장되지 않은 내용은 사라집니다." 
}: UseUnsavedChangesProps) => {
  const router = useRouter();
  const { showConfirm } = useConfirmStore();
  const hasUnsavedChangesRef = useRef(hasUnsavedChanges);

  // hasUnsavedChanges 상태를 ref로 동기화
  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  useEffect(() => {
    // 브라우저 새로고침/닫기 시 경고
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChangesRef.current) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Next.js 13+ App Router에서는 router events가 다르게 작동
    // 대신 Link 컴포넌트를 래핑하여 처리

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [message]);

  // 네비게이션 확인 함수
  const confirmNavigation = (href: string) => {
    if (hasUnsavedChangesRef.current) {
      showConfirm({
        message: message,
        confirmText: "나가기",
        variant: "destructive",
        onConfirm: () => {
          router.push(href);
        },
      });
    } else {
      router.push(href);
    }
  };

  return { confirmNavigation };
};
