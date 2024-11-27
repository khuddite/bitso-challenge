import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import mockRouter from "next-router-mock";
import { afterAll, beforeAll, describe, expect, it, Mock, vi } from "vitest";
import createWrapperForProviders from "../../../testing/wrappers/createWrapperForProviders";
import Layout from "../layout";

describe("layout", () => {
  beforeAll(() => {
    vi.mock("next-auth/react");
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  it("display header, footer and content as expected", async () => {
    const mockSession = {
      status: "authenticated",
    };
    (useSession as Mock).mockReturnValue(mockSession);

    render(
      <Layout>
        <p>unit testing is fun</p>
      </Layout>,
      {
        wrapper: createWrapperForProviders(),
      }
    );

    await screen.findByText("unit testing is fun");
  });

  it("redirects to login page when unauthenticated", async () => {
    const mockSession = {
      status: "unauthenticated",
    };
    (useSession as Mock).mockReturnValue(mockSession);
    render(
      <Layout>
        <p>unit testing is fun</p>
      </Layout>,
      {
        wrapper: createWrapperForProviders(),
      }
    );
    await screen.findByText("unit testing is fun");
    expect(mockRouter).toMatchObject({
      asPath: "/login",
    });
  });
});
