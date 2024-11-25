import { ethers } from "ethers";

async function getTokenBalance() {
  try {
    // Step 1: Initialize provider
    const provider = new ethers.InfuraProvider("");

    // Step 2: Token Contract Address (replace with your token's address on Sepolia)
    const tokenAddress = "0xYourTokenAddress";

    // Step 3: ERC-20 ABI (minimum required for balanceOf and decimals)
    const erc20Abi = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)",
    ];

    // Step 4: Wallet Address to Check
    const walletAddress = "0xYourWalletAddress";

    // Step 5: Create Contract Instance
    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);

    // Fetch balance and decimals
    const rawBalance = await tokenContract.balanceOf(walletAddress);
    const decimals = await tokenContract.decimals();

    // Format balance to human-readable value
    const formattedBalance = ethers.formatUnits(rawBalance, decimals);

    return formattedBalance;
  } catch (error) {
    console.error("Error fetching token balance:", error);
  }
}

getTokenBalance();
