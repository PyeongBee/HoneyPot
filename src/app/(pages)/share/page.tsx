"use client";

import {
  Eye,
  MessageCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/common/Button";
import { Card, CardDescription, CardTitle } from "@/components/common/Card";
import PageShell from "@/components/layout/PageShell";

const samplePosts = [
  {
    id: 1,
    title: "마케팅 신입 자소서 피드백 부탁드립니다!",
    summary:
      "문맥과 스토리 흐름이 자연스러운지, 강조해야 할 성과 포인트가 있을지 궁금합니다.",
    tags: ["#마케팅", "#신입", "#브랜드"],
    status: "피드백 모집",
    comments: 6,
    likes: 18,
    views: 240,
    updatedAt: "1시간 전",
    author: "bee_marketer",
  },
  {
    id: 2,
    title: "백엔드 주니어 지원서 - 구조/논리 검토 요청",
    summary:
      "프로젝트 경험을 역량 중심으로 풀어쓴 것이 맞는지 확인해주시면 감사하겠습니다.",
    tags: ["#백엔드", "#신입", "#스타트업"],
    status: "피드백 모집",
    comments: 4,
    likes: 12,
    views: 180,
    updatedAt: "3시간 전",
    author: "dev_honey",
  },
  {
    id: 3,
    title: "UX/UI 디자이너 포트폴리오 항목 자소서 공유",
    summary: "디자인 결정 근거와 임팩트를 더 설득력 있게 보완하고 싶습니다.",
    tags: ["#디자인", "#UXUI", "#포트폴리오"],
    status: "피드백 모집",
    comments: 9,
    likes: 25,
    views: 320,
    updatedAt: "어제",
    author: "pixel_bee",
  },
];

const steps = [
  {
    icon: <Share2 className="w-5 h-5 text-brand-500" />,
    title: "공유 링크 붙여넣기",
    description:
      "에디터에서 생성한 자소서 공유 링크를 붙여서 바로 게시글을 만들어요.",
  },
  {
    icon: <Sparkles className="w-5 h-5 text-brand-500" />,
    title: "필요한 피드백 지정",
    description:
      "검토받고 싶은 항목(논리/문법/스토리/직무 적합성 등)을 체크해 주세요.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-brand-500" />,
    title: "로그인 후 참여",
    description: "모든 피드백·댓글은 로그인한 사용자만 작성할 수 있어요.",
  },
];

export default function SharePage() {
  return (
    <PageShell
      title="자소서 공유"
      className="pb-8"
      contentClassName="flex max-w-6xl flex-col gap-6 px-2 sm:px-4 lg:px-0"
    >
      <div className="w-full">
        {/* 히어로 영역 */}
        <section className="rounded-2xl border border-gray-200 bg-gradient-to-r from-amber-50 via-white to-amber-50 p-8 shadow-sm dark:border-gray-700 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-200">
                자소서 공유 · 피드백 라운지
              </p>
              <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">
                자소서를 공개하고
                <br className="hidden sm:block" /> 팀처럼 피드백을 받아보세요
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                에디터에서 생성한 공유 링크를 올리면, 커뮤니티가 논리·문법·직무
                적합성을 함께 살펴줍니다. 로그인한 사용자만 참여하도록 설계되어
                안전합니다.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/editor">
                  <Button variant="default" size="lg">
                    피드백 요청하기
                  </Button>
                </Link>
                <Link href="/editor">
                  <Button variant="outline" size="lg">
                    내 자소서 열기
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <ShieldCheck className="h-4 w-4" />
                로그인 필수 · 공개 링크만 피드백에 사용됩니다.
              </div>
            </div>
          </div>
        </section>

        {/* 참여 단계 */}
        <section className="grid gap-4 md:grid-cols-3">
          {steps.map(step => (
            <Card key={step.title} className="h-full">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                  {step.icon}
                </div>
                <div className="space-y-1">
                  <CardTitle className="mb-1 text-lg">{step.title}</CardTitle>
                  <CardDescription className="mb-0 text-sm">
                    {step.description}
                  </CardDescription>
                </div>
              </div>
            </Card>
          ))}
        </section>

        {/* 미리보기 리스트 */}
        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                공유된 자소서 미리보기
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                실제 리스트가 연결되면 최신순/인기순/내 공유로 필터링할 수
                있어요.
              </p>
            </div>
            <div className="flex gap-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">
                <MessageCircle className="h-4 w-4" />
                피드백
              </div>
              <div className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">
                <ThumbsUp className="h-4 w-4" />
                좋아요
              </div>
              <div className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">
                <Eye className="h-4 w-4" />
                조회
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {samplePosts.map(post => (
              <Card
                key={post.id}
                className="h-full transition-shadow hover:shadow-md"
                shadow="md"
              >
                <div className="flex items-center justify-between text-sm text-amber-700 dark:text-amber-200">
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold dark:bg-amber-900/30">
                    {post.status}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {post.updatedAt}
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {post.summary}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  <span>@{post.author}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 안내 문구 */}
        <section className="hidden rounded-xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 sm:block">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="font-semibold text-gray-900 dark:text-white">
              실제 데이터 연결 전, 퍼블릭 공개 흐름을 먼저 경험해보세요.
            </div>
            <Link href="/editor">
              <Button variant="secondary" size="md">
                에디터에서 공유 링크 만들기
              </Button>
            </Link>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            로그인된 사용자만 게시/댓글/좋아요를 남길 수 있도록 인증을 강제할
            예정입니다. 이후 API 연동 시 게시글 생성, 태그 필터, 인기순 정렬을
            붙이면 됩니다.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
