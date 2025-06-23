import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Expeditioner, Expedition } from "@prisma/client";
import { 
  handleError, 
  validateExpeditionExists, 
  validateDate, 
  validateJoinExpeditionInput,
  type APIError 
} from "../utils";

type ExpeditionerWithExpeditions = Expeditioner & {
  expeditions: Pick<Expedition, 'id' | 'name'>[];
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
      return NextResponse.json(
        { error: "Expedition not found" } as APIError,
        { status: 404 }
      );
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

    // Use upsert operation to handle both create and update in one transaction
    const expeditioner = await prisma.expeditioner.upsert({
      where: {
        name_birthday: {
          name,
          birthday: birthdayDate,
        },
      },
      create: {
        name,
        birthday: birthdayDate,
        expeditions: {
          connect: { id: expeditionId },
        },
      },
      update: {
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

    const response: SuccessResponse = {
      message: "Successfully joined expedition",
      expeditioner,
    };

    return NextResponse.json(response);
  } catch (error) {
    // Handle validation errors
    if (error instanceof Error) {
      if (error.message.includes("required") || error.message.includes("Invalid")) {
        return handleError(error, error.message, 400);
      }
      if (error.message === "Expedition not found") {
        return handleError(error, error.message, 404);
      }
    }

    // Handle specific Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return handleError(error, "Expeditioner already exists in this expedition", 409);
      }
      if (error.code === 'P2025') {
        return handleError(error, "Expedition not found", 404);
      }
    }
    
    return handleError(error, "Failed to join expedition");
  }
}
