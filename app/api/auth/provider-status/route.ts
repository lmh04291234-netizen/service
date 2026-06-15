import { NextResponse } from "next/server";

export const runtime = "nodejs";

function hasValue(value?: string) {
  return Boolean(value && value.trim().length > 0);
}

export async function GET() {
  return NextResponse.json({
    google: hasValue(process.env.GOOGLE_CLIENT_ID) && hasValue(process.env.GOOGLE_CLIENT_SECRET),
    naver: hasValue(process.env.NAVER_CLIENT_ID) && hasValue(process.env.NAVER_CLIENT_SECRET)
  });
}
