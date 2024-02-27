// import type { Address } from "wagmi";

// export const MAX_ALLOWANCE =
//   115792089237316195423570985008687907853269984665640564039457584007913129639935n;

// export const exchangeProxy = "0xdef1c0ded9bec7f1a1670819833240f027b25eff";

// interface Token {
//   name: string;
//   address: Address;
//   symbol: string;
//   decimals: number;
//   chainId: number;
//   logoURI: string;
// }

// export const BASE_TOKENS: Token[] = [
//   {
//     chainId: 8453,
//     name: "Dai - PoS",
//     symbol: "DAI",
//     decimals: 18,
//     address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
//     logoURI:
//       "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/dai.svg",
//   },
//   {
//     chainId: 8453,
//     name: "USD Coin",
//     symbol: "USDC",
//     decimals: 6,
//     address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
//     logoURI:
//       "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
//   },
// ];

// export const BASE_TOKENS_BY_SYMBOL: Record<string, Token> = {
//   dai: {
//     chainId: 8453,
//     name: "Dai - PoS",
//     symbol: "DAI",
//     decimals: 18,
//     address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
//     logoURI:
//       "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/dai.svg",
//   },
//   usdc: {
//     chainId: 8453,
//     name: "USD Coin",
//     symbol: "USDC",
//     decimals: 6,
//     address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
//     logoURI:
//       "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
//   },
// };

// export const BASE_TOKENS_BY_ADDRESS: Record<string, Token> = {
//   "0x50c5725949a6f0c72e6c4a641f24049a917db0cb": {
//     chainId: 8453,
//     name: "DAI - PoS",
//     symbol: "DAI",
//     decimals: 18,
//     address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
//     logoURI:
//       "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/dai.svg",
//   },
//   "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913": {
//     chainId: 8453,
//     name: "USD Coin",
//     symbol: "USDC",
//     decimals: 6,
//     address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
//     logoURI:
//       "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
//   },
// };