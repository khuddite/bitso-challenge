import { renderHook, waitFor } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import createWrapperForProviders from "../../testing/wrappers/createWrapperForProviders";
import useEthPrice from "../useEthPrice";

import { afterEach } from "node:test";
import { server } from "../__mocks__/node";

describe("useEthPrice", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("should work as expected", async () => {
    const { result } = renderHook(() => useEthPrice(), {
      wrapper: createWrapperForProviders(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe(3500);
  });
});
