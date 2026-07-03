"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { getHotProducts } from "@/lib/product-store";
import { getFaqs, type HomeFaq } from "@/lib/faq-store";
import { addFeedback } from "@/lib/feedback-store";
import { hasUserProfile } from "@/lib/profile-store";
import { getNickname } from "@/lib/mock-data";
import ProductCard from "@/components/ProductCard";
import OnboardingModal from "@/components/OnboardingModal";
import type { Product } from "@/lib/types";

const STEPS = [
  { title: "挑选心仪商品" },
  { title: "加入购物车" },
  { title: "下单" },
  { title: "获取成就" },
];

const BENEFITS = [
  { title: "省钱", desc: "每一单都帮你省下真金白银。" },
  { title: "零卡路里", desc: "虚拟购物，不会增加任何实体负担。" },
  { title: "释放多巴胺", desc: "下单瞬间的快乐，无需等待收货。" },
  { title: "零风险", desc: "不发货、不退款、无售后烦恼。" },
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
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    setProducts(getHotProducts().slice(0, 6));
    setNickname(getNickname());
    setFaqs(getFaqs());
    setShowOnboarding(!hasUserProfile());
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchText.trim())}`);
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = feedbackText.trim();
    if (!text) return;
    addFeedback(text);
    setFeedbackText("");
    setFeedbackNotice("反馈已提交，感谢你的建议！");
  };

  useEffect(() => {
    if (!feedbackNotice) return;
    const t = setTimeout(() => setFeedbackNotice(""), 3000);
    return () => clearTimeout(t);
  }, [feedbackNotice]);

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
            className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-full bg-white px-2 py-2 shadow-card"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-light">
              <Search size={18} className="text-accent" />
            </div>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="搜索想要的商品"
              className="flex-1 bg-transparent text-sm text-ink placeholder:text-muted outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
            >
              搜索
            </button>
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
              从数码到图书，精选永远不会送达的好物。
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                : products.map((p) => <ProductCard key={p.id} product={p} />)}
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
          <div className="mb-10 text-center">
            <h2 className="section-title">如何假装购物</h2>
            <p className="section-subtitle text-sm md:text-base">
              四个简单步骤，体验一场永远不会结束的等待。
            </p>
          </div>

          <div className="mx-auto max-w-2xl divide-y divide-ink/5 rounded-2xl bg-white shadow-card">
            {STEPS.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4 px-6 py-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-light text-sm font-bold text-accent">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink">{step.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 优势亮点 */}
      <section className="section bg-white">
        <div className="mx-auto max-w-site px-6 md:px-8">
          <div className="mb-10 text-center">
            <h2 className="section-title">为什么选择假装购物</h2>
            <p className="section-subtitle text-sm md:text-base">
              一种全新的省钱与放松方式。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-cream p-6 transition hover:shadow-soft"
              >
                <h3 className="text-lg font-bold text-ink">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{b.desc}</p>
              </div>
            ))}
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
            {faqs.map((faq) => (
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
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="text-base font-semibold text-ink">{faq.q}</span>
                  <span className="ml-4 text-2xl leading-none text-muted">
                    {openFaqs.has(faq.id) ? "−" : "+"}
                  </span>
                </button>
                {openFaqs.has(faq.id) && (
                  <p className="mt-3 text-sm leading-relaxed text-muted">{faq.a}</p>
                )}
              </div>
            ))}
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
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="请描述你的建议、遇到的问题或任何想吐槽的…"
              rows={5}
              className="w-full resize-none rounded-2xl border border-blush bg-cream/50 px-4 py-3 text-sm text-ink outline-none placeholder:text-muted focus:border-accent"
            />
            <div className="mt-4 flex items-center justify-end gap-4">
              {feedbackNotice && (
                <p className="text-xs text-accent">{feedbackNotice}</p>
              )}
              <button
                type="submit"
                disabled={!feedbackText.trim()}
                className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                submit
              </button>
            </div>
          </form>
        </div>
      </section>

      {showOnboarding && (
        <OnboardingModal
          onComplete={() => {
            setShowOnboarding(false);
            setNickname(getNickname());
          }}
        />
      )}
    </div>
  );
}
