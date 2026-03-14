import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { getToolLabel, ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

// getToolLabel unit tests

test("str_replace_editor create → Creating App.jsx", () => {
  expect(getToolLabel("str_replace_editor", { command: "create", path: "/App.jsx" })).toBe("Creating App.jsx");
});

test("str_replace_editor str_replace → Editing utils.ts", () => {
  expect(getToolLabel("str_replace_editor", { command: "str_replace", path: "/utils.ts" })).toBe("Editing utils.ts");
});

test("str_replace_editor insert → Editing App.jsx", () => {
  expect(getToolLabel("str_replace_editor", { command: "insert", path: "/App.jsx" })).toBe("Editing App.jsx");
});

test("str_replace_editor view → Reading App.jsx", () => {
  expect(getToolLabel("str_replace_editor", { command: "view", path: "/App.jsx" })).toBe("Reading App.jsx");
});

test("str_replace_editor undo_edit → Undoing edit to App.jsx", () => {
  expect(getToolLabel("str_replace_editor", { command: "undo_edit", path: "/App.jsx" })).toBe("Undoing edit to App.jsx");
});

test("file_manager delete → Deleting old.jsx", () => {
  expect(getToolLabel("file_manager", { command: "delete", path: "/old.jsx" })).toBe("Deleting old.jsx");
});

test("file_manager rename → Renaming old.jsx to new.jsx", () => {
  expect(getToolLabel("file_manager", { command: "rename", path: "/old.jsx", new_path: "/new.jsx" })).toBe("Renaming old.jsx to new.jsx");
});

test("unknown tool → raw tool name", () => {
  expect(getToolLabel("some_other_tool", { command: "create", path: "/App.jsx" })).toBe("some_other_tool");
});

test("missing path → graceful generic fallback", () => {
  expect(getToolLabel("str_replace_editor", { command: "create" })).toBe("Creating file");
});

test("empty path → graceful generic fallback", () => {
  expect(getToolLabel("str_replace_editor", { command: "create", path: "" })).toBe("Creating file");
});

test("nested path → only filename shown", () => {
  expect(getToolLabel("str_replace_editor", { command: "create", path: "/src/components/Button.tsx" })).toBe("Creating Button.tsx");
});

// Component render tests

test("shows spinner + label when state is call", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
  expect(document.querySelector(".animate-spin")).toBeDefined();
  expect(document.querySelector(".bg-emerald-500")).toBeNull();
});

test("shows green dot + label when state is result and result is truthy", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="result"
      result="Success"
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
  expect(document.querySelector(".bg-emerald-500")).toBeDefined();
  expect(document.querySelector(".animate-spin")).toBeNull();
});

test("no green dot when state is result but result is falsy", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="result"
      result={undefined}
    />
  );
  expect(document.querySelector(".bg-emerald-500")).toBeNull();
  expect(document.querySelector(".animate-spin")).toBeDefined();
});
