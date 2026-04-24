import "@testing-library/jest-dom";
import { vi } from "vitest";

// WindowのscrollToメソッドがJSDOMに未実装なため、モック化してエラーを防ぐ
window.scrollTo = vi.fn();
