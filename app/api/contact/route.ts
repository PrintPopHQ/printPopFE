import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, email, order_number, description } = body;

    // Simple validation
    if (!full_name || !email || !order_number || !description) {
      return NextResponse.json(
        { responseCode: 4000, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Mock response based on requirements
    const responseData = {
      responseCode: 2000,
      message: "Contact form submitted successfully",
      data: {
        id: crypto.randomUUID(),
        full_name,
        email,
        order_number,
        description,
        created_at: new Date().toISOString(),
      },
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { responseCode: 5000, message: "Internal server error" },
      { status: 500 }
    );
  }
}
