"use client";

import { MessageCircle, Share2, ThumbsUp } from "lucide-react";

import PageShell from "@/components/layout/PageShell";

const samplePosts = [
  {
    id: 1,
    author: "bee_marketer",
    company: "Kakao",
    content:
      "두괄식으로 바꾼 뒤 흐름이 다소 끊기는데, 첫 문단을 더 압축할 수 있을지 봐주세요. 첨삭본 링크에 diff 넣었습니다.",
    link: "https://example.com/share/marketing-v2",
    comments: 6,
    likes: 18,
    views: 240,
    updatedAt: "1시간 전",
    tags: ["경력", "개발", "백엔드"],
  },
  {
    id: 2,
    author: "dev_honey",
    company: "Coupang",
    content:
      "백엔드 지원서 ‘문제정의→대안→검증’ 구조로 정리했습니다. API 캐시 개선 사례가 잘 읽히는지, 문장이 길지 않은지 체크 부탁드려요.",
    link: "https://example.com/share/backend-cache",
    comments: 4,
    likes: 12,
    views: 180,
    updatedAt: "3시간 전",
    tags: ["경력", "개발", "백엔드"],
  },
  {
    id: 3,
    author: "pixel_bee",
    company: "Naver",
    content:
      "UX 포트폴리오 항목을 자소서로 풀었습니다. 가설–리서치–실험 흐름이 자연스러운지, 임팩트 수치를 더 강조할 포인트가 있을지 피드백 부탁드립니다.",
    link: "https://example.com/share/ux-thread",
    comments: 9,
    likes: 25,
    views: 320,
    updatedAt: "어제",
    tags: ["경력", "개발", "백엔드"],
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
        <section className="space-y-4">
          <div className="space-y-3">
            {samplePosts.map(post => (
              <div key={post.id} className="border-b border-gray-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-200 text-amber-900 font-semibold">
                    {post.author.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                      <span className="font-semibold">
                        {post.author} &gt; {post.company}
                      </span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {post.updatedAt}
                      </span>
                    </div>
                  </div>
                </div>
                {/* '경력' '개발' '백엔드' 태그 추가해줘 칩 형태로 추가해줘 하나씩.*/}
                <div className="flex items-center gap-2 flex-wrap mt-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-gray-500 dark:text-gray-400 rounded-full bg-gray-100 px-2 py-0.5 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 본문 */}
                <p className="mt-3 text-[15px] leading-relaxed text-gray-900 dark:text-gray-100">
                  {post.content}
                </p>

                {/* 링크 첨부 */}
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 transition hover:border-amber-300 hover:bg-amber-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-amber-400/70 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-amber-500" />
                    <span className="truncate">{post.link}</span>
                  </div>
                </a>

                {/* 액션 메타 */}
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
