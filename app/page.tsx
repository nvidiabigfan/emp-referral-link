"use client";

import { useState } from "react";
import Script from "next/script";
import { PRODUCTS, buildReferralUrl, buildTrackUrl } from "@/lib/products";

declare global {
  interface Window {
    Kakao: any;
  }
}

const KAKAO_APP_KEY = "4b25e37e20efdd67ba3b22d345f0a497";
const SITE_URL = "https://shinhanezemp-referral-link.vercel.app";
const SHARE_IMAGE_URL = `${SITE_URL}/kakao-image.png`;

export default function Home() {
  const [employeeId, setEmployeeId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [copied, setCopied] = useState(false);

  const selectedProduct = PRODUCTS.find((p) => p.id === selectedProductId)!;
  const idValue = employeeId.trim();
  const idValid = /^\d{7}$/.test(idValue);
  const idError = idValue.length > 0 && !idValid ? "사번이 올바르지 않습니다." : "";
  const generatedUrl = idValid
    ? buildReferralUrl(selectedProduct, idValue)
    : "";

  async function handleCopy() {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleKakaoShare() {
    if (!generatedUrl) return;
    // 카카오톡 인앱 브라우저: Share API 사용 불가 → 링크 복사로 대체
    if (/KAKAOTALK/i.test(navigator.userAgent)) {
      navigator.clipboard.writeText(generatedUrl).catch(() => {});
      alert("카카오톡 내 브라우저에서는 공유 버튼을 사용할 수 없습니다.\n링크가 복사되었습니다. 채팅창에 붙여넣기 해주세요.");
      return;
    }
    if (!window.Kakao?.isInitialized()) {
      alert("카카오 SDK 로딩 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    const trackUrl = buildTrackUrl(SITE_URL, selectedProduct.id, idValue);
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: `신한 ${selectedProduct.name} 추천 링크`,
        description: "임직원 추천 링크입니다. 아래 버튼을 눌러 가입해 주세요 :)",
        imageUrl: SHARE_IMAGE_URL,
        imageWidth: 1200,
        imageHeight: 628,
        link: {
          mobileWebUrl: trackUrl,
          webUrl: trackUrl,
        },
      },
      buttons: [
        {
          title: "지금 가입하기",
          link: {
            mobileWebUrl: trackUrl,
            webUrl: trackUrl,
          },
        },
      ],
    });
  }

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
        crossOrigin="anonymous"
        onLoad={() => {
          if (!window.Kakao.isInitialized()) {
            window.Kakao.init(KAKAO_APP_KEY);
          }
        }}
      />

      <main className="min-h-screen bg-gray-50 flex items-start justify-center pt-12 px-4">
        <div className="w-full max-w-md">
          {/* 헤더 */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#E8001D] rounded-2xl mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              임직원 추천 링크 생성
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              사번을 입력하면 추천 링크가 자동으로 만들어집니다
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            {/* 상품 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상품 선택
              </label>
              <select
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8001D] focus:border-transparent"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                {PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 사번 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사번
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="7자리 숫자를 입력하세요"
                className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
                  idError
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-200 focus:ring-[#E8001D]"
                }`}
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
              {idError && (
                <p className="mt-1.5 text-xs text-red-500">{idError}</p>
              )}
            </div>

            {/* 생성된 URL */}
            {generatedUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  생성된 링크
                </label>
                <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3">
                  <p className="text-xs text-gray-600 break-all font-mono leading-relaxed">
                    {generatedUrl}
                  </p>
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
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    복사됨
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    링크 복사
                  </>
                )}
              </button>

              <button
                onClick={handleKakaoShare}
                disabled={!generatedUrl}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#FEE500] py-3 text-sm font-semibold text-[#191919] transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.653 1.617 4.983 4.053 6.37l-.95 3.54a.5.5 0 00.728.559L9.5 18.5c.824.13 1.664.2 2.5.2 5.523 0 10-3.477 10-7.7S17.523 3 12 3z" />
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
    </>
  );
}
