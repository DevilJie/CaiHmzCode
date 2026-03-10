'use client';

import { useState } from 'react';
import { BlogCategory } from '@/types';
import { CategoryTreeNode } from '@/services/admin/blog';
import clsx from 'clsx';

interface CategoryFilterProps {
  categories: BlogCategory[] | CategoryTreeNode[];
  selectedId?: number;
  onSelect: (categoryId?: number) => void;
  loading?: boolean;
}

function CategorySkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-11 bg-slate-100 dark:bg-dark-700 rounded-xl animate-pulse"
        />
      ))}
    </div>
  );
}

/**
 * 分类筛选组件
 * 玻璃态卡片设计 - 支持多级分类树
 */
export default function CategoryFilter({
  categories,
  selectedId,
  onSelect,
  loading = false,
}: CategoryFilterProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  // 判断是否是树形结构
  const isTreeStructure = (items: BlogCategory[] | CategoryTreeNode[]): items is CategoryTreeNode[] => {
    return items.length > 0 && 'children' in items[0];
  };

  // 切换展开状态
  const toggleExpand = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // 递归渲染树节点
  const renderTreeNode = (node: CategoryTreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedId === node.id;
    const paddingLeft = level * 16;

    return (
      <div key={node.id}>
        <button
          onClick={() => onSelect(node.id)}
          className={clsx(
            'w-full px-4 py-2.5 text-left rounded-xl transition-all duration-300 flex items-center justify-between group',
            isSelected
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-primary-900/30'
              : 'text-slate-600 dark:text-dark-300 hover:bg-slate-50 dark:hover:bg-dark-700 hover:text-slate-800 dark:hover:text-dark-100'
          )}
          style={{ paddingLeft: paddingLeft + 16 }}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* 展开/折叠按钮 */}
            {hasChildren && (
              <button
                onClick={(e) => toggleExpand(node.id, e)}
                className={clsx(
                  'flex-shrink-0 w-5 h-5 flex items-center justify-center rounded transition-transform duration-200',
                  isSelected
                    ? 'text-white/70 hover:text-white'
                    : 'text-slate-400 dark:text-dark-500 hover:text-slate-600 dark:hover:text-dark-300',
                  isExpanded && 'rotate-90'
                )}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            {/* 没有子节点时显示占位符 */}
            {!hasChildren && level > 0 && <div className="w-5" />}

            <span className="font-medium truncate">{node.name}</span>
            {node.blogCount !== undefined && node.blogCount > 0 && (
              <span className={clsx(
                'text-xs px-1.5 py-0.5 rounded-full flex-shrink-0',
                isSelected
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-dark-700 text-slate-400 dark:text-dark-400'
              )}>
                {node.blogCount}
              </span>
            )}
          </div>

          {/* 箭头指示 */}
          <svg
            className={clsx(
              'w-4 h-4 transition-transform duration-300 flex-shrink-0',
              isSelected ? 'translate-x-0' : 'group-hover:translate-x-1'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* 子节点 */}
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {node.children.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // 渲染扁平列表
  const renderFlatList = (items: BlogCategory[]) => (
    items.map((category, index) => (
      <button
        key={category.id}
        onClick={() => onSelect(category.id)}
        className={clsx(
          'w-full px-4 py-2.5 text-left rounded-xl transition-all duration-300 flex items-center justify-between group',
          selectedId === category.id
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-primary-900/30'
            : 'text-slate-600 dark:text-dark-300 hover:bg-slate-50 dark:hover:bg-dark-700 hover:text-slate-800 dark:hover:text-dark-100'
        )}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <span className="font-medium">{category.name}</span>
        <svg
          className={clsx(
            'w-4 h-4 transition-transform duration-300',
            selectedId === category.id ? 'translate-x-0' : 'group-hover:translate-x-1'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    ))
  );

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-dark-700/50 p-5 shadow-lg shadow-slate-200/50 dark:shadow-dark-900/20">
        <h3 className="text-sm font-bold text-slate-800 dark:text-dark-100 mb-4 flex items-center gap-2 uppercase tracking-wider">
          <svg className="w-4 h-4 text-slate-500 dark:text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          分类导航
        </h3>
        <CategorySkeleton />
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-dark-700/50 p-5 shadow-lg shadow-slate-200/50 dark:shadow-dark-900/20">
      <h3 className="text-sm font-bold text-slate-800 dark:text-dark-100 mb-4 flex items-center gap-2 uppercase tracking-wider">
        <svg className="w-4 h-4 text-slate-500 dark:text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        分类导航
      </h3>

      <nav className="space-y-1">
        {/* 全部分类选项 */}
        <button
          onClick={() => onSelect(undefined)}
          className={clsx(
            'w-full px-4 py-2.5 text-left rounded-xl transition-all duration-300 flex items-center justify-between group',
            selectedId === undefined
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-primary-900/30'
              : 'text-slate-600 dark:text-dark-300 hover:bg-slate-50 dark:hover:bg-dark-700 hover:text-slate-800 dark:hover:text-dark-100'
          )}
        >
          <span className="font-medium">全部文章</span>
          <svg
            className={clsx(
              'w-4 h-4 transition-transform duration-300',
              selectedId === undefined ? 'translate-x-0' : 'group-hover:translate-x-1'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* 分类列表 */}
        {isTreeStructure(categories)
          ? categories.map((node) => renderTreeNode(node))
          : renderFlatList(categories as BlogCategory[])}
      </nav>

      {/* 空状态 */}
      {categories.length === 0 && (
        <div className="py-8 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 dark:bg-dark-700 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-slate-400 dark:text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-slate-400 dark:text-dark-500 text-sm">暂无分类</p>
        </div>
      )}
    </div>
  );
}
