import { NextRequest, NextResponse } from "next/server";

import { QualityCheckResult, QualityIssue } from "../../../types/qualityCheck";

// 의미 없는 강조 부사
const EMPHASIS_ADVERBS = [
  "매우",
  "정말",
  "굉장히",
  "너무",
  "엄청",
  "완전",
  "진짜",
  "아주",
  "무척",
];

// 문장을 늘리는 표현
const VERBOSE_EXPRESSIONS = [
  "적인 부분",
  "적인 측면",
  "적인 면",
  "라는 점",
  "에 있어서",
  "에 관하여",
  "에 대하여",
  "하는 것",
  "한다는 것",
  "라고 하는",
];

// 구어체 종결어미 패턴
const COLLOQUIAL_ENDING_PATTERNS = [
  /[가-힣]+요[\s\.!?]/g,
  /[가-힣]+ㄴ데[\s\.!?]/g,
  /[가-힣]+는데[\s\.!?]/g,
  /[가-힣]+든데[\s\.!?]/g,
  /[가-힣]+던데[\s\.!?]/g,
  /[가-힣]+거든요?[\s\.!?]/g,
  /[가-힣]+잖아요?[\s\.!?]/g,
];

// 구어적 표현
const COLLOQUIAL_WORDS = [
  "솔직히",
  "사실",
  "좀",
  "막",
  "되게",
  "진짜",
  "엄청",
  "완전",
  "많이",
  "뭔가",
  "약간",
];

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "텍스트가 필요합니다." },
        { status: 400 }
      );
    }

    const issues: QualityIssue[] = [];
    let issueId = 0;

    // 1. 문장 분리 (정규식으로 정확한 위치 추적)
    // 마침표, 느낌표, 물음표로 끝나는 문장 찾기
    const sentenceRegex = /[^.!?]+[.!?]+/g;
    let sentenceMatch;

    while ((sentenceMatch = sentenceRegex.exec(text)) !== null) {
      const sentence = sentenceMatch[0];
      const sentenceStart = sentenceMatch.index;
      const sentenceEnd = sentenceStart + sentence.length;

      // 2. 쉼표 남용 검사 (문장당 쉼표 3개 이상)
      const commaCount = (sentence.match(/,/g) || []).length;
      if (commaCount >= 3) {
        issues.push({
          id: `issue-${issueId++}`,
          type: "comma_overuse",
          message: `쉼표가 ${commaCount}개 사용되었습니다. 문장을 나누는 것을 고려해보세요.`,
          start: sentenceStart,
          end: sentenceEnd,
          token: sentence.trim(),
          severity: "warning",
          checked: false,
        });
      }

      // 3. 문장 길이 검사 (한글 단어 20개 이상)
      const koreanWords = sentence.match(/[가-힣]+/g) || [];
      if (koreanWords.length >= 20) {
        issues.push({
          id: `issue-${issueId++}`,
          type: "sentence_length",
          message: `문장이 너무 깁니다. (단어 수: ${koreanWords.length}개) 문장을 나누는 것을 권장합니다.`,
          start: sentenceStart,
          end: sentenceEnd,
          token: sentence.trim(),
          severity: "warning",
          checked: false,
        });
      }
    }

    // 4. 수식어 남발 검사 - 강조 부사
    for (const adverb of EMPHASIS_ADVERBS) {
      // 한글을 위한 단어 경계: 문장 시작, 공백, 구두점 앞뒤
      const regex = new RegExp(`(^|[\\s,.!?])${adverb}(?=[\\s,.!?]|$)`, "g");
      let match;
      while ((match = regex.exec(text)) !== null) {
        const startOffset = match[1].length; // 앞의 공백/구두점 제외
        issues.push({
          id: `issue-${issueId++}`,
          type: "modifier_overuse",
          message: `"${adverb}"는 의미 없는 강조 표현입니다. 삭제를 고려해보세요.`,
          start: match.index + startOffset,
          end: match.index + startOffset + adverb.length,
          token: adverb,
          severity: "warning",
          suggestion: "",
          checked: false,
        });
      }
    }

    // 문장을 늘리는 표현 검사
    for (const expr of VERBOSE_EXPRESSIONS) {
      let searchFrom = 0;
      while (true) {
        const idx = text.indexOf(expr, searchFrom);
        if (idx === -1) break;

        issues.push({
          id: `issue-${issueId++}`,
          type: "modifier_overuse",
          message: `"${expr}"는 문장을 불필요하게 늘리는 표현입니다. 간결하게 수정해보세요.`,
          start: idx,
          end: idx + expr.length,
          token: expr,
          severity: "warning",
          checked: false,
        });

        searchFrom = idx + expr.length;
      }
    }

    // 5. 구어체 검사 - 종결어미 패턴
    for (const pattern of COLLOQUIAL_ENDING_PATTERNS) {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      while ((match = regex.exec(text)) !== null) {
        const matched = match[0].trim();
        issues.push({
          id: `issue-${issueId++}`,
          type: "colloquial",
          message: `"${matched}"는 구어체 종결어미입니다. 격식있는 표현으로 수정해보세요.`,
          start: match.index,
          end: match.index + matched.length,
          token: matched,
          severity: "warning",
          checked: false,
        });
      }
    }

    // 구어적 표현 검사
    for (const word of COLLOQUIAL_WORDS) {
      // 한글을 위한 단어 경계: 문장 시작, 공백, 구두점 앞뒤
      const regex = new RegExp(`(^|[\\s,.!?])${word}(?=[\\s,.!?]|$)`, "g");
      let match;
      while ((match = regex.exec(text)) !== null) {
        const startOffset = match[1].length; // 앞의 공백/구두점 제외
        issues.push({
          id: `issue-${issueId++}`,
          type: "colloquial",
          message: `"${word}"는 구어적 표현입니다. 격식있는 표현으로 수정해보세요.`,
          start: match.index + startOffset,
          end: match.index + startOffset + word.length,
          token: word,
          severity: "warning",
          checked: false,
        });
      }
    }

    // 6. 반복 표현 검사 (같은 단어가 연속으로 2회 이상)
    const repeatPattern = /([가-힣]{2,})\s+\1(\s+\1)*/g;
    let repeatMatch;
    while ((repeatMatch = repeatPattern.exec(text)) !== null) {
      const repeated = repeatMatch[0];
      const word = repeatMatch[1];
      const count = (repeated.match(new RegExp(word, "g")) || []).length;

      if (count >= 2) {
        issues.push({
          id: `issue-${issueId++}`,
          type: "repeat",
          message: `"${word}"가 ${count}번 반복되었습니다. 불필요한 반복을 제거해보세요.`,
          start: repeatMatch.index,
          end: repeatMatch.index + repeated.length,
          token: repeated,
          severity: "warning",
          checked: false,
        });
      }
    }

    // 7. 연속된 공백 검사 (공백 2개 이상)
    const multipleSpacePattern = / {2,}/g;
    let spaceMatch;
    while ((spaceMatch = multipleSpacePattern.exec(text)) !== null) {
      const spaces = spaceMatch[0];
      issues.push({
        id: `issue-${issueId++}`,
        type: "repeat",
        message: `불필요한 공백 ${spaces.length}개가 연속되었습니다. 공백 하나로 수정해보세요.`,
        start: spaceMatch.index,
        end: spaceMatch.index + spaces.length,
        token: spaces,
        severity: "warning",
        checked: false,
      });
    }

    // 중복 제거 (같은 위치의 이슈)
    const uniqueIssues = issues.filter(
      (issue, index, self) =>
        index ===
        self.findIndex(t => t.start === issue.start && t.token === issue.token)
    );

    // 결과 생성
    const result: QualityCheckResult = {
      issues: uniqueIssues,
      totalIssues: uniqueIssues.length,
      issueCounts: {
        sentence_length: uniqueIssues.filter(i => i.type === "sentence_length")
          .length,
        comma_overuse: uniqueIssues.filter(i => i.type === "comma_overuse")
          .length,
        modifier_overuse: uniqueIssues.filter(
          i => i.type === "modifier_overuse"
        ).length,
        repeat: uniqueIssues.filter(i => i.type === "repeat").length,
        colloquial: uniqueIssues.filter(i => i.type === "colloquial").length,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("품질 검사 실패:", error);
    return NextResponse.json(
      { error: "품질 검사 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
