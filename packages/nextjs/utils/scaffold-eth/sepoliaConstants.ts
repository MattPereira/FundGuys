import type { Address } from "wagmi";

export const MAX_ALLOWANCE =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n;

export const exchangeProxy = "0xdef1c0ded9bec7f1a1670819833240f027b25eff";

interface Token {
  name: string;
  address: Address;
  symbol: string;
  decimals: number;
  chainId: number;
  logoURI: string;
}

export const SEPOLIA_TOKENS: Token[] = [
  {
    chainId: 11155111,
    name: "wrapped ETH",
    symbol: "wETH",
    decimals: 18,
    address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/weth.svg",
  },
  {
    chainId: 11155111,
    name: "uniswap",
    symbol: "UNI",
    decimals: 18,
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/uni.svg",
  },
  {
    chainId: 11155111,
    name: "chainlink",
    symbol: "LINK",
    decimals: 18,
    address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/link.svg",
  },
];

export const SEPOLIA_TOKENS_BY_SYMBOL: Record<string, Token> = {
  weth: {
    chainId: 11155111,
    name: "wrapped ETH",
    symbol: "wETH",
    decimals: 18,
    address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/weth.svg",
  },
  uni: {
    chainId: 11155111,
    name: "uniswap",
    symbol: "UNI",
    decimals: 18,
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/uni.svg",
  },
  link: {
    chainId: 11155111,
    name: "chainlink",
    symbol: "LINK",
    decimals: 18,
    address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/link.svg",
  },
};

export const SEPOLIA_TOKENS_BY_ADDRESS: Record<string, Token> = {
  "0xfff9976782d46cc05630d1f6ebab18b2324d6b14": {
    chainId: 11155111,
    name: "wrapped ETH",
    symbol: "wETH",
    decimals: 18,
    address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/weth.svg",
  },
  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984": {
    chainId: 11155111,
    name: "uniswap",
    symbol: "UNI",
    decimals: 18,
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/uni.svg",
  },
  "0x779877a7b0d9e8603169ddbd7836e478b4624789": {
    chainId: 11155111,
    name: "chainlink",
    symbol: "LINK",
    decimals: 18,
    address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/link.svg",
  },
};