import React from 'react';

export default function SecurityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-left">
      <div className="border-b border-white/10 pb-6 mb-12">
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Trust & Verification</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-1 mb-4">
          Security Policy
        </h1>
        <p className="text-base text-gray-400">
          Our commitment to code integrity, vulnerability reporting, and safe DOM sanitization.
        </p>
      </div>

      <div className="space-y-8 text-sm sm:text-base text-gray-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Supported Versions</h2>
          <p>
            We actively support the latest minor release of toastory with security patches and vulnerability remediation.
          </p>
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0e1017]">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-white/10 bg-white/[0.02]">
                <tr>
                  <th className="py-2.5 px-4 font-semibold text-gray-300">Version</th>
                  <th className="py-2.5 px-4 font-semibold text-gray-300">Supported</th>
                  <th className="py-2.5 px-4 font-semibold text-gray-300">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-xs">
                <tr>
                  <td className="py-2.5 px-4 text-blue-400">v0.1.x</td>
                  <td className="py-2.5 px-4 text-emerald-400">Yes</td>
                  <td className="py-2.5 px-4 text-gray-400 font-sans">Active production release</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">HTML Sanitization Standards</h2>
          <p>
            toastory provides built-in, zero-dependency HTML sanitization for the <code className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-xs">html</code> option. By default, dangerous tags like <code className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-xs">&lt;script&gt;</code>, <code className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-xs">&lt;iframe&gt;</code>, <code className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-xs">&lt;style&gt;</code>, and unsafe URI protocols (such as <code className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-xs">javascript:</code>) are stripped from the DOM before mounting.
          </p>
          <p>
            For applications with strict enterprise security mandates, you can plug in DOMPurify with one line:
          </p>
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-blue-400">
            import &#123; setSanitizer &#125; from &apos;toastory&apos;;<br />
            import DOMPurify from &apos;dompurify&apos;;<br /><br />
            setSanitizer((dirty) =&gt; DOMPurify.sanitize(dirty));
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Reporting a Vulnerability</h2>
          <p>
            If you discover a security vulnerability in toastory, please report it privately via GitHub Security Advisories or by emailing our security team directly at <code className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-xs">security@toastory.dev</code>.
          </p>
          <p>
            Please include steps to reproduce the issue and allow 48 hours for our maintainers to review and acknowledge the report before public disclosure.
          </p>
        </section>
      </div>
    </div>
  );
}
