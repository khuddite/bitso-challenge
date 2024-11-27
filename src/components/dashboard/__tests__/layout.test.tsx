import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import mockRouter from "next-router-mock";
import { beforeAll, describe, expect, it, Mock, vi } from "vitest";
import createWrapperForHook from "../../../testing/wrappers/createWrapperForHook";
import Layout from "../layout";

describe("layout", () => {
  beforeAll(() => {
    vi.mock("next-auth/react");
  });

  it("display header, footer and content as expected", () => {
    const mockSession = {
      status: "authenticated",
    };
    (useSession as Mock).mockReturnValue(mockSession);

    render(
      <Layout>
        <p>unit testing is fun</p>
      </Layout>,
      {
        wrapper: createWrapperForHook(),
      }
    );

    expect(screen.getByText("unit testing is fun")).toBeDefined();
  });

  it("redirects to login page when unauthenticated", () => {
    const mockSession = {
      status: "unauthenticated",
    };
    (useSession as Mock).mockReturnValue(mockSession);
    render(
      <Layout>
        <p>unit testing is fun</p>
      </Layout>,
      {
        wrapper: createWrapperForHook(),
      }
    );
    expect(mockRouter).toMatchObject({
      asPath: "/login",
    });
  });
});
