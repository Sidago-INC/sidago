import { NextResponse } from "next/server";
import { users } from "@/lib/mocks/users";

export async function POST(req: Request) {
  try {
    let body;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or empty JSON body",
        },
        { status: 400 },
      );
    }

    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Refresh token is required",
        },
        { status: 400 },
      );
    }

    const user = users.find(
      (candidate) => candidate.refreshToken === refreshToken,
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid refresh token",
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
