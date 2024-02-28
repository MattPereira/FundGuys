import type { Address } from "wagmi";

export const MAX_ALLOWANCE = 115792089237316195423570985008687907853269984665640564039457584007913129639935n;

export const exchangeProxy = "0xdef1c0ded9bec7f1a1670819833240f027b25eff";

interface Token {
  name: string;
  address: Address;
  symbol: string;
  decimals: number;
  chainId: number;
  logoURI: string;
}

export const MUMBAI_TOKENS: Token[] = [
  {
    chainId: 80001,
    name: "wrapped ETH",
    symbol: "wETH",
    decimals: 18,
    address: "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa",
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/weth.svg",
  },
  {
    chainId: 80001,
    name: "usdc",
    symbol: "USDC",
    decimals: 18,
    address: "0x2058a9d7613eee744279e3856ef0eada5fcbaa7e",
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
  },
  // {
  //   chainId: 80001,
  //   name: "chainlink",
  //   symbol: "LINK",
  //   decimals: 18,
  //   address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  //   logoURI:
  //     "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/link.svg",
  // },
];

export const MUMBAI_TOKENS_BY_SYMBOL: Record<string, Token> = {
  weth: {
    chainId: 80001,
    name: "wrapped ETH",
    symbol: "wETH",
    decimals: 18,
    address: "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa",
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/weth.svg",
  },
  usdc: {
    chainId: 80001,
    name: "usdc",
    symbol: "USDC",
    decimals: 18,
    address: "0x2058a9d7613eee744279e3856ef0eada5fcbaa7e",
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
  },
  // link: {
  //   chainId: 80001,
  //   name: "chainlink",
  //   symbol: "LINK",
  //   decimals: 18,
  //   address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  //   logoURI:
  //     "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/link.svg",
  // },
};

export const MUMBAI_TOKENS_BY_ADDRESS: Record<string, Token> = {
  "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa": {
    chainId: 80001,
    name: "wrapped ETH",
    symbol: "wETH",
    decimals: 18,
    address: "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa",
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/weth.svg",
  },
  "0x2058a9d7613eee744279e3856ef0eada5fcbaa7e": {
    chainId: 80001,
    name: "usdc",
    symbol: "USDC",
    decimals: 18,
    address: "0x2058a9d7613eee744279e3856ef0eada5fcbaa7e",
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
  },
  // "0x779877a7b0d9e8603169ddbd7836e478b4624789": {
  //   chainId: 80001,
  //   name: "chainlink",
  //   symbol: "LINK",
  //   decimals: 18,
  //   address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  //   logoURI:
  //     "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/link.svg",
  // },
};
