import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { formatUnits } from "viem";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import createWrapperForProviders from "../../../testing/wrappers/createWrapperForProviders";
import SendTransactionForm from "../forms/sendTransactionForm";

describe("sendTransactionForm", () => {
  const { mockReadContracts, mockAccount } = vi.hoisted(() => {
    return { mockReadContracts: vi.fn(), mockAccount: vi.fn() };
  });

  beforeAll(() => {
    vi.mock("wagmi", async () => {
      const actual = await vi.importActual("wagmi");
      return {
        ...actual,
        useAccount: mockAccount,
        useReadContracts: mockReadContracts,
      };
    });
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  it("should display information about token correctly", async () => {
    const mockedOnSubmit = vi.fn();
    const [
      mockedAddress,
      mockedDecimals,
      mockedSymbol,
      mockedTotalSupply,
      mockedCurrentBalance,
    ] = [
      "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      8,
      "KT",
      BigInt(1e14),
      BigInt(1e10),
    ];

    mockAccount.mockReturnValue({ address: mockedAddress });
    mockReadContracts.mockReturnValue({
      data: [
        { result: mockedDecimals },
        { result: mockedSymbol },
        { result: mockedTotalSupply },
        { result: mockedCurrentBalance },
      ],
    });

    render(<SendTransactionForm onSubmit={mockedOnSubmit} />, {
      wrapper: createWrapperForProviders(),
    });

    await waitFor(() =>
      expect(screen.getByLabelText("Total Supply")).toHaveValue(
        `${formatUnits(mockedTotalSupply, mockedDecimals)} ${mockedSymbol}`
      )
    );

    expect(screen.getByLabelText("Current Balance")).toHaveValue(
      `${formatUnits(mockedCurrentBalance, mockedDecimals)} ${mockedSymbol}`
    );

    expect(screen.getByLabelText("From")).toHaveValue(mockedAddress);

    expect(screen.getByText(/You're sending/)).toBeVisible();
  });

  it("send button works as expected with validation", async () => {
    const mockedOnSubmit = vi.fn();

    render(<SendTransactionForm onSubmit={mockedOnSubmit} />, {
      wrapper: createWrapperForProviders(),
    });

    const sendBtn = screen.getByRole("button", { name: "Send" });

    await waitFor(() => expect(sendBtn).toBeVisible());

    fireEvent.click(sendBtn);

    await screen.findByText("Recipient address is required.");
    await screen.findByText("Amount is required.");

    expect(mockedOnSubmit).not.toHaveBeenCalled();

    fireEvent.input(screen.getByLabelText("To"), {
      target: { value: "0x6b175474e89094c44da98b954eedeac495271d0f" },
    });

    fireEvent.input(screen.getByLabelText("Amount"), {
      target: { value: "1.0" },
    });

    fireEvent.click(sendBtn);

    await waitFor(() => expect(mockedOnSubmit).toHaveBeenCalled());
  });
});
