// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from "next/server";

// import qs from "qs";

// type Data = {
//   name: string;
// };

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const url = `https://base.api.0x.org/swap/v1/quote?${searchParams}`;
    const response = await fetch(url, {
      headers: {
        "0x-api-key": process.env.NEXT_PUBLIC_0X_API_KEY ?? "c9f13c84-9fcb-4f42-aa30-a11b0d016aa5", //"c9f13c84-9fcb-4f42-aa30-a11b0d016aa5"
      },
    });

    console.log(`response`, response);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log(`data`, data); // for debug
    return NextResponse.json(data);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ message: "there was an error" });
  }
}
