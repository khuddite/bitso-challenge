import "@testing-library/jest-dom";
import { afterAll, beforeAll, vi } from "vitest";

beforeAll(() => {
  vi.mock("next/router", () => require("next-router-mock"));
});

afterAll(() => {
  vi.resetAllMocks();
});
