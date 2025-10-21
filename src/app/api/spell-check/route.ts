import { NextRequest, NextResponse } from "next/server";

export interface SpellCheckResult {
  token: string;
  suggestions: string[];
  info: string;
  start: number;
  end: number;
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "텍스트가 필요합니다." }, { status: 400 });
    }

    // hanspell 라이브러리 동적 import
    const hanspell = await import("hanspell");

    return new Promise<Response>((resolve) => {
      const results: SpellCheckResult[] = [];

      try {
        // DAUM 맞춤법 검사 사용
        if ("spellCheckByDAUM" in hanspell) {
          (
            hanspell as {
              spellCheckByDAUM: (
                text: string,
                callback: () => void,
                endCallback: (results: unknown) => void
              ) => void;
            }
          ).spellCheckByDAUM(
            text,
            // 개별 결과 콜백 (사용하지 않음)
            () => {},
            // 최종 결과 콜백
            (endResults: unknown) => {
              console.log("hanspell end results:", endResults);

              try {
                // endResults가 배열인 경우 처리
                if (Array.isArray(endResults)) {
                  endResults.forEach(
                    (result: { token: string; suggestions: string[]; info?: string }) => {
                      if (result && result.suggestions && result.suggestions.length > 0) {
                        const tokenIndex = text.indexOf(result.token);

                        results.push({
                          token: result.token,
                          suggestions: result.suggestions,
                          info: result.info || "",
                          start: tokenIndex >= 0 ? tokenIndex : 0,
                          end:
                            tokenIndex >= 0
                              ? tokenIndex + result.token.length
                              : result.token.length,
                        });
                      }
                    }
                  );
                }

                console.log("최종 결과 개수:", results.length);
                resolve(NextResponse.json({ results }));
              } catch (processError) {
                console.error("결과 처리 오류:", processError);
                resolve(NextResponse.json({ results: [] }));
              }
            }
          );
        } else {
          resolve(
            NextResponse.json({ error: "hanspell 라이브러리를 찾을 수 없습니다." }, { status: 500 })
          );
        }
      } catch (hanspellError) {
        console.error("hanspell 실행 오류:", hanspellError);
        resolve(
          NextResponse.json({ error: "hanspell 실행 중 오류가 발생했습니다." }, { status: 500 })
        );
      }
    });
  } catch (error) {
    console.error("맞춤법 검사 오류:", error);
    return NextResponse.json({ error: "맞춤법 검사 중 오류가 발생했습니다." }, { status: 500 });
  }
}
