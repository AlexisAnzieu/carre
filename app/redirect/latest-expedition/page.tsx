import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function Page() {
  // Fetch the latest expedition
  const latestExpedition = await prisma.expedition.findFirst({
    orderBy: { createdAt: "desc" },
  });

  if (!latestExpedition) {
    // If no expeditions exist, redirect to home or show a message
    redirect("/");
  }

  // Redirect to the join page for the latest expedition
  redirect(`/clairiere-obscure/join/${latestExpedition.id}`);
  return null;
}
