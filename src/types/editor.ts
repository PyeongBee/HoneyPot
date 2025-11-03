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

export interface Memo {
  id: string;
  text: string;
  selectedText: string;
  startIndex: number;
  endIndex: number;
  timestamp: string;
}

export interface EditorQuestionState {
  id: string;
  questionText: string;
  questionCharLimit: number;
  originalText: string;
  editedText: string;
  memos: Memo[];
}

export interface ShareQuestionData {
  id: string;
  question: string;
  questionLimit: number;
  original: string;
  edited: string;
  memos: Memo[];
}

export interface ShareDataV1 {
  version?: "v1";
  original: string;
  edited: string;
  question: string;
  questionLimit: number;
  timestamp: string;
  memos: Memo[];
}

export interface ShareDataV2 {
  version: "v2";
  questions: ShareQuestionData[];
  activeQuestionId: string | null;
  timestamp: string;
}

export type ShareData = ShareDataV1 | ShareDataV2;

export interface ShareHistory {
  id: string;
  title: string;
  url: string;
  shareData: ShareData;
  createdAt: string;
  source?: "local" | "remote";
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
  isOverLimit: boolean;
}

export interface CopyResult {
  success: boolean;
  message: string;
}

export const SHARE_DATA_VERSION = "v2" as const;

export function isShareDataV2(data: ShareData): data is ShareDataV2 {
  const candidate = data as ShareDataV2;
  return (
    candidate?.version === SHARE_DATA_VERSION ||
    Array.isArray(candidate?.questions)
  );
}

export function isShareDataV1(data: ShareData): data is ShareDataV1 {
  return !isShareDataV2(data);
}
