import Link from "next/link";
import { Footer } from "@/components/sections/Footer";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-display text-lg font-bold text-brand-blue">
            ArmenSTEM
          </Link>
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </header>
      <main id="main" className="container py-12">
        <article className="mx-auto max-w-3xl space-y-4 text-slate-700 [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_p]:leading-relaxed">
          {children}
        </article>
      </main>
      <Footer />
    </>
  );
}
