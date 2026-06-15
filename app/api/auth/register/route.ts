import { NextResponse } from "next/server";
import { createCredentialsUser } from "@/lib/users";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");

  if (!name || !email || password.length < 6) {
    return NextResponse.json(
      { error: "이름, 이메일, 6자 이상 비밀번호를 입력해주세요." },
      { status: 400 }
    );
  }

  try {
    const user = await createCredentialsUser({ name, email, password });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "회원가입에 실패했습니다." },
      { status: 400 }
    );
  }
}
