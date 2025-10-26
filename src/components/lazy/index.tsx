/**
 * 지연 로딩 컴포넌트들
 */

import dynamic from "next/dynamic";

// 로딩 컴포넌트
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
  </div>
);

// 에디터 컴포넌트들을 동적 import
export const LazyEditor = dynamic(() => import("../editor/Editor"), {
  loading: LoadingSpinner,
  ssr: false,
});

export const LazySpellCheckSidebar = dynamic(
  () => import("../editor/SpellCheckSidebar"),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const LazyQualityCheckSidebar = dynamic(
  () => import("../editor/QualityCheckSidebar"),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const LazyQualityHighlightedText = dynamic(
  () => import("../editor/QualityHighlightedText"),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const LazyDiffViewer = dynamic(() => import("../editor/DiffViewer"), {
  loading: LoadingSpinner,
  ssr: false,
});

export const LazyOriginalEditor = dynamic(
  () => import("../editor/OriginalEditor"),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);
