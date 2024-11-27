import { renderHook, waitFor } from "@testing-library/react";
import { getAddress } from "viem";
import { beforeAll, describe, expect, it, vi } from "vitest";
import createWrapperForHook from "../../testing/wrappers/createWrapperForHook";
import useContractGas from "../useContractGas";

describe("useContractGas", () => {
  const { mockEstimatedContractGas } = vi.hoisted(() => {
    return { mockEstimatedContractGas: vi.fn() };
  });

  beforeAll(() => {
    vi.mock("wagmi", async () => {
      const actual = await vi.importActual("wagmi");
      return {
        ...actual,
        useAccount: vi.fn(() => ({
          address: "0x1234567890abcdef1234567890abcdef12345678",
          isConnected: true,
        })),
        usePublicClient: vi.fn(() => ({
          estimateContractGas: mockEstimatedContractGas,
        })),
      };
    });
  });

  it("should work as expected", async () => {
    const mockParams = {
      to: getAddress("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"),
      value: "1",
      decimals: 8,
    };

    const mockedGas = 20;
    mockEstimatedContractGas.mockReturnValue(mockedGas);

    const { result } = renderHook(() => useContractGas({ ...mockParams }), {
      wrapper: createWrapperForHook(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockEstimatedContractGas).toHaveBeenCalledOnce();
    expect(mockEstimatedContractGas).toHaveReturnedWith(mockedGas);
  });
});
