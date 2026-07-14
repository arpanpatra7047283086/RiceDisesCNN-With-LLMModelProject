import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import React from 'react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * A robust formatter to handle Markdown-like syntax from AI responses.
 * Converts strings with **bold** or *italic* into React elements.
 */
export function formatMarkdown(text: string) {
  if (!text) return null;

  // Split by newlines to handle block-level elements
  const lines = text.split(/\r?\n/);

  return lines.map((line, lineIndex) => {
    const trimmedLine = line.trim();

    // 1. Process Headers (e.g., ### Title)
    if (trimmedLine.startsWith('### ')) {
      return React.createElement('h3', { key: lineIndex, className: 'text-base font-bold mt-4 mb-1 text-foreground border-b border-border/50 pb-1' }, formatInline(trimmedLine.slice(4)));
    }
    if (trimmedLine.startsWith('## ')) {
      return React.createElement('h2', { key: lineIndex, className: 'text-lg font-bold mt-5 mb-2 text-foreground' }, formatInline(trimmedLine.slice(3)));
    }
    if (trimmedLine.startsWith('# ')) {
      return React.createElement('h1', { key: lineIndex, className: 'text-xl font-bold mt-6 mb-3 text-foreground' }, formatInline(trimmedLine.slice(2)));
    }

    // 2. Process Lists (e.g., * Item or 1. Item)
    const isBullet = trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ');
    const isNumeric = /^\d+\.\s/.test(trimmedLine);

    if (isBullet || isNumeric) {
      const match = trimmedLine.match(/^(\d+\.\s|[*|-]\s)/);
      const bullet = match ? match[0] : '• ';
      const content = trimmedLine.slice(bullet.length);

      return React.createElement('div', { key: lineIndex, className: 'flex gap-2 ml-4 my-1.5' },
        React.createElement('span', { className: 'text-primary font-bold shrink-0' }, bullet.trim()),
        React.createElement('span', { className: 'flex-1 leading-relaxed' }, formatInline(content))
      );
    }

    // 3. Default Paragraph (handling empty lines as spacing)
    return React.createElement('div', {
      key: lineIndex,
      className: trimmedLine === '' ? 'h-3' : 'mb-2 leading-relaxed'
    }, formatInline(line));
  });
}

/**
 * Specifically handles inline styles like **bold** and *italic*
 */
export function formatInline(text: string) {
  if (!text) return '';

  // Use non-greedy match for bold and italic to correctly identify blocks
  // Regex: (\*\*.*?\*\*) captures bold including delimiters, (\*.*?\*) captures italic
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

  return parts.map((part, index) => {
    // If it's a bold block: starts with ** and ends with **
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      const content = part.slice(2, -2);
      return React.createElement('strong', {
        key: index,
        className: 'font-bold text-foreground'
      }, content);
    }
    // If it's an italic block: starts with * and ends with *
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      const content = part.slice(1, -1);
      return React.createElement('em', {
        key: index,
        className: 'italic text-muted-foreground'
      }, content);
    }
    // Plain text
    return part;
  });
}
