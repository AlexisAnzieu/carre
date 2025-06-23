import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { handleError, type APIError } from "../expeditions/utils";

export async function GET(request: Request) {
  try {
    // Get user ID from cookie
    const cookieHeader = request.headers.get("cookie");
    const userIdMatch = cookieHeader?.match(/user-id=([^;]+)/);

    if (!userIdMatch) {
      return NextResponse.json(
        { error: "User not authenticated" } as APIError,
        { status: 401 }
      );
    }

    const userId = userIdMatch[1];

    // Fetch user with their expedition history
    const user = await prisma.expeditioner.findUnique({
      where: { id: userId },
      include: {
        expeditions: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            _count: {
              select: {
                expeditioners: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc", // Most recent expeditions first
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" } as APIError, {
        status: 404,
      });
    }

    // Format the response
    const userProfile = {
      id: user.id,
      name: user.name,
      birthday: user.birthday,
      expeditions: user.expeditions,
      totalExpeditions: user.expeditions.length,
    };

    return NextResponse.json(userProfile);
  } catch (error) {
    return handleError(error, "Failed to fetch user profile");
  }
}

// Logout endpoint to clear user session
export async function DELETE() {
  try {
    const response = NextResponse.json({ message: "Successfully logged out" });

    // Clear the user ID cookie
    response.cookies.set("user-id", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Immediately expire
      path: "/",
    });

    return response;
  } catch (error) {
    return handleError(error, "Failed to logout");
  }
}
