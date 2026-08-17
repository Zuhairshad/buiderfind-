import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { ResourceArticle, ResourceHubSlug } from "@/data/resources";
import { RESOURCE_HUBS } from "@/data/resources";

export function ResourceIndexPage({ hub, articles }: { hub: ResourceHubSlug; articles: readonly ResourceArticle[] }) {
  const details = RESOURCE_HUBS[hub];
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-[#90CAF9] bg-[linear-gradient(135deg,#FFFFFF_0%,#E3F2FD_100%)]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0D47A1]">{details.label}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-[#0D47A1] sm:text-5xl">{details.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#000000] sm:text-lg">{details.intro}</p>
          </div>
        </section>
        <section className="bg-white py-14">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
            {articles.map((article, index) => (
              <Link key={article.slug} href={`/${hub}/${article.slug}`} className="group rounded-3xl border border-[#90CAF9] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#90CAF9] hover:shadow-[0_20px_55px_rgba(13,71,161,0.10)]">
                <div className="flex items-center justify-between gap-4"><span className="text-xs font-bold uppercase tracking-[0.15em] text-[#0D47A1]">{details.label}</span><span className="text-xs font-semibold text-[#000000]">{article.readTime}</span></div>
                <h2 className="mt-5 text-2xl font-bold leading-tight text-[#0D47A1] transition group-hover:text-[#0D47A1]">{article.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[#000000]">{article.standfirst}</p>
                <span className="mt-6 inline-flex text-sm font-bold text-[#0D47A1]">Read article <span className="ml-2 transition-transform group-hover:translate-x-1">→</span></span>
                <span className="sr-only">Article {index + 1}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export function ResourceArticlePage({ article }: { article: ResourceArticle }) {
  const hub = RESOURCE_HUBS[article.hub];
  return (
    <>
      <Navbar />
      <main>
        <article>
          <header className="border-b border-[#90CAF9] bg-[linear-gradient(135deg,#FFFFFF_0%,#E3F2FD_100%)]">
            <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
              <Link href={`/${article.hub}`} className="text-xs font-bold uppercase tracking-[0.18em] text-[#0D47A1]">← {hub.label}</Link>
              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-[#0D47A1] sm:text-5xl">{article.title}</h1>
              <p className="mt-5 text-lg leading-8 text-[#000000]">{article.standfirst}</p>
              <p className="mt-5 text-xs font-semibold text-[#000000]">BuilderFind editorial · {article.readTime}</p>
            </div>
          </header>
          <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_300px]">
            <div className="space-y-10">
              {article.sections.map((section) => (
                <section key={section.title}><h2 className="text-2xl font-bold text-[#0D47A1]">{section.title}</h2><p className="mt-4 text-base leading-8 text-[#000000]">{section.body}</p></section>
              ))}
            </div>
            <aside className="h-fit rounded-3xl bg-[#0D47A1] p-7 text-white lg:sticky lg:top-24">
              <h2 className="text-lg font-bold">Key takeaways</h2>
              <ul className="mt-5 space-y-4">{article.takeaways.map((takeaway) => <li key={takeaway} className="flex gap-3 text-sm leading-6 text-white/85"><span className="font-bold text-[#90CAF9]">✓</span>{takeaway}</li>)}</ul>
              <Link href="/post-a-job" className="mt-7 block rounded-full bg-[#0D47A1] px-5 py-3 text-center text-sm font-bold text-white">Post your job</Link>
            </aside>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

