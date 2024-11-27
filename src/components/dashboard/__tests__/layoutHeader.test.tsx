import { Card } from "@nextui-org/card";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import createWrapperForHook from "../../../testing/wrappers/createWrapperForHook";
import DashboardLayoutHeader from "../layoutHeader";

describe("layoutHeader", () => {
  it("should display bitso image and connect button as expected", async () => {
    render(
      <Card>
        <DashboardLayoutHeader />
      </Card>,
      { wrapper: createWrapperForHook() }
    );

    const img = await screen.findByRole("img");
    expect(img.getAttribute("src")).toContain("bitso.png");
    expect(img.getAttribute("width")).toBe("120");
    expect(img.getAttribute("height")).toBe("120");

    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("https://bitso.com/");

    const connectBtn = screen.getByRole("button", { name: "Connect Wallet" });
    expect(connectBtn).toBeDefined();
  });
});
