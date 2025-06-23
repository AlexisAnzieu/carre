import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ expeditionId: string }> }
) {
  try {
    const { expeditionId } = await params;
    const expedition = await prisma.expedition.findUnique({
      where: {
        id: expeditionId,
      },
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
        { error: "Expedition not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(expedition);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch expedition" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ expeditionId: string }> }
) {
  try {
    const { expeditionId } = await params;
    const body = await request.json();
    const { name, birthday } = body;

    if (!name || !birthday) {
      return NextResponse.json(
        { error: "Name and birthday are required" },
        { status: 400 }
      );
    }

    // Check if expedition exists
    const expedition = await prisma.expedition.findUnique({
      where: { id: expeditionId },
    });

    if (!expedition) {
      return NextResponse.json(
        { error: "Expedition not found" },
        { status: 404 }
      );
    }

    // Create expeditioner and connect to expedition
    try {
      const expeditioner = await prisma.expeditioner.create({
        data: {
          name,
          birthday: new Date(birthday),
          expeditions: {
            connect: { id: expeditionId },
          },
        },
      });

      return NextResponse.json({
        message: "Successfully joined expedition",
        expeditioner,
      });
    } catch (createError: unknown) {
      // If unique constraint violation, try to find existing and connect
      if (
        createError &&
        typeof createError === "object" &&
        "code" in createError &&
        createError.code === "P2002"
      ) {
        return NextResponse.json(
          { error: "Someone with this name and birthday already exists" },
          { status: 400 }
        );
      }
      throw createError;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to join expedition" },
      { status: 500 }
    );
  }
}
