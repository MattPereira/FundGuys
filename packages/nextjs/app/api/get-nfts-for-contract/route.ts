import { type NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const collectionAddress = searchParams.get("address");

    // console.log("collectionAddress", collectionAddress);

    const alchemyNftBaseUrl = "https://polygon-mumbai.g.alchemy.com/nft/v3/";
    const alchemyNftEndpoint = "/getNFTsForContract";

    const URL = alchemyNftBaseUrl + process.env.ALCHEMY_API_KEY + alchemyNftEndpoint;

    // console.log("URL", URL);

    const response = await axios.get(URL, {
      params: {
        contractAddress: collectionAddress,
        withMetadata: true,
      },
    });

    // console.log("response", response.data);

    const data = await response.data;
    const nfts = data.nfts;
    return NextResponse.json({ nfts }, { status: 200 });
  } catch (error) {
    // Log the error for server-side debugging
    console.error("Failed to fetch NFT data:", error);

    // Send a generic error response to the client
    return NextResponse.json({ error: "Failed to fetch NFT data" }, { status: 500 });
  }
}
