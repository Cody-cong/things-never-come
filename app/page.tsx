"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  ClipboardCheck,
  Trophy,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { getHotProducts } from "@/lib/product-store";
import { getFaqs, type HomeFaq } from "@/lib/faq-store";
import { addFeedback } from "@/lib/feedback-store";
import { hasUserProfile, getUserProfile } from "@/lib/profile-store";
import dynamic from "next/dynamic";
import ProductCard from "@/components/ProductCard";
import TakeoutBoxIcon from "@/components/TakeoutBoxIcon";
import RippleButton from "@/components/RippleButton";
import type { Product } from "@/lib/types";

const OnboardingModal = dynamic(() => import("@/components/OnboardingModal"), {
  ssr: false,
});

const STEPS = [
  {
    title: "挑选心仪商品",
    desc: "浏览分类，找到让你心动的虚拟好物",
    icon: Search,
  },
  {
    title: "加入购物车",
    desc: "把喜欢的商品加入购物车，享受加购快感",
    icon: ShoppingCart,
  },
  {
    title: "下单",
    desc: "填写信息完成支付，等待永远不会到达的包裹",
    icon: ClipboardCheck,
  },
  {
    title: "获取成就",
    desc: "根据你的下单行为解锁各种趣味成就",
    icon: Trophy,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [nickname, setNickname] = useState("");
  const [searchText, setSearchText] = useState("");
  const [faqs, setFaqs] = useState<HomeFaq[]>([]);
  const [openFaqs, setOpenFaqs] = useState<Set<string>>(new Set());
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackNotice, setFeedbackNotice] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    async function load() {
      const [hot, faqList] = await Promise.all([
        getHotProducts(),
        getFaqs(),
      ]);
      setProducts(hot.slice(0, 6));
      setNickname(getUserProfile().name);
      setFaqs(faqList);
      setShowOnboarding(!hasUserProfile());
      setLoading(false);
    }
    load();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchText.trim()) return;
    setIsSearching(true);
    router.push(`/search?q=${encodeURIComponent(searchText.trim())}`);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = feedbackText.trim();
    if (!text) return;
    await addFeedback(text);
    setFeedbackText("");
    setFeedbackNotice("反馈已提交，感谢你的建议！");
    setFeedbackSuccess(true);
  };

  useEffect(() => {
    if (!feedbackNotice) return;
    const t = setTimeout(() => setFeedbackNotice(""), 3000);
    return () => clearTimeout(t);
  }, [feedbackNotice]);

  useEffect(() => {
    if (!feedbackSuccess) return;
    const t = setTimeout(() => setFeedbackSuccess(false), 2000);
    return () => clearTimeout(t);
  }, [feedbackSuccess]);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="section">
        <div className="mx-auto max-w-site px-6 text-center md:px-8">          <span className="mb-6 inline-block rounded-full bg-white px-4 py-1.5 text-sm font-medium text-accent shadow-card">
            加入购物车，下单，收获多巴胺
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-6xl">
            things never come.
          </h1>
          <p className="mx-auto mt-6 max-w-xl whitespace-pre-wrap text-base leading-relaxed text-muted md:text-lg">
            我们消费的从来不是商品，而是意义。
            {"\n"}——鲍德里亚
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-full bg-white px-2 py-2 shadow-card transition-all focus-within:shadow-soft focus-within:ring-2 focus-within:ring-accent/20"
            aria-label="商品搜索"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-light">
              <Search size={18} className="text-accent" />
            </div>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="搜索想要的商品"
              aria-label="搜索想要的商品"
              className="flex-1 bg-transparent text-sm text-ink placeholder:text-muted outline-none"
            />
            <RippleButton
              type="submit"
              disabled={isSearching}
              className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark press-spring disabled:opacity-70"
            >
              {isSearching ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "搜索"
              )}
            </RippleButton>
          </form>

          <p className="mt-4 text-sm text-muted">            {nickname ? `Hi ${nickname}，准备好大买一场了吗？` : "准备好大买一场了吗？"}
          </p>
        </div>
      </section>

      {/* 热门商品 */}
      <section className="section bg-white">
        <div className="mx-auto max-w-site px-6 md:px-8">
          <div className="mb-10 text-center">
            <h2 className="section-title">热门商品</h2>
            <p className="section-subtitle text-sm md:text-base">
              精选全宇宙一切好物
            </p>
          </div>

          <div className="mx-auto max-w-site">
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-card"
                    >
                      <div className="skeleton aspect-square w-full" />
                      <div className="flex flex-col gap-2 p-4">
                        <div className="skeleton h-4 w-3/4 rounded" />
                        <div className="skeleton h-5 w-20 rounded" />
                      </div>
                    </div>
                  ))
                : products.map((p, idx) => (
                    <ProductCard key={p.id} product={p} priority={idx < 4} />
                  ))}
            </div>

            {!loading && products.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="text-5xl mb-3">📦</div>
                <p className="text-muted">暂无热门商品</p>
              </div>
            )}

            {!loading && products.length > 0 && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => router.push("/category")}
                  className="text-sm font-medium text-accent transition hover:underline"
                >
                  View more →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 步骤流程 */}
      <section id="howto" className="section scroll-mt-24">
        <div className="mx-auto max-w-site px-6 md:px-8">
          <div className="mb-10 flex flex-col items-center">
            <div className="flex items-center gap-3">
              <TakeoutBoxIcon size={44} />
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-tight text-accent">
                  玩法
                </span>
                <span className="text-xs font-semibold tracking-wide text-muted">
                  四个简单步骤，体验一场永远不会结束的等待。
                </span>
              </div>
            </div>
          </div>

          <div className="relative mx-auto max-w-site">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map(({ title, desc, icon: Icon }, idx) => (
                <div
                  key={idx}
                  className="group relative flex flex-col rounded-2xl bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-light text-accent transition group-hover:bg-accent group-hover:text-white">
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  <span className="mb-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cream text-xs font-bold text-accent">
                    {idx + 1}
                  </span>
                  <h3 className="mb-2 text-lg font-bold text-ink">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{desc}</p>

                  {idx < STEPS.length - 1 && (
                    <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-accent/30 lg:block">
                      <ArrowRight size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section scroll-mt-24 bg-white">
        <div className="mx-auto max-w-site px-6 md:px-8">
          <div className="mb-10 text-center">
            <h2 className="section-title">常见问题</h2>
            <p className="section-subtitle text-sm md:text-base">
              关于假装购物的一切疑问。
            </p>
          </div>

          <div className="mx-auto max-w-2xl divide-y divide-ink/5 rounded-2xl bg-white shadow-card">
            {faqs.map((faq) => {
              const isOpen = openFaqs.has(faq.id);
              return (
                <div key={faq.id} className="px-6 py-5">
                  <button
                    onClick={() =>
                      setOpenFaqs((prev) => {
                        const next = new Set(prev);
                        if (next.has(faq.id)) {
                          next.delete(faq.id);
                        } else {
                          next.add(faq.id);
                        }
                        return next;
                      })
                    }
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    className="flex w-full items-center justify-between text-left press-spring"
                  >
                    <span className="text-base font-semibold text-ink">{faq.q}</span>
                    <span className="ml-4 text-2xl leading-none text-muted">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                    aria-hidden={!isOpen}
                  >
                    <div className="overflow-hidden">
                      <p
                        id={`faq-answer-${faq.id}`}
                        className="mt-3 text-sm leading-relaxed text-muted"
                      >
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 反馈 */}
      <section id="feedback" className="section scroll-mt-24 bg-cream">
        <div className="mx-auto max-w-site px-6 md:px-8">
          <div className="mb-10 text-center">
            <h2 className="section-title">反馈</h2>
            <p className="section-subtitle text-sm md:text-base">
              有新的想法或 bug 反馈？告诉我们
            </p>
          </div>

          <form
            onSubmit={handleFeedbackSubmit}
            className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-card md:p-8"
          >
            <label htmlFor="feedback-text" className="sr-only">
              反馈内容
            </label>
            <textarea
              id="feedback-text"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="请描述你的建议、遇到的问题或任何想吐槽的…"
              rows={5}
              aria-label="反馈内容"
              className={`w-full resize-none rounded-2xl bg-cream/50 px-4 py-3 text-sm text-ink outline-none placeholder:text-muted transition ${
                feedbackSuccess
                  ? "border-2 border-green-500 ring-2 ring-green-200"
                  : "border border-blush focus:border-accent"
              }`}
            />
            <div className="mt-4 flex items-center justify-end gap-4">
              {feedbackNotice && (
                <p className="text-xs text-accent">{feedbackNotice}</p>
              )}
              <RippleButton
                type="submit"
                disabled={!feedbackText.trim()}
                className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition hover:bg-accent-dark press-spring disabled:cursor-not-allowed disabled:opacity-50"
              >
                submit
              </RippleButton>
            </div>
          </form>
        </div>
      </section>

      {showOnboarding && (
        <OnboardingModal
          onComplete={() => {
            setShowOnboarding(false);
            setNickname(getUserProfile().name);
          }}
        />
      )}
    </div>
  );
}
