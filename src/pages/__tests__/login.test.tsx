import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, Mock, vi } from "vitest";

import { useSession } from "next-auth/react";

import createWrapperForHook from "../../testing/wrappers/createWrapperForHook";
import Login from "../login";

import mockRouter from "next-router-mock";

describe("login page", () => {
  beforeAll(() => {
    vi.mock("next-auth/react");
  });
  it("displays welcome texts and connect button as expected", async () => {
    const mockSession = {
      status: "unauthenticated",
    };

    (useSession as Mock).mockReturnValue(mockSession);

    render(<Login />, {
      wrapper: createWrapperForHook(),
    });

    expect(screen.getByText("Welcome to Bitso Token Manager!")).toBeDefined();
    expect(
      screen.getByText("Get started by connecting your wallet")
    ).toBeDefined();

    const img = screen.getByRole("img");
    expect(img.getAttribute("src")).toContain("bitso.png");

    expect(img.getAttribute("width")).toBe("240");
    expect(img.getAttribute("height")).toBe("240");

    const connectBtn = screen.getByRole("button", { name: "Connect Wallet" });
    expect(connectBtn).toBeDefined();
  });

  it("redirects to dashboard screen when authenticated", async () => {
    const mockSession = {
      status: "authenticated",
    };

    (useSession as Mock).mockReturnValue(mockSession);

    render(<Login />, {
      wrapper: createWrapperForHook(),
    });

    expect(mockRouter).toMatchObject({
      asPath: "/dashboard",
    });
  });
});
