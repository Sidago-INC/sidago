import { NextResponse } from "next/server";
import { users } from "@/lib/mocks/users";

export async function POST(req: Request) {
  try {
    let body;

    try {
      body = await req.json();
    } catch {
      return Response.json(
        { success: false, message: "Invalid or empty JSON body" },
        { status: 400 },
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format",
        },
        { status: 400 },
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters",
        },
        { status: 400 },
      );
    }

    const user = users.find(
      (candidate) =>
        candidate.email === email && candidate.password === password,
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Credentials not matched",
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
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
