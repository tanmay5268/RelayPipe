import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@repo/database";
export default async function Project() {
  const user = await currentUser();
  if (!user) return <div className="text-red-600 text-2xl">Not signed in</div>;
  const email = user.emailAddresses?.[0]?.emailAddress;

    async function createuser() {
        if (email) {
            console.log(email)
      await prisma.user.upsert({
        where: { email },
        update: {},
        create: { email },
      });
    }
    }
    createuser()

  return (
    <div className="text-black">{user?.emailAddresses[0]?.emailAddress}</div>
  );
}
