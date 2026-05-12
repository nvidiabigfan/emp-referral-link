export type Product = {
  id: string;
  name: string;
  baseUrl: string;
  utmParams: {
    source: string;
    medium: string;
    campaign: string;
    content: string;
  };
};

const UTM = {
  source: "ez_sol",
  medium: "organic",
  campaign: "oti",
  content: "referral_emp",
};

// Phase 1: 상품 목록 (확정 후 Supabase products 테이블로 이전)
export const PRODUCTS: Product[] = [
  {
    id: "travel",
    name: "여행자보험",
    baseUrl: "https://direct.shinhanez.co.kr/#PDROTIOTI_M01",
    utmParams: UTM,
  },
  {
    id: "driver",
    name: "운전자보험",
    baseUrl: "https://direct.shinhanez.co.kr/#PDRFDIFDI_M01",
    utmParams: UTM,
  },
  {
    id: "health",
    name: "건강보험",
    baseUrl: "https://direct.shinhanez.co.kr/#PDRSHISHI_M01",
    utmParams: UTM,
  },
  {
    id: "golf",
    name: "골프보험",
    baseUrl: "https://direct.shinhanez.co.kr/#PDRCLICLI_M01",
    utmParams: UTM,
  },
  {
    id: "home",
    name: "주택화재보험",
    baseUrl: "https://direct.shinhanez.co.kr/#PDRHFIHFI_M01",
    utmParams: UTM,
  },
];

export function buildReferralUrl(product: Product, employeeId: string): string {
  const { source, medium, campaign, content } = product.utmParams;
  // baseUrl에 '#' 해시가 포함된 경우 UTM은 '#' 앞에 붙어야 서버로 전달됨
  const hashIndex = product.baseUrl.indexOf("#");
  const [base, hash] =
    hashIndex >= 0
      ? [product.baseUrl.slice(0, hashIndex), product.baseUrl.slice(hashIndex)]
      : [product.baseUrl, ""];
  return (
    `${base}` +
    `?utm_source=${source}` +
    `&utm_medium=${medium}` +
    `&utm_campaign=${campaign}` +
    `&utm_content=${content}` +
    `&utm_term=${encodeURIComponent(employeeId)}` +
    hash
  );
}
