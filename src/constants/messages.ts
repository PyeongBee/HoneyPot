/**
 * 메시지 및 텍스트 상수 정의
 */

export const MESSAGES = {
  SPELL_CHECK: {
    LOADING: "맞춤법 검사 중...",
    NO_TEXT: "맞춤법 검사할 텍스트를 입력해주세요.",
    NO_ERRORS: "맞춤법 오류가 발견되지 않았습니다!",
    NO_ERRORS_FOUND: "맞춤법 오류가 없습니다!",
    REQUEST_FAILED: "맞춤법 검사 요청 실패",
    UNKNOWN_ERROR: "알 수 없는 오류",
    INVALID_RESPONSE: "서버에서 잘못된 응답을 받았습니다.",
    ERROR_OCCURRED: "맞춤법 검사 중 오류가 발생했습니다",
  },
  BUTTONS: {
    SPELL_CHECK: "맞춤법 검사",
    CANCEL_CHECK: "검사 닫기",
    COPY_ORIGINAL: "원본 가져오기",
    APPLY_CORRECTIONS: "교정 완료",
  },
  LABELS: {
    ORIGINAL_TITLE: "원본 자소서",
    EDITOR_TITLE: "자소서 수정",
    SPELL_CHECK_TITLE: "맞춤법 교정",
    ORIGINAL_PLACEHOLDER: "자소서 원본을 입력하세요...",
    EDIT_PLACEHOLDER: "수정된 자소서를 입력하세요...",
    COPY_ORIGINAL_ARIA: "원본 내용을 수정 에디터로 복사",
    ORIGINAL_ARIA: "자소서 원본 입력",
    EDITOR_ARIA: "자소서 수정 입력",
    CLOSE_TOAST: "토스트 닫기",
  },
  CONFIRM: {
    LEAVE_PAGE: {
      TITLE: "페이지를 나가시겠습니까?",
      MESSAGE:
        "입력한 내용이 있습니다. 정말 나가시겠습니까?\n저장되지 않은 내용은 사라집니다.",
      CONFIRM: "나가기",
      CANCEL: "취소",
    },
    DELETE_ALL: {
      TITLE: "모든 공유 기록 삭제",
      MESSAGE:
        "모든 공유 기록을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.",
      CONFIRM: "삭제",
      CANCEL: "취소",
    },
    MODE_CHANGE: {
      TITLE: "수정 모드로 전환",
      MESSAGE:
        "수정 모드로 전환하면 기존 메모 데이터가 모두 삭제됩니다.\n계속하시겠습니까?",
      CONFIRM: "계속",
      CANCEL: "취소",
    },
  },
} as const;
