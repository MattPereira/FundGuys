import { type NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ownerAddress = searchParams.get("owner");
    // .getAll method grabs all query params with key of "collection" !!! :)
    const collectionAddress = searchParams.getAll("collection");

    const alchemyBaseUrl = "https://eth-sepolia.g.alchemy.com/nft/v3/";

    const response = await axios.get(`${alchemyBaseUrl}${process.env.ALCHEMY_API_KEY}/getNFTsForOwner`, {
      params: {
        owner: ownerAddress,
        "contractAddresses[]": collectionAddress,
        withMetadata: true,
        pageSize: 100,
      },
    });

    const data = await response.data;
    const nfts = data.ownedNfts;
    return NextResponse.json({ nfts }, { status: 200 });
  } catch (error) {
    // Log the error for server-side debugging
    console.error("Failed to fetch NFT data:", error);

    // Send a generic error response to the client
    return NextResponse.json({ error: "Failed to fetch NFT data" }, { status: 500 });
  }
}
