import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-3xl font-bold text-blue-400 backdrop-blur-xl">
          404
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Page Not Found
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          The requested page or documentation topic does not exist. It may have been moved or renamed in a recent release.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
          >
            ← Return Home
          </Link>
          <Link
            href="/docs"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
          >
            Browse Documentation
          </Link>
        </div>
      </div>
    </div>
  );
}
