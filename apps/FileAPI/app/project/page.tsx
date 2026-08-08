import { currentUser } from "@clerk/nextjs/server";
import {prisma} from "@repo/database"
export default async function Project() {
  const user = await currentUser();
  if (!user) return <div className="text-red-600 text-2xl">Not signed in</div>;
  const email = user.emailAddresses?.[0]?.emailAddress;

  let dbStatus: "idle" | "success" | "error" = "idle";
  let errorMessage = "";

  if (email) {
    try {
      await prisma.user.upsert({
        where: { email },
        update: {},
        create: { email },
      });
      dbStatus = "success";
    } catch (err) {
      console.error("Failed to upsert user:", err);
      dbStatus = "error";
      errorMessage = err instanceof Error ? err.message : "Unknown error";
    }
  }

  return (
    <div className="space-y-4 p-4">
      <div className="text-black">{email}</div>
      {dbStatus === "success" && (
        <div className="text-green-600">✓ User saved to database</div>
      )}
      {dbStatus === "error" && (
        <div className="text-red-600">✗ Failed: {errorMessage}</div>
      )}
      {dbStatus === "idle" && email && (
        <div className="text-yellow-600">⟳ Saving...</div>
      )}
    </div>
  );
}