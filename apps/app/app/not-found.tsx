"use client";

import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center text-slate-900">
      <div className="max-w-md space-y-4 rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <p className="text-sm font-semibold text-purple-600">404</p>
        <h1 className="text-2xl font-bold">Síða fannst ekki</h1>
        <p className="text-sm text-slate-500">
          Við gátum ekki fundið síðuna sem þú óskaðir eftir. Notaðu leiðsagnarhnappana til að komast aftur á réttan stað.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
          <Link
            href="/"
            className="rounded-full bg-slate-900 px-5 py-2 font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Fara á mælaborð
          </Link>
          <Link
            href="/verkefni"
            className="rounded-full border border-slate-200 px-5 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Skoða verkefni
          </Link>
        </div>
      </div>
    </div>
  );
}
