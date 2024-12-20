import { Card } from "@nextui-org/card";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import createWrapperForProviders from "../../../testing/wrappers/createWrapperForProviders";
import DashboardLayoutFooter from "../layoutFooter";
describe("layoutFooter", () => {
  it("should display name with link as expected", async () => {
    render(
      <Card>
        <DashboardLayoutFooter />
      </Card>,
      { wrapper: createWrapperForProviders() }
    );

    await screen.findByText(/Made with/);

    expect(screen.getByRole("link", { name: "Jason Stroud" })).toBeDefined();

    const link = screen.getByRole("link");

    expect(link.getAttribute("href")).toBe("https://github.com/khuddite");
  });
});
