import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Expeditioner, Expedition } from "@prisma/client";
import {
  handleError,
  validateExpeditionExists,
  validateDate,
  validateJoinExpeditionInput,
  type APIError,
} from "../utils";

type ExpeditionerWithExpeditions = Expeditioner & {
  expeditions: Pick<Expedition, "id" | "name">[];
};

interface SuccessResponse {
  message: string;
  expeditioner: ExpeditionerWithExpeditions;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ expeditionId: string }> }
) {
  try {
    const { expeditionId } = await params;

    const expedition = await prisma.expedition.findUnique({
      where: { id: expeditionId },
      include: {
        _count: {
          select: {
            expeditioners: true,
          },
        },
      },
    });

    if (!expedition) {
      return NextResponse.json({ error: "Expedition not found" } as APIError, {
        status: 404,
      });
    }

    return NextResponse.json(expedition);
  } catch (error) {
    return handleError(error, "Failed to fetch expedition");
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ expeditionId: string }> }
) {
  try {
    const { expeditionId } = await params;
    const requestBody = await request.json();

    // Validate and sanitize input
    const { name, birthday } = validateJoinExpeditionInput(requestBody);

    // Validate date format
    const birthdayDate = validateDate(birthday);

    // Validate expedition exists
    await validateExpeditionExists(expeditionId);

    // Check if expeditioner already exists
    const existingExpeditioner = await prisma.expeditioner.findUnique({
      where: {
        name_birthday: {
          name,
          birthday: birthdayDate,
        },
      },
      include: {
        expeditions: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    let expeditioner;

    if (existingExpeditioner) {
      // Check if already connected to this expedition
      const isAlreadyConnected = existingExpeditioner.expeditions.some(
        (exp) => exp.id === expeditionId
      );

      if (isAlreadyConnected) {
        // Already connected, return existing data
        expeditioner = existingExpeditioner;
      } else {
        // Connect to new expedition while preserving existing ones
        expeditioner = await prisma.expeditioner.update({
          where: {
            name_birthday: {
              name,
              birthday: birthdayDate,
            },
          },
          data: {
            expeditions: {
              connect: { id: expeditionId },
            },
          },
          include: {
            expeditions: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
      }
    } else {
      // Create new expeditioner
      expeditioner = await prisma.expeditioner.create({
        data: {
          name,
          birthday: birthdayDate,
          expeditions: {
            connect: { id: expeditionId },
          },
        },
        include: {
          expeditions: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }

    const response: SuccessResponse = {
      message: "Successfully joined expedition",
      expeditioner,
    };

    // Set user ID cookie for session management
    const cookieResponse = NextResponse.json(response);
    cookieResponse.cookies.set("user-id", expeditioner.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return cookieResponse;
  } catch (error) {
    // Handle validation errors
    if (error instanceof Error) {
      if (
        error.message.includes("required") ||
        error.message.includes("Invalid")
      ) {
        return handleError(error, error.message, 400);
      }
      if (error.message === "Expedition not found") {
        return handleError(error, error.message, 404);
      }
    }

    // Handle specific Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2025") {
        return handleError(error, "Expedition not found", 404);
      }
    }

    return handleError(error, "Failed to join expedition");
  }
}
