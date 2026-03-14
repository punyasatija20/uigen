"use client";

import { Loader2 } from "lucide-react";

interface ToolInvocationBadgeProps {
  toolName: string;
  args: Record<string, unknown>;
  state: string;
  result?: unknown;
}

export function getToolLabel(toolName: string, args: Record<string, unknown>): string {
  const path = typeof args.path === "string" ? args.path : "";
  const filename = path ? path.split("/").pop() || path : "";
  const command = typeof args.command === "string" ? args.command : "";

  if (toolName === "str_replace_editor") {
    const file = filename || "file";
    switch (command) {
      case "view": return `Reading ${file}`;
      case "create": return `Creating ${file}`;
      case "str_replace": return `Editing ${file}`;
      case "insert": return `Editing ${file}`;
      case "undo_edit": return `Undoing edit to ${file}`;
      default: return `Editing ${file}`;
    }
  }

  if (toolName === "file_manager") {
    const file = filename || "file";
    switch (command) {
      case "delete": return `Deleting ${file}`;
      case "rename": {
        const newPath = typeof args.new_path === "string" ? args.new_path : "";
        const newFile = newPath ? newPath.split("/").pop() || newPath : "file";
        return `Renaming ${file} to ${newFile}`;
      }
      default: return `Processing ${file}`;
    }
  }

  return toolName;
}

export function ToolInvocationBadge({ toolName, args, state, result }: ToolInvocationBadgeProps) {
  const label = getToolLabel(toolName, args);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {state === "result" && result ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-neutral-700">{label}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{label}</span>
        </>
      )}
    </div>
  );
}
