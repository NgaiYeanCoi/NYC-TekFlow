"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BoldIcon,
  Code2Icon,
  EyeIcon,
  Heading2Icon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  PencilIcon,
  QuoteIcon,
  Table2Icon,
  TerminalSquareIcon,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type EditorMode = "edit" | "preview";

type MarkdownRichEditorProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

type ToolbarAction = {
  id: "heading" | "bold" | "italic" | "quote" | "unordered-list" | "ordered-list" | "inline-code" | "code-block" | "link" | "table";
  label: string;
  icon: LucideIcon;
};

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  { id: "heading", label: "标题", icon: Heading2Icon },
  { id: "bold", label: "粗体", icon: BoldIcon },
  { id: "italic", label: "斜体", icon: ItalicIcon },
  { id: "quote", label: "引用", icon: QuoteIcon },
  { id: "unordered-list", label: "无序列表", icon: ListIcon },
  { id: "ordered-list", label: "有序列表", icon: ListOrderedIcon },
  { id: "inline-code", label: "行内代码", icon: Code2Icon },
  { id: "code-block", label: "代码块", icon: TerminalSquareIcon },
  { id: "link", label: "链接", icon: LinkIcon },
  { id: "table", label: "表格", icon: Table2Icon },
];

export function MarkdownRichEditor({ id, label, value, onChange, className }: MarkdownRichEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = React.useState<EditorMode>("edit");

  const focusSelection = React.useCallback((start: number, end = start) => {
    setMode("edit");
    window.setTimeout(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.focus();
      textarea.setSelectionRange(start, end);
    }, 0);
  }, []);

  const getRange = React.useCallback(() => {
    const textarea = textareaRef.current;
    return {
      start: textarea?.selectionStart ?? value.length,
      end: textarea?.selectionEnd ?? value.length,
    };
  }, [value.length]);

  const replaceRange = React.useCallback(
    (nextValue: string, start: number, end = start) => {
      onChange(nextValue);
      focusSelection(start, end);
    },
    [focusSelection, onChange],
  );

  const wrapSelection = React.useCallback(
    (prefix: string, suffix: string, placeholder: string) => {
      const { start, end } = getRange();
      const selected = value.slice(start, end) || placeholder;
      const nextValue = `${value.slice(0, start)}${prefix}${selected}${suffix}${value.slice(end)}`;
      const selectionStart = start + prefix.length;
      replaceRange(nextValue, selectionStart, selectionStart + selected.length);
    },
    [getRange, replaceRange, value],
  );

  const formatSelectedLines = React.useCallback(
    (formatLine: (line: string, index: number) => string, placeholder: string) => {
      const { start: rawStart, end: rawEnd } = getRange();
      const hasSelection = rawEnd > rawStart;
      const lineStart = value.lastIndexOf("\n", Math.max(rawStart - 1, 0)) + 1;
      const nextLineBreak = value.indexOf("\n", rawEnd);
      const lineEnd = nextLineBreak === -1 ? value.length : nextLineBreak;
      const start = hasSelection ? rawStart : lineStart;
      const end = hasSelection ? rawEnd : lineEnd;
      const selected = value.slice(start, end) || placeholder;
      const formatted = selected.split("\n").map(formatLine).join("\n");
      const nextValue = `${value.slice(0, start)}${formatted}${value.slice(end)}`;
      replaceRange(nextValue, start, start + formatted.length);
    },
    [getRange, replaceRange, value],
  );

  const insertLink = React.useCallback(() => {
    const { start, end } = getRange();
    const selected = value.slice(start, end) || "链接文字";
    const url = "https://";
    const insertion = `[${selected}](${url})`;
    const nextValue = `${value.slice(0, start)}${insertion}${value.slice(end)}`;
    const urlStart = start + selected.length + 3;
    replaceRange(nextValue, urlStart, urlStart + url.length);
  }, [getRange, replaceRange, value]);

  const insertCodeBlock = React.useCallback(() => {
    const { start, end } = getRange();
    const selected = value.slice(start, end) || "code";
    const needsLeadingBreak = start > 0 && value[start - 1] !== "\n";
    const needsTrailingBreak = end < value.length && value[end] !== "\n";
    const prefix = `${needsLeadingBreak ? "\n" : ""}\`\`\`\n`;
    const suffix = `\n\`\`\`${needsTrailingBreak ? "\n" : ""}`;
    const nextValue = `${value.slice(0, start)}${prefix}${selected}${suffix}${value.slice(end)}`;
    const selectionStart = start + prefix.length;
    replaceRange(nextValue, selectionStart, selectionStart + selected.length);
  }, [getRange, replaceRange, value]);

  const insertTable = React.useCallback(() => {
    const { start, end } = getRange();
    const needsLeadingBreak = start > 0 && value[start - 1] !== "\n";
    const table = `${needsLeadingBreak ? "\n" : ""}| 列一 | 列二 |\n| --- | --- |\n| 内容 | 内容 |\n`;
    const nextValue = `${value.slice(0, start)}${table}${value.slice(end)}`;
    replaceRange(nextValue, start, start + table.length);
  }, [getRange, replaceRange, value]);

  const runAction = React.useCallback(
    (actionId: ToolbarAction["id"]) => {
      switch (actionId) {
        case "heading":
          formatSelectedLines((line) => `## ${line.replace(/^#{1,6}\s+/, "") || "标题"}`, "标题");
          break;
        case "bold":
          wrapSelection("**", "**", "粗体文字");
          break;
        case "italic":
          wrapSelection("*", "*", "斜体文字");
          break;
        case "quote":
          formatSelectedLines((line) => `> ${line.replace(/^>\s?/, "") || "引用内容"}`, "引用内容");
          break;
        case "unordered-list":
          formatSelectedLines((line) => `- ${line.replace(/^[-*+]\s+/, "") || "列表项"}`, "列表项");
          break;
        case "ordered-list":
          formatSelectedLines((line, index) => `${index + 1}. ${line.replace(/^\d+\.\s+/, "") || "列表项"}`, "列表项");
          break;
        case "inline-code":
          wrapSelection("`", "`", "code");
          break;
        case "code-block":
          insertCodeBlock();
          break;
        case "link":
          insertLink();
          break;
        case "table":
          insertTable();
          break;
      }
    },
    [formatSelectedLines, insertCodeBlock, insertLink, insertTable, wrapSelection],
  );

  return (
    <Field className={className}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <div className="inline-flex w-fit rounded-md border border-border bg-muted p-1" role="tablist" aria-label="正文视图">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "edit"}
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-sm px-3 text-sm font-medium text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20",
              mode === "edit" ? "bg-card text-foreground shadow-[0_1px_1px_rgba(15,23,42,0.06)]" : "hover:bg-card/70 hover:text-foreground",
            )}
            onClick={() => setMode("edit")}
          >
            <PencilIcon data-icon="inline-start" />
            编辑
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "preview"}
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-sm px-3 text-sm font-medium text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20",
              mode === "preview" ? "bg-card text-foreground shadow-[0_1px_1px_rgba(15,23,42,0.06)]" : "hover:bg-card/70 hover:text-foreground",
            )}
            onClick={() => setMode("preview")}
          >
            <EyeIcon data-icon="inline-start" />
            预览
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-input bg-card transition-colors focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20">
        <div className="flex flex-wrap gap-1.5 border-b border-border bg-muted/40 p-2" role="toolbar" aria-label="Markdown 格式工具">
          {TOOLBAR_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Button key={action.id} type="button" variant="ghost" size="icon" className="shrink-0" aria-label={action.label} title={action.label} onClick={() => runAction(action.id)}>
                <Icon data-icon="toolbar" />
              </Button>
            );
          })}
        </div>

        {mode === "edit" ? (
          <Textarea
            ref={textareaRef}
            id={id}
            className="min-h-[360px] resize-y rounded-none border-0 bg-card px-4 py-3 font-mono focus-visible:border-transparent focus-visible:ring-0"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : (
          <div className="markdown min-h-[360px] max-w-none overflow-auto bg-card px-4 py-3">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value.trim() ? value : "暂无正文"}</ReactMarkdown>
          </div>
        )}
      </div>
    </Field>
  );
}
