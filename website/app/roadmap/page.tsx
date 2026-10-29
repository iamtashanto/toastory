import React from 'react';

export default function RoadmapPage() {
  const roadmapItems = [
    {
      quarter: 'v0.1.0 — Current Release',
      status: 'Completed',
      items: [
        'Zero-dependency core engine with pausable timers',
        '21 theme presets with contrast-checked tokens',
        'Complete dialog toolkit (confirm, prompt with 16 input types, steps)',
        'Swipe gesture velocity snapping in 4 directions',
        'Full React, Vue, Svelte, Angular, and React Native adapters',
      ],
    },
    {
      quarter: 'v0.2.0 — Next Milestone',
      status: 'In Progress',
      items: [
        'Web Components / Custom Elements standalone custom tag bundle',
        'Built-in audio cues using Web Audio API synthesis (zero MP3 assets)',
        'React Native VisionOS spatial glass elevation presets',
        'Interactive Figma tokens bridge export plugin',
      ],
    },
    {
      quarter: 'v1.0.0 — Stable LTS',
      status: 'Planned',
      items: [
        'Long-term API stability guarantee and semver lock',
        'Automated Visual Regression CI bot with Playwright screenshots',
        'Pre-compiled WASM blur filter fallback for canvas environments',
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-left">
      <div className="border-b border-white/10 pb-6 mb-12">
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Future Vision</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-1 mb-4">
          Public Roadmap
        </h1>
        <p className="text-base text-gray-400">
          Our planned milestones and open-source feature commitments for upcoming glazekit releases.
        </p>
      </div>

      <div className="space-y-10">
        {roadmapItems.map((milestone) => (
          <div key={milestone.quarter} className="p-6 rounded-2xl border border-white/10 bg-[#10121b] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{milestone.quarter}</h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  milestone.status === 'Completed'
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                    : milestone.status === 'In Progress'
                    ? 'bg-blue-500/15 border border-blue-500/30 text-blue-400'
                    : 'bg-white/10 text-gray-400'
                }`}
              >
                {milestone.status}
              </span>
            </div>

            <ul className="space-y-2 text-sm text-gray-300">
              {milestone.items.map((it, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-blue-400">▸</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
