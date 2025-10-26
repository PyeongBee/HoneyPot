import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "자소서 에디터 | 평비의 꿀단지 (HoneyPot)",
  description: "AI 맞춤법 검사와 함께하는 스마트 자소서 작성 도구. 실시간 글자수 체크, 맞춤법 교정, 공유 기능을 제공합니다.",
  keywords: ["자소서", "에디터", "맞춤법 검사", "취업", "자기소개서", "AI", "글자수 체크"],
  openGraph: {
    title: "자소서 에디터 | 평비의 꿀단지 (HoneyPot)",
    description: "AI 맞춤법 검사와 함께하는 스마트 자소서 작성 도구",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="editor-page">{children}</div>;
}
