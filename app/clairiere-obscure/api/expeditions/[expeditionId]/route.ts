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

    // Check if user already exists
    let expeditioner = await prisma.expeditioner.findUnique({
      where: {
        name_birthday: {
          name,
          birthday: new Date(birthday),
        },
      },
      include: {
        expeditions: {
          where: { id: expeditionId },
        },
      },
    });

    if (expeditioner) {
      // User exists, check if already in this expedition
      if (expeditioner.expeditions.length > 0) {
        return NextResponse.json({
          message: "Successfully joined expedition",
          expeditioner,
        });
      }

      // User exists but not in this expedition, connect them
      expeditioner = await prisma.expeditioner.update({
        where: { id: expeditioner.id },
        data: {
          expeditions: {
            connect: { id: expeditionId },
          },
        },
        include: {
          expeditions: true,
        },
      });
    } else {
      // User doesn't exist, create new one
      expeditioner = await prisma.expeditioner.create({
        data: {
          name,
          birthday: new Date(birthday),
          expeditions: {
            connect: { id: expeditionId },
          },
        },
        include: {
          expeditions: true,
        },
      });
    }

    return NextResponse.json({
      message: "Successfully joined expedition",
      expeditioner,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to join expedition" },
      { status: 500 }
    );
  }
}
