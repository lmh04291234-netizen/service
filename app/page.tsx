"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Heart,
  Handshake,
  LogOut,
  MapPin,
  MessageCircle,
  PackageCheck,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Truck,
  UserCog,
  UserRound,
  UserPlus,
  Wrench
} from "lucide-react";

type ListingType = "offer" | "request";
type Category = "tools" | "event" | "electronics" | "camping" | "machine" | "office";
type Method = "pickup" | "delivery" | "both";
type SellerType = "business" | "personal";
type ActiveView = "home" | "login" | "signup" | "mypage" | "settings" | "post" | "detail";

type Region = {
  province: string;
  city: string;
  district: string;
  dong: string;
};

type Listing = {
  id: number;
  type: ListingType;
  category: Category;
  title: string;
  image: string;
  location: string;
  region: Region;
  price: number;
  deposit: number;
  period: string;
  details: string;
  condition: string;
  method: Method;
  sellerType: SellerType;
  service: string;
  owner: string;
  rating: number;
  verified: boolean;
  created: number;
};

const initialListings: Listing[] = [
  {
    id: 1,
    type: "offer",
    category: "event",
    title: "행사용 접이식 의자 50개",
    image: "/assets/listings/event-chairs.png",
    location: "강남구 역삼동",
    region: { province: "서울특별시", city: "서울시", district: "강남구", dong: "역삼동" },
    price: 45000,
    deposit: 120000,
    period: "1~3일",
    details: "야외 행사, 플리마켓, 학교 행사에 맞는 접이식 의자 세트. 수량 조정 가능합니다.",
    condition: "세척 완료",
    method: "both",
    sellerType: "business",
    service: "배송/회수 가능",
    owner: "역삼 이벤트렌탈",
    rating: 4.9,
    verified: true,
    created: 12
  },
  {
    id: 2,
    type: "offer",
    category: "tools",
    title: "보쉬 전동드릴 풀세트",
    image: "/assets/listings/power-drill.png",
    location: "마포구 합정동",
    region: { province: "서울특별시", city: "서울시", district: "마포구", dong: "합정동" },
    price: 9000,
    deposit: 40000,
    period: "1~7일",
    details: "콘크리트 비트 포함. 사용 전 간단 체크 후 대여하며 초보자도 사용법 안내해드려요.",
    condition: "배터리 2개",
    method: "pickup",
    sellerType: "personal",
    service: "직거래 사용설명",
    owner: "합정 공구함",
    rating: 4.8,
    verified: true,
    created: 11
  },
  {
    id: 3,
    type: "offer",
    category: "event",
    title: "3x3 캐노피 천막 + 테이블",
    image: "/assets/listings/canopy-tent.png",
    location: "성동구 성수동",
    region: { province: "서울특별시", city: "서울시", district: "성동구", dong: "성수동" },
    price: 65000,
    deposit: 180000,
    period: "1일",
    details: "야외 부스용 천막과 접이식 테이블 2개 구성. 설치 옵션 선택 가능합니다.",
    condition: "방수 점검",
    method: "both",
    sellerType: "business",
    service: "설치 옵션",
    owner: "성수 행사창고",
    rating: 5,
    verified: true,
    created: 10
  },
  {
    id: 4,
    type: "request",
    category: "electronics",
    title: "빔프로젝터와 스크린 구해요",
    image: "/assets/listings/projector.png",
    location: "송파구 잠실동",
    region: { province: "서울특별시", city: "서울시", district: "송파구", dong: "잠실동" },
    price: 25000,
    deposit: 100000,
    period: "토요일 하루",
    details: "소규모 세미나용입니다. HDMI 연결 가능하고 밝기 3000안시 이상이면 좋습니다.",
    condition: "HDMI 필수",
    method: "pickup",
    sellerType: "personal",
    service: "직접 픽업",
    owner: "잠실 세미나팀",
    rating: 4.7,
    verified: true,
    created: 9
  },
  {
    id: 5,
    type: "offer",
    category: "camping",
    title: "캠핑 웨건 + 아이스박스",
    image: "/assets/listings/camping-wagon.png",
    location: "관악구 봉천동",
    region: { province: "서울특별시", city: "서울시", district: "관악구", dong: "봉천동" },
    price: 18000,
    deposit: 60000,
    period: "2~4일",
    details: "가족 캠핑이나 피크닉용으로 좋습니다. 바퀴 상태 좋고 사용 후 간단 세척 부탁드려요.",
    condition: "생활기스 있음",
    method: "delivery",
    sellerType: "personal",
    service: "퀵 가능",
    owner: "봉천 캠핑러",
    rating: 4.6,
    verified: true,
    created: 8
  },
  {
    id: 6,
    type: "offer",
    category: "machine",
    title: "고압세척기 하루 대여",
    image: "/assets/listings/pressure-washer.png",
    location: "분당구 정자동",
    region: { province: "경기도", city: "성남시", district: "분당구", dong: "정자동" },
    price: 30000,
    deposit: 150000,
    period: "1~3일",
    details: "주차장, 테라스, 외벽 청소용. 사용 전 안전 안내 필수, 노즐 세트 포함입니다.",
    condition: "점검 완료",
    method: "pickup",
    sellerType: "business",
    service: "안전 안내",
    owner: "분당 장비렌탈",
    rating: 4.9,
    verified: true,
    created: 7
  },
  {
    id: 7,
    type: "offer",
    category: "office",
    title: "스틸케이스 립체어 체험",
    image: "/assets/listings/office-chair.png",
    location: "판교역 근처",
    region: { province: "경기도", city: "성남시", district: "분당구", dong: "삼평동" },
    price: 22000,
    deposit: 120000,
    period: "1~3일",
    details: "재택근무 의자 구매 전 체험용. 직접 픽업 가능하고 반납 전 사진 확인합니다.",
    condition: "상태 A",
    method: "pickup",
    sellerType: "personal",
    service: "체험 대여",
    owner: "판교 워커",
    rating: 4.9,
    verified: true,
    created: 6
  },
  {
    id: 8,
    type: "request",
    category: "tools",
    title: "사다리 2m 내외 구합니다",
    image: "/assets/listings/power-drill.png",
    location: "서초구 방배동",
    region: { province: "서울특별시", city: "서울시", district: "서초구", dong: "방배동" },
    price: 8000,
    deposit: 30000,
    period: "반나절",
    details: "조명 교체용이라 접이식 사다리면 됩니다. 오늘 저녁 직거래 가능해요.",
    condition: "안전 잠금 필수",
    method: "pickup",
    sellerType: "personal",
    service: "직접 픽업",
    owner: "방배 셀프수리",
    rating: 4.5,
    verified: false,
    created: 5
  },
  {
    id: 9,
    type: "offer",
    category: "office",
    title: "허먼밀러 스타일 메쉬 의자",
    image: "/assets/listings/office-chair.png",
    location: "강남구 삼성동",
    region: { province: "서울특별시", city: "서울시", district: "강남구", dong: "삼성동" },
    price: 28000,
    deposit: 180000,
    period: "1~3일",
    details: "고급 메쉬 의자 체험용 대여입니다. 실제 구매 전 하루 이상 앉아보고 싶은 분께 추천합니다.",
    condition: "상태 A",
    method: "pickup",
    sellerType: "personal",
    service: "체험 대여",
    owner: "삼성 오피스체어",
    rating: 4.9,
    verified: true,
    created: 4
  },
  {
    id: 10,
    type: "offer",
    category: "office",
    title: "낮은 메모리폼 베개 체험",
    image: "/assets/listings/pillow.png",
    location: "마포구 망원동",
    region: { province: "서울특별시", city: "서울시", district: "마포구", dong: "망원동" },
    price: 4500,
    deposit: 20000,
    period: "2~4일",
    details: "세탁 가능한 새 커버 포함. 낮은 베개가 맞는지 확인하려는 분께 적합합니다.",
    condition: "새 커버 포함",
    method: "delivery",
    sellerType: "business",
    service: "커버 제공",
    owner: "망원 수면렌탈",
    rating: 4.8,
    verified: true,
    created: 3
  }
];

const categoryNames: Record<Category, string> = {
  tools: "공구",
  event: "행사용품",
  electronics: "전자/촬영",
  camping: "캠핑/레저",
  machine: "소형장비",
  office: "홈오피스"
};

const categoryDescriptions: Record<Category, string> = {
  tools: "드릴, 사다리",
  event: "의자, 천막",
  electronics: "프로젝터, 음향",
  camping: "웨건, 텐트",
  machine: "세척기, 농기구",
  office: "의자, 책상"
};

const typeNames: Record<ListingType, string> = {
  offer: "빌려드림",
  request: "구해요"
};

const methodNames: Record<Method, string> = {
  pickup: "직거래",
  delivery: "택배/퀵",
  both: "직거래+배송"
};

const categoryTone: Record<Category, string> = {
  tools: "tile-green",
  event: "tile-blue",
  electronics: "tile-ink",
  camping: "tile-amber",
  machine: "tile-rose",
  office: "tile-slate"
};

const sellerTypeNames: Record<SellerType, string> = {
  business: "업체",
  personal: "개인"
};

const regionTree: Record<string, Record<string, Record<string, string[]>>> = {
  서울특별시: {
    서울시: {
      강남구: ["역삼동", "삼성동", "논현동", "청담동"],
      마포구: ["합정동", "성산동", "망원동", "상암동"],
      성동구: ["성수동", "왕십리동", "금호동"],
      송파구: ["잠실동", "문정동", "방이동"],
      관악구: ["봉천동", "신림동"],
      서초구: ["방배동", "서초동", "양재동"]
    }
  },
  경기도: {
    성남시: {
      분당구: ["정자동", "삼평동", "서현동"],
      수정구: ["태평동", "수진동"]
    },
    수원시: {
      영통구: ["영통동", "광교동"],
      팔달구: ["인계동", "매산동"]
    },
    고양시: {
      일산동구: ["장항동", "마두동"],
      덕양구: ["화정동", "행신동"]
    }
  },
  부산광역시: {
    부산시: {
      해운대구: ["우동", "좌동", "중동"],
      부산진구: ["부전동", "전포동"],
      수영구: ["광안동", "남천동"]
    }
  },
  인천광역시: {
    인천시: {
      연수구: ["송도동", "연수동"],
      남동구: ["구월동", "논현동"],
      부평구: ["부평동", "삼산동"]
    }
  },
  대전광역시: {
    대전시: {
      유성구: ["봉명동", "궁동", "도룡동"],
      서구: ["둔산동", "갈마동"]
    }
  }
};

const emptyRegion = {
  province: "all",
  city: "all",
  district: "all",
  dong: "all"
};

function money(value: number) {
  return value.toLocaleString("ko-KR") + "원";
}

function compactMoney(value: number) {
  if (value >= 10000) return `${Math.round(value / 1000) / 10}만`;
  return money(value);
}

export default function Home() {
  const { data: session } = useSession();
  const contactDialogRef = useRef<HTMLDialogElement | null>(null);
  const [listings, setListings] = useState(initialListings);
  const [mode, setMode] = useState<"all" | ListingType>("all");
  const [category, setCategory] = useState<"all" | Category>("all");
  const [method, setMethod] = useState<"all" | Method>("all");
  const [sort, setSort] = useState("recommended");
  const [query, setQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(emptyRegion);
  const [postRegion, setPostRegion] = useState({
    province: "서울특별시",
    city: "서울시",
    district: "강남구",
    dong: "역삼동"
  });
  const [saved, setSaved] = useState<number[]>([]);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authMessage, setAuthMessage] = useState("");
  const [authSuccess, setAuthSuccess] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [providerStatus, setProviderStatus] = useState({ google: false, naver: false });
  const [activeView, setActiveView] = useState<ActiveView>("home");

  const loggedIn = Boolean(session?.user);
  const provinceOptions = Object.keys(regionTree);
  const cityOptions = selectedRegion.province === "all" ? [] : Object.keys(regionTree[selectedRegion.province] || {});
  const districtOptions = selectedRegion.province === "all" || selectedRegion.city === "all"
    ? []
    : Object.keys(regionTree[selectedRegion.province]?.[selectedRegion.city] || {});
  const dongOptions = selectedRegion.province === "all" || selectedRegion.city === "all" || selectedRegion.district === "all"
    ? []
    : regionTree[selectedRegion.province]?.[selectedRegion.city]?.[selectedRegion.district] || [];
  const postCityOptions = Object.keys(regionTree[postRegion.province] || {});
  const postDistrictOptions = Object.keys(regionTree[postRegion.province]?.[postRegion.city] || {});
  const postDongOptions = regionTree[postRegion.province]?.[postRegion.city]?.[postRegion.district] || [];
  const historyReadyRef = useRef(false);
  const applyingHistoryRef = useRef(false);

  useEffect(() => {
    fetch("/api/auth/provider-status")
      .then((response) => response.json())
      .then((status) => setProviderStatus({
        google: Boolean(status.google),
        naver: Boolean(status.naver)
      }))
      .catch(() => setProviderStatus({ google: false, naver: false }));
  }, []);

  useEffect(() => {
    if (!historyReadyRef.current) {
      window.history.replaceState({ activeView: "home", listingId: null }, "", window.location.href);
      historyReadyRef.current = true;
    }

    const handlePopState = (event: PopStateEvent) => {
      applyingHistoryRef.current = true;
      const historyState = event.state as { activeView?: ActiveView; listingId?: number | null } | null;
      const nextView = historyState?.activeView || "home";

      if (nextView === "detail" && historyState?.listingId) {
        const item = listings.find((entry) => entry.id === historyState.listingId);
        setSelectedListing(item || null);
        setActiveView(item ? "detail" : "home");
      } else {
        setActiveView(nextView);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [listings]);

  useEffect(() => {
    if (!historyReadyRef.current) return;

    const listingId = activeView === "detail" ? selectedListing?.id ?? null : null;
    const nextState = { activeView, listingId };
    const currentState = window.history.state as { activeView?: ActiveView; listingId?: number | null } | null;

    if (applyingHistoryRef.current) {
      applyingHistoryRef.current = false;
      return;
    }

    if (currentState?.activeView === activeView && currentState?.listingId === listingId) return;

    window.history.pushState(nextState, "", window.location.href);
  }, [activeView, selectedListing?.id]);

  const filteredListings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return listings
      .filter((item) => {
        const modeMatch = mode === "all" || item.type === mode;
        const categoryMatch = category === "all" || item.category === category;
        const methodMatch = method === "all" || item.method === method || item.method === "both";
        const verifiedMatch = !verifiedOnly || item.verified;
        const provinceMatch = selectedRegion.province === "all" || item.region.province === selectedRegion.province;
        const cityMatch = selectedRegion.city === "all" || item.region.city === selectedRegion.city;
        const districtMatch = selectedRegion.district === "all" || item.region.district === selectedRegion.district;
        const dongMatch = selectedRegion.dong === "all" || item.region.dong === selectedRegion.dong;
        const text = [
          item.title,
          item.location,
          item.details,
          item.owner,
          categoryNames[item.category]
        ].join(" ").toLowerCase();
        return modeMatch && categoryMatch && methodMatch && verifiedMatch && provinceMatch && cityMatch && districtMatch && dongMatch && (!normalizedQuery || text.includes(normalizedQuery));
      })
      .sort((a, b) => {
        if (sort === "priceLow") return a.price - b.price;
        if (sort === "depositLow") return a.deposit - b.deposit;
        if (sort === "rating") return b.rating - a.rating;
        return Number(b.verified) - Number(a.verified) || b.created - a.created;
      });
  }, [category, listings, method, mode, query, selectedRegion, sort, verifiedOnly]);

  function requireAuth(message: string) {
    if (loggedIn) return true;
    setAuthMode("login");
    setAuthMessage(message);
    setAuthSuccess(false);
    setActiveView("login");
    return false;
  }

  async function handleCredentialsAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthMessage("");
    setAuthSuccess(false);

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    if (authMode === "signup") {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const result = await response.json();
      if (!response.ok) {
        setAuthMessage(result.error || "회원가입에 실패했습니다.");
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    if (result?.error) {
      setAuthMessage("이메일 또는 비밀번호가 맞지 않습니다.");
      return;
    }

    setAuthSuccess(true);
    setAuthMessage(authMode === "signup" ? "가입과 로그인이 완료되었습니다." : "로그인되었습니다.");
    setActiveView("home");
  }

  function handlePostSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!requireAuth("글을 등록하려면 로그인해야 합니다.")) return;

    const form = new FormData(event.currentTarget);
    const itemCategory = form.get("category") as Category;
    const province = String(form.get("province") || "서울특별시");
    const city = String(form.get("city") || "서울시");
    const district = String(form.get("district") || "강남구");
    const dong = String(form.get("dong") || "역삼동");
    const newListing: Listing = {
      id: Date.now(),
      type: form.get("type") as ListingType,
      category: itemCategory,
      title: String(form.get("title") || ""),
      location: `${district} ${dong}`,
      region: { province, city, district, dong },
      price: Number(String(form.get("price") || "").replace(/[^0-9]/g, "")),
      deposit: Number(String(form.get("deposit") || "").replace(/[^0-9]/g, "")),
      period: String(form.get("period") || ""),
      details: String(form.get("details") || ""),
      condition: String(form.get("condition") || "상태 확인 필요"),
      method: form.get("method") as Method,
      sellerType: form.get("sellerType") as SellerType,
      service: String(form.get("service") || "조건 협의"),
      image: "/assets/listings/power-drill.png",
      owner: session?.user?.name || "새 사용자",
      rating: 5,
      verified: true,
      created: Date.now()
    };

    setListings((current) => [newListing, ...current]);
    setMode("all");
    event.currentTarget.reset();
    setActiveView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleContact(item: Listing) {
    if (!requireAuth("연락하려면 먼저 로그인해야 합니다.")) return;
    setSelectedListing(item);
    contactDialogRef.current?.showModal();
  }

  function openListingDetail(item: Listing) {
    setSelectedListing(item);
    setActiveView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSocialSignIn(provider: "google" | "naver") {
    const isConfigured = providerStatus[provider];
    if (isConfigured) {
      signIn(provider, { callbackUrl: "/" });
      return;
    }
    signIn(`${provider}-demo`, { redirect: false });
  }

  function openAuth(mode: "login" | "signup") {
    setAuthMode(mode);
    setAuthMessage("");
    setAuthSuccess(false);
    setActiveView(mode);
  }

  function openPrivateView(view: "mypage" | "settings") {
    if (!loggedIn) {
      requireAuth(view === "mypage" ? "마이페이지는 로그인 후 이용할 수 있습니다." : "설정은 로그인 후 이용할 수 있습니다.");
      return;
    }
    setActiveView(view);
  }

  return (
    <div className="market-shell">
      <header className="site-header">
        <button className="brand brand-button" type="button" onClick={() => setActiveView("home")}>
          <div className="brand-mark">봄</div>
          <div>
            <strong>빌려봄</strong>
            <span>try before rent</span>
          </div>
        </button>

        <div className="header-search">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder="공구, 천막, 빔프로젝터, 지역 검색"
          />
        </div>

        <div className="header-actions">
          {loggedIn ? (
            <>
              <div className="user-chip"><UserRound size={16} />{session?.user?.name || session?.user?.email}</div>
              <button
                className="ghost-button icon-text"
                type="button"
                onClick={() => openPrivateView("mypage")}
              >
                <UserCog size={16} /> 마이페이지
              </button>
              <button
                className="ghost-button icon-text"
                type="button"
                onClick={() => openPrivateView("settings")}
              >
                <Settings size={16} /> 설정
              </button>
              <button className="ghost-button icon-text" type="button" onClick={() => {
                signOut({ redirect: false });
                setActiveView("home");
              }}>
                <LogOut size={16} /> 로그아웃
              </button>
            </>
          ) : (
            <>
              <button className="ghost-button icon-text" type="button" onClick={() => openAuth("login")}>
                <UserRound size={16} /> 로그인
              </button>
              <button className="ghost-button icon-text" type="button" onClick={() => openAuth("signup")}>
                <UserPlus size={16} /> 회원가입
              </button>
              <button
                className="ghost-button icon-text"
                type="button"
                onClick={() => openPrivateView("mypage")}
              >
                <UserCog size={16} /> 마이페이지
              </button>
              <button
                className="ghost-button icon-text"
                type="button"
                onClick={() => openPrivateView("settings")}
              >
                <Settings size={16} /> 설정
              </button>
            </>
          )}
          <button
            className="primary-button icon-text"
            type="button"
            onClick={() => {
              if (requireAuth("글을 올리려면 로그인하거나 회원가입해야 합니다.")) {
                setActiveView("post");
              }
            }}
          >
            <Plus size={17} /> 글 올리기
          </button>
        </div>
      </header>

      <main className="market-main">
        {activeView === "home" ? (
          <>
        <section className="hero-band" aria-label="구매 전 체험과 필요한 날 대여">
          <img src="/assets/comfort-rental-banner.png" alt="의자와 베개가 놓인 깨끗한 방" />
          <div className="hero-copy">
            <div className="eyebrow"><ShieldCheck size={16} /> 개인과 업체가 함께하는 안심 대여</div>
            <h1>고민되는 구매 전 대여,<br />필요한 날 빌리는 물건.</h1>
            <p>의자와 베개처럼 써봐야 아는 물건부터 공구, 행사 용품, 전자기기, 캠핑 장비까지 필요한 기간만 빌려보세요.</p>
            <div className="hero-proof">
              <span>업체 인증</span>
              <span>개인 인증</span>
              <span>보증금 예치</span>
              <span>배송·설치 옵션</span>
            </div>
            <div className="hero-actions">
              <button className="primary-button icon-text" type="button" onClick={() => setMode("offer")}>
                <PackageCheck size={17} /> 장비 둘러보기
              </button>
              <button className="ghost-on-image icon-text" type="button" onClick={() => setMode("request")}>
                <Handshake size={17} /> 요청 글 보기
              </button>
            </div>
          </div>
        </section>

        <section className="quick-stats" aria-label="거래 현황">
          <div><strong>{listings.length}</strong><span>등록 글</span></div>
          <div><strong>{listings.filter((item) => item.sellerType === "business").length}</strong><span>업체 매물</span></div>
          <div><strong>{listings.filter((item) => item.type === "request").length}</strong><span>대여 요청</span></div>
          <div><strong>{saved.length}</strong><span>찜한 글</span></div>
        </section>

        <section className="category-strip" aria-label="카테고리">
          {(["tools", "event", "electronics", "camping", "machine", "office"] as Category[]).map((entry) => (
            <button
              key={entry}
              className={category === entry ? "category-card active" : "category-card"}
              type="button"
              onClick={() => setCategory(category === entry ? "all" : entry)}
            >
              <span>{categoryNames[entry]}</span>
              <small>{categoryDescriptions[entry]}</small>
            </button>
          ))}
        </section>

        <div className="content-grid">
          <section className="feed" aria-label="대여 글 목록">
            <div className="feed-head">
              <div>
                <h2>오늘 올라온 대여 거래</h2>
                <p>업체 매물과 개인 매물을 보증금, 상태, 거래방식 기준으로 비교하세요.</p>
              </div>
              <div className="result-count">{filteredListings.length}개</div>
            </div>

            <div className="filter-bar">
              <div className="segmented" role="tablist" aria-label="글 종류">
                {(["all", "offer", "request"] as const).map((entry) => (
                  <button
                    key={entry}
                    className={mode === entry ? "active" : ""}
                    type="button"
                    onClick={() => setMode(entry)}
                  >
                    {entry === "all" ? "전체" : typeNames[entry]}
                  </button>
                ))}
              </div>

              <label className="check-filter">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(event) => setVerifiedOnly(event.target.checked)}
                />
                <BadgeCheck size={15} /> 인증만
              </label>

              <div className="region-selects" aria-label="지역 선택">
                <select
                  value={selectedRegion.province}
                  onChange={(event) => setSelectedRegion({ province: event.target.value, city: "all", district: "all", dong: "all" })}
                  aria-label="시도"
                >
                  <option value="all">시/도 전체</option>
                  {provinceOptions.map((province) => <option key={province} value={province}>{province}</option>)}
                </select>
                <select
                  value={selectedRegion.city}
                  onChange={(event) => setSelectedRegion((current) => ({ ...current, city: event.target.value, district: "all", dong: "all" }))}
                  aria-label="시군구"
                  disabled={selectedRegion.province === "all"}
                >
                  <option value="all">시/군 전체</option>
                  {cityOptions.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
                <select
                  value={selectedRegion.district}
                  onChange={(event) => setSelectedRegion((current) => ({ ...current, district: event.target.value, dong: "all" }))}
                  aria-label="구"
                  disabled={selectedRegion.city === "all"}
                >
                  <option value="all">구 전체</option>
                  {districtOptions.map((district) => <option key={district} value={district}>{district}</option>)}
                </select>
                <select
                  value={selectedRegion.dong}
                  onChange={(event) => setSelectedRegion((current) => ({ ...current, dong: event.target.value }))}
                  aria-label="동"
                  disabled={selectedRegion.district === "all"}
                >
                  <option value="all">동 전체</option>
                  {dongOptions.map((dong) => <option key={dong} value={dong}>{dong}</option>)}
                </select>
              </div>

              <div className="select-wrap">
                <SlidersHorizontal size={16} />
                <select value={method} onChange={(event) => setMethod(event.target.value as "all" | Method)} aria-label="거래 방식">
                  <option value="all">거래 방식</option>
                  <option value="pickup">직거래</option>
                  <option value="delivery">택배/퀵</option>
                  <option value="both">둘 다 가능</option>
                </select>
              </div>

              <div className="select-wrap">
                <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="정렬">
                  <option value="recommended">추천순</option>
                  <option value="priceLow">낮은 가격</option>
                  <option value="depositLow">낮은 보증금</option>
                  <option value="rating">평점 높은순</option>
                </select>
              </div>
            </div>

            <div className="listing-grid">
              {filteredListings.map((item) => (
                <article className="product-card" key={item.id} onClick={() => openListingDetail(item)}>
                  <div className="product-visual photo-visual">
                    <img src={item.image} alt={item.title} />
                    <div className="photo-label">
                      <span>{categoryNames[item.category]}</span>
                      <small>{item.condition}</small>
                    </div>
                    <button
                      className={`save-button ${saved.includes(item.id) ? "saved" : ""}`}
                      type="button"
                      title="찜하기"
                      onClick={(event) => {
                        event.stopPropagation();
                        if (!requireAuth("찜한 글은 로그인 후 저장할 수 있습니다.")) return;
                        setSaved((current) => current.includes(item.id)
                          ? current.filter((id) => id !== item.id)
                          : [...current, item.id]);
                      }}
                    >
                      <Heart size={18} fill={saved.includes(item.id) ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <div className="product-body">
                    <div className="seller-line">
                      <span>{item.owner}</span>
                      <span><Star size={13} fill="currentColor" /> {item.rating.toFixed(1)}</span>
                    </div>
                    <div className="card-badges">
                      <span className={`badge ${item.type}`}>{typeNames[item.type]}</span>
                      <span className={`badge seller-${item.sellerType}`}>{sellerTypeNames[item.sellerType]}</span>
                      {item.verified && <span className="badge verified"><BadgeCheck size={13} /> 인증</span>}
                    </div>

                    <h3>{item.title}</h3>
                    <p className="product-detail">{item.details}</p>

                    <div className="card-meta">
                      <span><MapPin size={14} />{item.location}</span>
                      <span><Clock3 size={14} />{item.period}</span>
                    </div>

                    <div className="condition-row">
                      <span>{item.condition}</span>
                      <span>{methodNames[item.method]}</span>
                      <span>{item.service}</span>
                    </div>

                  </div>

                  <div className="card-bottom">
                    <div>
                      <strong>{money(item.price)}</strong>
                      <span>1일 기준 · 보증금 {compactMoney(item.deposit)}</span>
                    </div>
                    <button className="primary-button compact icon-text" type="button" onClick={(event) => {
                      event.stopPropagation();
                      handleContact(item);
                    }}>
                      <MessageCircle size={16} /> 연락
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className={`empty ${filteredListings.length ? "" : "show"}`}>
              조건에 맞는 글이 없습니다. 필터를 줄이거나 요청 글을 올려보세요.
            </div>
          </section>

          <aside className="side-rail">
            <section className="panel trust-panel" aria-label="안심 거래">
              <div className="panel-header">
                <h2>장비 대여 안전 기준</h2>
                <p>고가 장비와 행사 물품 거래에서 필요한 조건을 먼저 확인합니다.</p>
              </div>
              <div className="trust-list">
                <div><ShieldCheck size={18} /><span>업체/개인 인증 뱃지</span></div>
                <div><CheckCircle2 size={18} /><span>구성품·상태 사진 체크</span></div>
                <div><Truck size={18} /><span>배송·설치·회수 조건 구분</span></div>
                <div><Wrench size={18} /><span>고위험 장비는 안전 안내 필수</span></div>
              </div>
            </section>
          </aside>
        </div>
          </>
        ) : activeView === "login" || activeView === "signup" ? (
          <section className="auth-page" aria-label={activeView === "login" ? "로그인" : "회원가입"}>
            <div className="auth-visual">
              <div className="eyebrow dark"><ShieldCheck size={16} /> 안전한 장비 대여 시작</div>
              <h1>{activeView === "login" ? "다시 오신 걸 환영합니다." : "맞잠 계정을 만들어보세요."}</h1>
              <p>
                {activeView === "login"
                  ? "로그인하면 찜한 장비, 연락 내역, 등록한 대여 글을 이어서 관리할 수 있습니다."
                  : "개인 장비도, 업체 매물도 한 계정에서 등록하고 관리할 수 있습니다."}
              </p>
              <div className="auth-benefits">
                <span><BadgeCheck size={15} /> 인증 매물 연락</span>
                <span><Heart size={15} /> 관심 장비 저장</span>
                <span><PackageCheck size={15} /> 대여 글 등록</span>
              </div>
            </div>

            <div className="auth-card">
              <div className="panel-header">
                <h2>{activeView === "login" ? "로그인" : "회원가입"}</h2>
                <p>{activeView === "login" ? "이메일 또는 소셜 계정으로 로그인하세요." : "간단한 정보로 바로 시작할 수 있습니다."}</p>
              </div>
              <form onSubmit={handleCredentialsAuth}>
                {activeView === "signup" && (
                  <label>이름
                    <input name="name" required maxLength={18} placeholder="홍길동" />
                  </label>
                )}
                <label>이메일
                  <input name="email" type="email" required placeholder="demo@matjam.kr" />
                </label>
                <label>비밀번호
                  <input name="password" type="password" required minLength={6} placeholder="demo1234" />
                </label>
                {authMessage && <div className={`auth-hint ${authSuccess ? "auth-success" : ""}`}>{authMessage}</div>}
                <button className="primary-button" type="submit">
                  {activeView === "signup" ? "회원가입" : "로그인"}
                </button>
                <div className="auth-divider">또는</div>
                <button className="ghost-button provider-button google-button" type="button" onClick={() => handleSocialSignIn("google")}>
                  Google로 로그인{providerStatus.google ? "" : " (개발용)"}
                </button>
                <button className="ghost-button provider-button naver-button" type="button" onClick={() => handleSocialSignIn("naver")}>
                  Naver로 로그인{providerStatus.naver ? "" : " (개발용)"}
                </button>
                <button
                  className="text-button"
                  type="button"
                  onClick={() => openAuth(activeView === "login" ? "signup" : "login")}
                >
                  {activeView === "login" ? "계정이 없나요? 회원가입" : "이미 계정이 있나요? 로그인"}
                </button>
              </form>
            </div>
          </section>
        ) : activeView === "detail" && selectedListing ? (
          <section className="detail-page" aria-label="상품 상세정보">
            <button className="ghost-button icon-text back-button" type="button" onClick={() => setActiveView("home")}>
              <Search size={16} /> 목록으로 돌아가기
            </button>

            <div className="detail-grid">
              <div className="detail-visual detail-photo">
                <img src={selectedListing.image} alt={selectedListing.title} />
                <div>
                  <span>{categoryNames[selectedListing.category]}</span>
                  <strong>{selectedListing.title}</strong>
                  <small>{selectedListing.condition}</small>
                </div>
              </div>

              <aside className="detail-summary">
                <div className="card-badges">
                  <span className={`badge ${selectedListing.type}`}>{typeNames[selectedListing.type]}</span>
                  <span className={`badge seller-${selectedListing.sellerType}`}>{sellerTypeNames[selectedListing.sellerType]}</span>
                  {selectedListing.verified && <span className="badge verified"><BadgeCheck size={13} /> 인증</span>}
                </div>
                <h1>{selectedListing.title}</h1>
                <div className="detail-price">
                  <strong>{money(selectedListing.price)}</strong>
                  <span>1일 기준 · 보증금 {money(selectedListing.deposit)}</span>
                </div>
                <button className="primary-button icon-text" type="button" onClick={() => handleContact(selectedListing)}>
                  <MessageCircle size={16} /> 대여 문의하기
                </button>
                <button
                  className="ghost-button icon-text"
                  type="button"
                  onClick={() => {
                    if (!requireAuth("찜한 글은 로그인 후 저장할 수 있습니다.")) return;
                    setSaved((current) => current.includes(selectedListing.id)
                      ? current.filter((id) => id !== selectedListing.id)
                      : [...current, selectedListing.id]);
                  }}
                >
                  <Heart size={16} fill={saved.includes(selectedListing.id) ? "currentColor" : "none"} /> 찜하기
                </button>
              </aside>
            </div>

            <div className="detail-content">
              <section className="panel">
                <div className="panel-header">
                  <h2>상세 정보</h2>
                  <p>대여 전 꼭 확인해야 하는 조건입니다.</p>
                </div>
                <div className="detail-info-grid">
                  <div><span>카테고리</span><strong>{categoryNames[selectedListing.category]}</strong></div>
                  <div><span>대여 기간</span><strong>{selectedListing.period}</strong></div>
                  <div><span>거래 방식</span><strong>{methodNames[selectedListing.method]}</strong></div>
                  <div><span>서비스 옵션</span><strong>{selectedListing.service}</strong></div>
                  <div><span>상태</span><strong>{selectedListing.condition}</strong></div>
                  <div><span>공급자 유형</span><strong>{sellerTypeNames[selectedListing.sellerType]}</strong></div>
                </div>
                <div className="detail-description">
                  <h3>설명</h3>
                  <p>{selectedListing.details}</p>
                </div>
              </section>

              <section className="panel">
                <div className="panel-header">
                  <h2>대여자 / 위치</h2>
                  <p>상세 주소는 거래 확정 후 공유됩니다.</p>
                </div>
                <div className="owner-card">
                  <div className="owner-avatar">{selectedListing.owner.slice(0, 1)}</div>
                  <div>
                    <strong>{selectedListing.owner}</strong>
                    <span><Star size={14} fill="currentColor" /> {selectedListing.rating.toFixed(1)} · {selectedListing.verified ? "인증 완료" : "인증 전"}</span>
                  </div>
                </div>
                <div className="location-card">
                  <MapPin size={20} />
                  <div>
                    <strong>{selectedListing.region.province} {selectedListing.region.city}</strong>
                    <span>{selectedListing.region.district} {selectedListing.region.dong}</span>
                  </div>
                </div>
                <div className="map-placeholder">
                  <MapPin size={26} />
                  <strong>{selectedListing.region.district} {selectedListing.region.dong} 근처</strong>
                  <span>정확한 픽업 위치는 대여자와 대화 후 확정됩니다.</span>
                </div>
              </section>
            </div>
          </section>
        ) : activeView === "post" ? (
          <section className="post-page" aria-label="대여 글 등록">
            <div className="account-hero">
              <div>
                <div className="eyebrow dark"><Plus size={16} /> 대여 글 등록</div>
                <h1>빌려줄 장비나 필요한 물품을 올려보세요.</h1>
                <p>개인 장비와 업체 매물을 모두 등록할 수 있습니다. 지역, 거래 방식, 보증금, 서비스 조건을 명확히 적을수록 거래가 빨라집니다.</p>
              </div>
              <button className="ghost-button icon-text" type="button" onClick={() => setActiveView("home")}>
                <Search size={16} /> 목록으로
              </button>
            </div>

            <section className="post-card">
              <form onSubmit={handlePostSubmit}>
                <div className="radio-row" aria-label="글 종류 선택">
                  <label className="radio-card">빌려드림<input type="radio" name="type" value="offer" defaultChecked /></label>
                  <label className="radio-card">구해요<input type="radio" name="type" value="request" /></label>
                </div>
                <label>제목
                  <input name="title" required maxLength={42} placeholder="예: 천막 3x3 + 접이식 의자 대여" />
                </label>
                <div className="field-row">
                  <label>품목
                    <select name="category" required defaultValue="tools">
                      <option value="tools">공구</option>
                      <option value="event">행사용품</option>
                      <option value="electronics">전자/촬영</option>
                      <option value="camping">캠핑/레저</option>
                      <option value="machine">소형장비</option>
                      <option value="office">홈오피스</option>
                    </select>
                  </label>
                  <label>공급자
                    <select name="sellerType" required defaultValue="personal">
                      <option value="personal">개인</option>
                      <option value="business">업체</option>
                    </select>
                  </label>
                </div>

                <div className="region-form-grid">
                  <label>시/도
                    <select
                      name="province"
                      required
                      value={postRegion.province}
                      onChange={(event) => {
                        const province = event.target.value;
                        const city = Object.keys(regionTree[province] || {})[0] || "";
                        const district = Object.keys(regionTree[province]?.[city] || {})[0] || "";
                        const dong = regionTree[province]?.[city]?.[district]?.[0] || "";
                        setPostRegion({ province, city, district, dong });
                      }}
                    >
                      {provinceOptions.map((province) => <option key={province} value={province}>{province}</option>)}
                    </select>
                  </label>
                  <label>시/군
                    <select
                      name="city"
                      required
                      value={postRegion.city}
                      onChange={(event) => {
                        const city = event.target.value;
                        const district = Object.keys(regionTree[postRegion.province]?.[city] || {})[0] || "";
                        const dong = regionTree[postRegion.province]?.[city]?.[district]?.[0] || "";
                        setPostRegion((current) => ({ ...current, city, district, dong }));
                      }}
                    >
                      {postCityOptions.map((city) => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </label>
                  <label>구
                    <select
                      name="district"
                      required
                      value={postRegion.district}
                      onChange={(event) => {
                        const district = event.target.value;
                        const dong = regionTree[postRegion.province]?.[postRegion.city]?.[district]?.[0] || "";
                        setPostRegion((current) => ({ ...current, district, dong }));
                      }}
                    >
                      {postDistrictOptions.map((district) => <option key={district} value={district}>{district}</option>)}
                    </select>
                  </label>
                  <label>동
                    <select
                      name="dong"
                      required
                      value={postRegion.dong}
                      onChange={(event) => setPostRegion((current) => ({ ...current, dong: event.target.value }))}
                    >
                      {postDongOptions.map((dong) => <option key={dong} value={dong}>{dong}</option>)}
                    </select>
                  </label>
                </div>

                <div className="field-row">
                  <label>하루 대여비
                    <input name="price" required inputMode="numeric" placeholder="8000" />
                  </label>
                  <label>보증금
                    <input name="deposit" required inputMode="numeric" placeholder="30000" />
                  </label>
                </div>
                <div className="field-row">
                  <label>대여 기간
                    <input name="period" required maxLength={24} placeholder="1~7일" />
                  </label>
                  <label>거래 방식
                    <select name="method" required defaultValue="pickup">
                      <option value="pickup">직거래</option>
                      <option value="delivery">택배/퀵</option>
                      <option value="both">둘 다 가능</option>
                    </select>
                  </label>
                </div>
                <div className="field-row">
                  <label>서비스 옵션
                    <input name="service" required maxLength={24} placeholder="설치 가능, 배송 가능" />
                  </label>
                  <label>상태
                    <input name="condition" required maxLength={24} placeholder="점검 완료, 생활기스 있음" />
                  </label>
                </div>
                <label>상태와 조건
                  <textarea name="details" required maxLength={150} placeholder="구성품, 사용 조건, 반납 전 사진 확인, 배송/설치 가능 여부" />
                </label>
                <button className="primary-button icon-text" type="submit"><Plus size={16} /> 등록하기</button>
              </form>
            </section>
          </section>
        ) : activeView === "mypage" ? (
          <section className="account-page" aria-label="마이페이지">
            <div className="account-hero">
              <div>
                <div className="eyebrow dark"><UserCog size={16} /> 마이페이지</div>
                <h1>{session?.user?.name || "사용자"}님의 대여 활동</h1>
                <p>찜한 글, 등록한 장비, 연락 내역, 보증금 상태를 한 곳에서 관리합니다.</p>
              </div>
              <button className="primary-button icon-text" type="button" onClick={() => setActiveView("home")}>
                <Search size={16} /> 장비 보러가기
              </button>
            </div>

            <div className="account-grid">
              <div className="account-card">
                <strong>{saved.length}</strong>
                <span>찜한 글</span>
              </div>
              <div className="account-card">
                <strong>{listings.filter((item) => item.owner === (session?.user?.name || "새 사용자")).length}</strong>
                <span>내 등록 글</span>
              </div>
              <div className="account-card">
                <strong>0</strong>
                <span>진행 중 거래</span>
              </div>
              <div className="account-card">
                <strong>인증 대기</strong>
                <span>신분/사업자 인증</span>
              </div>
            </div>

            <div className="account-sections">
              <section className="panel">
                <div className="panel-header">
                  <h2>최근 찜한 장비</h2>
                  <p>관심 있는 매물을 저장해두면 나중에 빠르게 연락할 수 있습니다.</p>
                </div>
                <div className="simple-list">
                  {saved.length ? saved.map((id) => {
                    const item = listings.find((entry) => entry.id === id);
                    if (!item) return null;
                    return <div key={id}><span>{item.title}</span><strong>{money(item.price)} / 일</strong></div>;
                  }) : <div><span>아직 찜한 글이 없습니다.</span><strong>장비를 둘러보세요</strong></div>}
                </div>
              </section>

              <section className="panel">
                <div className="panel-header">
                  <h2>계정 정보</h2>
                  <p>로그인된 계정의 기본 정보입니다.</p>
                </div>
                <div className="profile-list">
                  <div><span>이름</span><strong>{session?.user?.name || "-"}</strong></div>
                  <div><span>이메일</span><strong>{session?.user?.email || "-"}</strong></div>
                  <div><span>상태</span><strong>일반 회원</strong></div>
                </div>
              </section>
            </div>
          </section>
        ) : (
          <section className="account-page" aria-label="설정">
            <div className="account-hero">
              <div>
                <div className="eyebrow dark"><Settings size={16} /> 설정</div>
                <h1>거래 환경 설정</h1>
                <p>알림, 인증, 거래 선호 조건을 관리하는 화면입니다.</p>
              </div>
            </div>

            <div className="settings-grid">
              <section className="panel">
                <div className="panel-header">
                  <h2>알림 설정</h2>
                  <p>관심 장비와 거래 메시지 알림을 조정합니다.</p>
                </div>
                <div className="setting-list">
                  <label><input type="checkbox" defaultChecked /> 관심 카테고리 새 매물 알림</label>
                  <label><input type="checkbox" defaultChecked /> 대여 요청 응답 알림</label>
                  <label><input type="checkbox" /> 마케팅/이벤트 알림</label>
                </div>
              </section>

              <section className="panel">
                <div className="panel-header">
                  <h2>거래 기본값</h2>
                  <p>글 등록 시 자주 쓰는 조건을 저장합니다.</p>
                </div>
                <form>
                  <label>기본 지역
                    <input placeholder="예: 마포구 성산동" />
                  </label>
                  <label>선호 거래 방식
                    <select defaultValue="pickup">
                      <option value="pickup">직거래</option>
                      <option value="delivery">택배/퀵</option>
                      <option value="both">둘 다 가능</option>
                    </select>
                  </label>
                  <button className="primary-button" type="button">설정 저장</button>
                </form>
              </section>
            </div>
          </section>
        )}
      </main>

      <dialog ref={contactDialogRef}>
        <div className="modal-body">
          <h2>{selectedListing?.title || "연락하기"}</h2>
          <p>
            {selectedListing
              ? `${selectedListing.location} · ${money(selectedListing.price)} / 일 · 보증금 ${money(selectedListing.deposit)}`
              : ""}
          </p>
          <label>보낼 메시지
            <textarea defaultValue={selectedListing ? `안녕하세요. "${selectedListing.title}" 글 보고 연락드립니다. 가능한 일정이 있을까요?` : ""} />
          </label>
        </div>
        <div className="modal-actions">
          <button className="ghost-button" type="button" onClick={() => contactDialogRef.current?.close()}>닫기</button>
          <button className="primary-button icon-text" type="button" onClick={() => contactDialogRef.current?.close()}>
            <MessageCircle size={16} /> 메시지 보내기
          </button>
        </div>
      </dialog>
    </div>
  );
}
