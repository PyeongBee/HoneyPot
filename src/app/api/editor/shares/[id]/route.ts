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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "공유 ID가 필요합니다." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // 인증 확인: 서버 저장 링크는 로그인 필요
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "다문항 링크를 열려면 로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("editor_shares")
    .select("id, payload, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("공유 데이터 조회 실패:", error);
    return NextResponse.json(
      { error: "공유 데이터를 조회하지 못했습니다." },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "공유를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    share: {
      id: data.id,
      createdAt: data.created_at,
      data: normalizeShareData(data.payload as ShareData),
      url: `${request.nextUrl.origin}/editor?share=${data.id}`,
    },
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "공유 ID가 필요합니다." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "인증된 사용자만 삭제할 수 있습니다." },
      { status: 401 }
    );
  }

  const { error } = await supabase
    .from("editor_shares")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("공유 데이터 삭제 실패:", error);
    return NextResponse.json(
      { error: "공유 데이터를 삭제하지 못했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
