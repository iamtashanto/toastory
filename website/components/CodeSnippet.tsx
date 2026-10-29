'use client';

import React, { useState } from 'react';

interface CodeSnippetProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeSnippet({ code, language = 'typescript', filename }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="relative group rounded-xl border border-white/10 bg-[#0e1017] overflow-hidden my-4 text-left">
      {(filename || language) && (
        <div className="flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-white/10 text-xs text-gray-400">
          <span className="font-mono">{filename || language}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            aria-label={`Copy ${filename || 'code'} to clipboard`}
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}

      {!filename && !language && (
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      )}

      <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto text-gray-200 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
