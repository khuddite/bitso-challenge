import { fireEvent, render, screen } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, Mock, vi } from "vitest";

import { useSession } from "next-auth/react";

import createWrapperForHook from "../../testing/wrappers/createWrapperForHook";
import Login from "../login";

import mockRouter from "next-router-mock";

describe("login page", () => {
  beforeAll(() => {
    vi.mock("next-auth/react");
  });

  afterAll(() => {
    vi.resetAllMocks();
  });
  it("displays welcome texts and connect button as expected", async () => {
    const mockSession = {
      status: "unauthenticated",
    };

    (useSession as Mock).mockReturnValue(mockSession);

    render(<Login />, {
      wrapper: createWrapperForHook(),
    });

    await screen.findByText("Welcome to Bitso Token Manager!");
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

    await screen.findByText("Welcome to Bitso Token Manager!");
    expect(mockRouter).toMatchObject({
      asPath: "/dashboard",
    });
  });

  it("connect wallet button displays a wallet connector modal", async () => {
    const mockSession = {
      status: "unauthenticated",
    };

    (useSession as Mock).mockReturnValue(mockSession);

    render(<Login />, {
      wrapper: createWrapperForHook(),
    });
    const connectBtn = await screen.findByRole("button", {
      name: "Connect Wallet",
    });

    // click connect wallet button
    fireEvent.click(connectBtn);
    expect(
      screen.getByRole("heading", { name: "Connect a Wallet" })
    ).toBeDefined();

    expect(screen.getByText("What is a Wallet?")).toBeDefined();

    const closeBtn = screen.getByRole("button", { name: "Close" });

    // close out the wallet connector modal
    fireEvent.click(closeBtn);
    expect(
      screen.queryByRole("heading", { name: "Connect a Wallet" })
    ).toBeNull();

    expect(screen.queryByRole("What is a Wallet?")).toBeNull();
  });
});
