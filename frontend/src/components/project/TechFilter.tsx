'use client';

/**
 * 技术栈筛选组件
 * Editorial Magazine 风格
 */

interface TechFilterProps {
  techs: string[];
  selectedTech?: string;
  onSelect: (tech: string | undefined) => void;
}

export function TechFilter({ techs, selectedTech, onSelect }: TechFilterProps) {
  if (techs.length === 0) return null;

  return (
    <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-dark-700/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-slate-500 dark:text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <span className="text-sm font-semibold text-slate-700 dark:text-dark-200">按技术栈筛选</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {techs.map((tech) => (
          <button
            key={tech}
            onClick={() => onSelect(selectedTech === tech ? undefined : tech)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              selectedTech === tech
                ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/30'
                : 'bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-dark-300 hover:bg-slate-200 dark:hover:bg-dark-600 hover:text-slate-800 dark:hover:text-dark-100'
            }`}
          >
            {tech}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TechFilter;
