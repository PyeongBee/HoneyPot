import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { SHARE_DATA_VERSION, ShareData } from "@/types/editor";

const normalizeShareData = (data: ShareData): ShareData => {
  if ((data as any)?.version === SHARE_DATA_VERSION) {
    return data;
  }

  if (Array.isArray((data as any)?.questions)) {
    return {
      ...(data as any),
      version: SHARE_DATA_VERSION,
    } as ShareData;
  }

  return {
    ...(data as any),
    version: SHARE_DATA_VERSION,
  } as ShareData;
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "인증된 사용자만 공유할 수 있습니다." },
      { status: 401 }
    );
  }

  let body: { data?: ShareData } | null = null;

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: "요청 본문을 파싱할 수 없습니다." },
      { status: 400 }
    );
  }

  if (!body?.data) {
    return NextResponse.json(
      { error: "공유할 데이터가 필요합니다." },
      { status: 400 }
    );
  }

  const payload = normalizeShareData(body.data);

  const { data, error } = await supabase
    .from("editor_shares")
    .insert({
      user_id: user.id,
      payload,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("공유 데이터 저장 실패:", error);
    return NextResponse.json(
      { error: "공유 데이터를 저장하지 못했습니다." },
      { status: 500 }
    );
  }

  const shareUrl = `${request.nextUrl.origin}/editor?share=${data.id}`;

  return NextResponse.json({ id: data.id, url: shareUrl });
}

export async function GET(request: NextRequest) {
  const mine = request.nextUrl.searchParams.get("mine");

  if (mine !== "1") {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "인증된 사용자만 조회할 수 있습니다." },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("editor_shares")
    .select("id, payload, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("공유 데이터 조회 실패:", error);
    return NextResponse.json(
      { error: "공유 데이터를 불러오지 못했습니다." },
      { status: 500 }
    );
  }

  const shares = (data ?? []).map(item => ({
    id: item.id,
    createdAt: item.created_at,
    data: normalizeShareData(item.payload as ShareData),
    url: `${request.nextUrl.origin}/editor?share=${item.id}`,
  }));

  return NextResponse.json(
    { shares },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

