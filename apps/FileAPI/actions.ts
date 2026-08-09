"use server";
import { prisma } from "@repo/database";
import { currentUser } from "@clerk/nextjs/server";
export async function registerUser() {
    const user = await currentUser()
    //if somehow this operation fails, that means user is still navigated to project page.. 
     if (!user) return 
    const email = user.emailAddresses?.[0]?.emailAddress;
    if (email) {
      try {
        await prisma.user.upsert({
          where: { email },
          update: {},
          create: { email },
        });
      } catch (err) {
        console.error("Failed to upsert user:", err);
      }
    }
    console.log(`From server Actions:${email}`)
}