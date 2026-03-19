import { NextRequest, NextResponse } from 'next/server';

const AUS_POST_API_KEY = 'rvP4mocvCcHTT38c2gNhiyWtzW3g59Yf';
const ORIGIN_POSTCODE = '2323'; // Maitland / Green Hills area

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postcode } = body;

    if (!postcode || postcode.length !== 4) {
      return NextResponse.json(
        { responseCode: 4000, message: "Invalid postcode. Please provide a 4-digit Australian postcode." },
        { status: 400 }
      );
    }

    // Australia Post PAC API - Domestic Parcel Calculation
    // Docs: https://developers.auspost.com.au/apis/pac/domestic-parcel-postage-calculation
    const queryParams = new URLSearchParams({
      from_postcode: ORIGIN_POSTCODE,
      to_postcode: postcode,
      length: '18',
      width: '10',
      height: '2',
      weight: '0.1', // 100g
      service_code: 'AUS_PARCEL_REGULAR'
    });

    const url = `https://digitalapi.auspost.com.au/postage/parcel/domestic/calculate.json?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'AUTH-KEY': AUS_POST_API_KEY,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Aus Post API Error:', errorData);
      return NextResponse.json(
        { responseCode: 4001, message: "Failed to fetch rates from Australia Post" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // The API returns an object with a 'postage_result' field
    const shippingCost = parseFloat(data.postage_result.total_cost);

    const responseData = {
      responseCode: 2000,
      message: "Shipping cost calculated successfully",
      data: {
        postcode,
        shippingCost,
        method: data.postage_result.service || "Australia Post Standard",
      },
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('Shipping Calculation API error:', error);
    return NextResponse.json(
      { responseCode: 5000, message: "Internal server error" },
      { status: 500 }
    );
  }
}
