"use client";

import { useState } from "react";
import { PRODUCTS, buildReferralUrl } from "@/lib/products";

export default function Home() {
  const [employeeId, setEmployeeId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [copied, setCopied] = useState(false);

  const selectedProduct = PRODUCTS.find((p) => p.id === selectedProductId)!;
  const generatedUrl =
    employeeId.trim() ? buildReferralUrl(selectedProduct, employeeId.trim()) : "";

  async function handleCopy() {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    if (!generatedUrl) return;
    if (navigator.share) {
      await navigator.share({
        title: `${selectedProduct.name} 추천 링크`,
        text: `임직원 추천 링크입니다. 아래 링크로 가입해 주세요 :)`,
        url: generatedUrl,
      });
    } else {
      await handleCopy();
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-start justify-center pt-12 px-4">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#E8001D] rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">임직원 추천 링크 생성</h1>
          <p className="mt-1 text-sm text-gray-500">사번을 입력하면 추천 링크가 자동으로 만들어집니다</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          {/* 상품 선택 */}
          {PRODUCTS.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">상품 선택</label>
              <select
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8001D] focus:border-transparent"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                {PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          {PRODUCTS.length === 1 && (
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-xs font-medium text-gray-500">상품</span>
              <span className="text-sm font-semibold text-gray-800">{selectedProduct.name}</span>
            </div>
          )}

          {/* 사번 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">사번</label>
            <input
              type="text"
              inputMode="text"
              placeholder="사번을 입력하세요"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8001D] focus:border-transparent"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>

          {/* 생성된 URL */}
          {generatedUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">생성된 링크</label>
              <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3">
                <p className="text-xs text-gray-600 break-all font-mono leading-relaxed">{generatedUrl}</p>
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleCopy}
              disabled={!generatedUrl}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  복사됨
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  링크 복사
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              disabled={!generatedUrl}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#FEE500] py-3 text-sm font-semibold text-[#191919] transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.653 1.617 4.983 4.053 6.37l-.95 3.54a.5.5 0 00.728.559L9.5 18.5c.824.13 1.664.2 2.5.2 5.523 0 10-3.477 10-7.7S17.523 3 12 3z"/>
              </svg>
              카카오 공유
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          생성된 링크에 사번이 포함됩니다
        </p>
      </div>
    </main>
  );
}
