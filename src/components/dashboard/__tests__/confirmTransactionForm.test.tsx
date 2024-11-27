import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { formatEther, getAddress, parseGwei } from "viem";
import { sepolia } from "viem/chains";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import generateRegexForMultilineText from "../../../testing/utils/generateRegexForMultilineText";
import createWrapperForProviders from "../../../testing/wrappers/createWrapperForProviders";
import formatGasFee from "../../../utils/formatGasFee";
import ConfirmTransactionForm from "../forms/confirmTransactionForm";

describe("confirmTransactionForm", () => {
  const mockedCancelFn = vi.fn();
  const mockedAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
  const mockedValue = "1";

  const mockedTransactionDetails = {
    to: getAddress(mockedAddress),
    value: mockedValue,
  };

  const {
    mockWriteContract,
    mockedGasPrice,
    mockedEthPrice,
    mockedContractGas,
  } = vi.hoisted(() => {
    return {
      mockWriteContract: vi.fn(),
      mockedGasPrice: BigInt(72946473988),
      mockedEthPrice: 3663,
      mockedContractGas: BigInt(35442),
    };
  });

  beforeAll(() => {
    vi.mock("../../../hooks/useEthPrice.ts", () => {
      return {
        default: vi.fn(() => ({
          data: mockedEthPrice,
          isLoading: false,
          error: null,
        })),
      };
    });

    vi.mock("../../../hooks/useContractGas.ts", () => {
      return {
        default: vi.fn(() => ({
          data: mockedContractGas,
          isLoading: false,
          error: null,
        })),
      };
    });

    vi.mock("wagmi", async () => {
      const actual = await vi.importActual("wagmi");
      return {
        ...actual,
        useWriteContract: vi.fn(() => ({
          writeContract: mockWriteContract,
        })),
        useGasPrice: vi.fn(() => ({
          data: mockedGasPrice,
          isLoading: false,
          error: null,
        })),
        useReadContract: vi.fn(() => ({
          data: 8,
          isLoading: false,
          error: null,
        })),
      };
    });
  });

  const renderComponent = () => {
    render(
      <ConfirmTransactionForm
        onCancel={mockedCancelFn}
        transactionDetails={mockedTransactionDetails}
      />,
      {
        wrapper: createWrapperForProviders(),
      }
    );
  };

  afterAll(() => {
    vi.resetAllMocks();
  });

  it("should display information about the transaction as expected", async () => {
    renderComponent();
    await screen.findByText("Are you sure you want to");
    expect(
      screen.getByText(generateRegexForMultilineText(`Send ${mockedValue} KT?`))
    ).toBeVisible();

    const addressLink = screen.getByRole("link", {
      name: generateRegexForMultilineText(mockedAddress),
    });
    expect(addressLink).toBeVisible();
    expect(addressLink.getAttribute("href")).toMatch(
      new RegExp(
        `${sepolia.blockExplorers.default.url}/address/${mockedAddress}`,
        "i"
      )
    );

    expect(screen.getByText("Estimated Network Fee")).toBeVisible();

    expect(screen.getByRole("button", { name: "Cancel" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeVisible();
  });

  it("should calculate gas fee as expected", async () => {
    renderComponent();
    await screen.findByText(
      formatGasFee(
        formatEther(mockedContractGas * (mockedGasPrice + parseGwei("1.5"))),
        mockedEthPrice
      )
    );
  });

  it("should submit the transaction as expected", async () => {
    renderComponent();

    const confirmBtn = await screen.findByRole("button", { name: "Confirm" });
    fireEvent.click(confirmBtn);

    await waitFor(() => expect(mockWriteContract).toHaveBeenCalledOnce());
  });

  it("cancels the transaction as expected", async () => {
    renderComponent();
    const cancelBtn = await screen.findByRole("button", { name: "Cancel" });
    fireEvent.click(cancelBtn);
    await waitFor(() => expect(mockedCancelFn).toHaveBeenCalledOnce());
  });
});
