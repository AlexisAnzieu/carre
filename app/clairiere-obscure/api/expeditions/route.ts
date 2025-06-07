import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    
    const expedition = await prisma.expedition.create({
      data: { name },
    });

    return NextResponse.json(expedition);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create expedition' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const expeditions = await prisma.expedition.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(expeditions);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch expeditions' },
      { status: 500 }
    );
  }
}
