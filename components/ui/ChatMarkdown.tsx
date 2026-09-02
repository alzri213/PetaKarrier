import React from "react";

interface ChatMarkdownProps {
  content: string;
}

interface NumberedItem {
  num: string;
  text: string;
}

export default function ChatMarkdown({ content }: ChatMarkdownProps) {
  // Normalize inline numbered lists like "1. **Foo**: ... 2. **Bar**:" to separate lines
  let normalized = content.replace(/(\d+[\.\)]\s+\*\*)/g, "\n$1");
  // Normalize bullet points like "- **Foo**"
  normalized = normalized.replace(/([^\n])(-\s+\*\*)/g, "$1\n$2");

  const lines = normalized.split("\n");
  const elements: React.ReactNode[] = [];
  
  let currentNumberedList: NumberedItem[] = [];
  let currentBulletList: string[] = [];

  const flushNumberedList = () => {
    if (currentNumberedList.length === 0) return;
    const items = [...currentNumberedList];
    elements.push(
      <div key={`numbered-${elements.length}`} className="my-2.5 space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2.5 pl-0.5">
            <span className="shrink-0 font-extrabold text-[#00df82] select-none text-[13px] min-w-[18px] text-right">
              {item.num}.
            </span>
            <div className="flex-1 leading-relaxed text-slate-100">
              {renderFormattedText(item.text)}
            </div>
          </div>
        ))}
      </div>
    );
    currentNumberedList = [];
  };

  const flushBulletList = () => {
    if (currentBulletList.length === 0) return;
    const items = [...currentBulletList];
    elements.push(
      <div key={`bullet-${elements.length}`} className="my-2.5 space-y-1.5">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2.5 pl-1">
            <span className="shrink-0 text-[#00df82] mt-1 text-[11px] select-none font-bold">
              •
            </span>
            <div className="flex-1 leading-relaxed text-slate-100">
              {renderFormattedText(item)}
            </div>
          </div>
        ))}
      </div>
    );
    currentBulletList = [];
  };

  const flushAllLists = () => {
    flushNumberedList();
    flushBulletList();
  };

  let inCodeBlock = false;
  let codeBlockLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Code block toggle (```)
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        flushAllLists();
        elements.push(
          <pre key={`code-${i}`} className="my-2.5 overflow-x-auto rounded-xl border border-white/15 bg-slate-950/90 p-3 font-mono text-[12px] text-emerald-300">
            <code>{codeBlockLines.join("\n")}</code>
          </pre>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        flushAllLists();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(rawLine);
      continue;
    }

    if (!trimmed) {
      // Don't flush numbered list immediately on single blank lines between list items
      continue;
    }

    // Heading (### Heading or ## Heading)
    if (trimmed.startsWith("### ")) {
      flushAllLists();
      elements.push(
        <h4 key={`h4-${i}`} className="mt-3.5 mb-1.5 text-sm font-extrabold text-white">
          {renderFormattedText(trimmed.slice(4))}
        </h4>
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushAllLists();
      elements.push(
        <h3 key={`h3-${i}`} className="mt-4 mb-2 text-base font-extrabold text-white">
          {renderFormattedText(trimmed.slice(3))}
        </h3>
      );
      continue;
    }

    // Numbered list item: "1. text" or "1) text"
    const olMatch = trimmed.match(/^(\d+)[\.\)]\s+(.*)/);
    if (olMatch) {
      flushBulletList();
      currentNumberedList.push({
        num: olMatch[1],
        text: olMatch[2],
      });
      continue;
    }

    // Bullet list item: "- text" or "* text"
    const ulMatch = trimmed.match(/^[\-\*]\s+(.*)/);
    if (ulMatch) {
      flushNumberedList();
      currentBulletList.push(ulMatch[1]);
      continue;
    }

    // Regular paragraph
    flushAllLists();
    elements.push(
      <p key={`p-${i}`} className="my-1.5 leading-relaxed first:mt-0 last:mb-0">
        {renderFormattedText(trimmed)}
      </p>
    );
  }

  flushAllLists();

  return <div className="space-y-1 text-[13px] leading-relaxed select-text">{elements}</div>;
}

function renderFormattedText(text: string): React.ReactNode[] {
  // Regex to split by inline markdown: **bold**, *italic*, `code`, [link](url)
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold: **text**
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={index} className="font-extrabold text-white tracking-tight">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <em key={index} className="italic text-slate-200">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Inline code: `text`
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={index}
          className="rounded-md border border-white/15 bg-white/10 px-1.5 py-0.5 font-mono text-[11.5px] text-emerald-300"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Link: [title](href)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-[#00df82] underline decoration-emerald-400/60 transition hover:text-emerald-300 cursor-pointer"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}
