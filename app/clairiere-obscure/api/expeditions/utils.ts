import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Shared types
export interface JoinExpeditionRequest {
  name: string;
  birthday: string;
}

export interface APIError {
  error: string;
  details?: string;
}

// Utility function to handle errors consistently
export function handleError(
  error: unknown,
  message: string,
  status: number = 500
) {
  console.error(`${message}:`, error);
  return NextResponse.json({ error: message } as APIError, { status });
}

// Utility function to validate expedition existence
export async function validateExpeditionExists(expeditionId: string) {
  const expedition = await prisma.expedition.findUnique({
    where: { id: expeditionId },
    select: { id: true }, // Only select what we need for validation
  });

  if (!expedition) {
    throw new Error("Expedition not found");
  }

  return expedition;
}

// Utility function to validate date format
export function validateDate(dateString: string): Date {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }
  return date;
}

// Utility function to validate and sanitize input
export function validateJoinExpeditionInput(
  body: unknown
): JoinExpeditionRequest {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid request body");
  }

  const { name, birthday } = body as Record<string, unknown>;

  if (
    !name ||
    typeof name !== "string" ||
    !name.trim() ||
    !birthday ||
    typeof birthday !== "string"
  ) {
    throw new Error("Name and birthday are required and must be strings");
  }

  return {
    name: name.trim(),
    birthday,
  };
}
