# ConfirmDialog 사용 가이드

## 개요
`ConfirmDialog`는 브라우저 기본 `window.confirm` 대신 사용할 수 있는 커스텀 컨펌 다이얼로그 컴포넌트입니다. 프로젝트의 디자인 시스템에 맞춰 제작되었습니다.

## 설치 및 설정

ConfirmDialog는 이미 `LayoutWrapper`에 포함되어 있으므로 별도의 설치가 필요하지 않습니다.

## 기본 사용법

```typescript
import { useConfirmStore } from '@/stores/confirmStore';

function MyComponent() {
  const { showConfirm } = useConfirmStore();

  const handleDelete = () => {
    showConfirm({
      message: "정말로 삭제하시겠습니까?",
      confirmText: "삭제",
      cancelText: "취소",
      variant: "destructive",
      onConfirm: () => {
        // 확인 버튼 클릭 시 실행할 로직
        console.log("삭제되었습니다");
      },
      onCancel: () => {
        // 취소 버튼 클릭 시 실행할 로직 (선택사항)
        console.log("취소되었습니다");
      },
    });
  };

  return <button onClick={handleDelete}>삭제</button>;
}
```

## API

### showConfirm 옵션

| 옵션 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `message` | `string` | **필수** | - | 다이얼로그 메시지 (줄바꿈은 `\n` 사용) |
| `confirmText` | `string` | 선택 | "확인" | 확인 버튼 텍스트 |
| `cancelText` | `string` | 선택 | "취소" | 취소 버튼 텍스트 |
| `variant` | `'default' \| 'destructive'` | 선택 | "default" | 버튼 스타일 (destructive는 빨간색) |
| `onConfirm` | `() => void` | **필수** | - | 확인 버튼 클릭 시 실행할 함수 |
| `onCancel` | `() => void` | 선택 | - | 취소 버튼 클릭 시 실행할 함수 |

## 사용 예제

### 1. 기본 확인 다이얼로그

```typescript
showConfirm({
  message: "이 작업을 수행하시겠습니까?",
  onConfirm: () => {
    performAction();
  },
});
```

### 2. 삭제 확인 (Destructive)

```typescript
showConfirm({
  title: "데이터 삭제",
  message: "모든 데이터가 삭제됩니다.\n이 작업은 되돌릴 수 없습니다.",
  confirmText: "삭제",
  cancelText: "취소",
  variant: "destructive",
  onConfirm: () => {
    deleteAllData();
  },
});
```

### 3. 페이지 나가기 확인

```typescript
showConfirm({
  title: "페이지를 나가시겠습니까?",
  message: "입력한 내용이 있습니다.\n저장되지 않은 내용은 사라집니다.",
  confirmText: "나가기",
  cancelText: "취소",
  variant: "destructive",
  onConfirm: () => {
    router.push('/home');
  },
});
```

### 4. 취소 콜백 사용

```typescript
showConfirm({
  title: "파일 업로드",
  message: "파일을 업로드하시겠습니까?",
  confirmText: "업로드",
  cancelText: "취소",
  onConfirm: () => {
    uploadFile();
  },
  onCancel: () => {
    // 취소 시 특별한 처리가 필요한 경우
    clearFileSelection();
  },
});
```

## 스타일 특징

- 배경 어둡게 처리 (backdrop)
- 부드러운 애니메이션 효과
- 다크 모드 지원
- 모바일 반응형 디자인
- ESC 키나 배경 클릭으로 닫기 가능

## 주의사항

1. `onConfirm`은 필수 옵션입니다.
2. 메시지에서 줄바꿈을 사용하려면 `\n`을 사용하세요.
3. `variant: "destructive"`는 위험한 작업(삭제, 영구 변경 등)에만 사용하세요.
4. 다이얼로그는 동시에 하나만 표시됩니다.

