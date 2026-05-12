import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS, buildReferralUrl } from "@/lib/products";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("p");
  const employeeId = searchParams.get("emp");

  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product || !employeeId || !/^\d{7}$/.test(employeeId)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const targetUrl = buildReferralUrl(product, employeeId);

  // Supabase 기록 (env 없으면 skip — 리다이렉트는 항상 수행)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/clicks`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          product_id: productId,
          employee_id: employeeId,
          user_agent: request.headers.get("user-agent") ?? null,
          referer: request.headers.get("referer") ?? null,
        }),
      });
    } catch {
      // 기록 실패해도 리다이렉트 진행
    }
  }

  return NextResponse.redirect(targetUrl, { status: 302 });
}
