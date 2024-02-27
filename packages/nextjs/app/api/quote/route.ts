// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from "next/server";

type Data = {
  name: string;
};

export async function GET(request: NextRequest){
    try {

        const searchParams = request.nextUrl.searchParams
        // console.log('searchParams', searchParams)


        const sellAmount = searchParams.get('sellAmount')
        // console.log('sellAmount', sellAmount)

        const NEXT_PUBLIC_0X_API_KEY = process.env.NEXT_PUBLIC_0X_API_KEY;

        const requestUrl = `https://sepolia.api.0x.org/swap/v1/price?${searchParams}`
        // console.log('requestUrl', requestUrl)

        const response = await fetch(
            requestUrl,
            {
                headers: {
                    "0x-api-key": NEXT_PUBLIC_0X_API_KEY ?? "c9f13c84-9fcb-4f42-aa30-a11b0d016aa5", //"c9f13c84-9fcb-4f42-aa30-a11b0d016aa5"
                },
            }
        );

        if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

        const data = await response.json();
        return NextResponse.json(data);

        } catch (error) {
            console.log('error', error)
           return NextResponse.json({ message: "there was an error"});
        }
}