/**
 * 에디터 관련 타입 정의
 */

export type ViewMode = "original" | "edit" | "result";

export interface EditorState {
  originalText: string;
  editedText: string;
  questionText: string;
  questionCharLimit: number;
  viewMode: ViewMode;
  shareId: string;
  isHeaderVisible: boolean;
  lastScrollY: number;
  shareUrl: string;
  isCopied: boolean;
}

export interface ShareData {
  original: string;
  edited: string;
  question: string;
  questionLimit: number;
  timestamp: string;
}

export interface ShareHistory {
  id: string;
  title: string;
  url: string;
  shareData: ShareData;
  createdAt: string;
}

export interface Memo {
  id: string;
  text: string;
  selectedText: string;
  startIndex: number;
  endIndex: number;
  timestamp: string;
}

export interface SelectionInfo {
  text: string;
  startIndex: number;
  endIndex: number;
}

export interface CharacterCountProps {
  characterCount: number;
  wordCount: number;
  lineCount: number;
  charLimit: number;
  isOverLimit: boolean;
}

export interface CopyResult {
  success: boolean;
  message: string;
}

export interface SpellCheckSidebarProps {
  onApplyCorrections: () => void;
}
