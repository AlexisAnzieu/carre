import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function GuestsPage() {
  const subscribers = await prisma.emailSubscriber.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Guests List</h1>
      <div className="space-y-2">
        {subscribers.map((subscriber) => (
          <div
            key={subscriber.id}
            className="flex justify-between items-center p-4 border-b hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-900">{subscriber.email}</span>
            <span className="text-sm text-gray-500">
              {new Date(subscriber.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
