"use server";
import { clerk_user_email } from "./lib/fetchuser";
import { prisma } from "@repo/database";
export async function registerUser() {
    // const user = await currentUser()
    // //if somehow this operation fails, that means user is still navigated to project page.. 
    //  if (!user) return 
    // const email = user.emailAddresses?.[0]?.emailAddress;
    const email = await clerk_user_email()
        await prisma.user.upsert({
          where: { email },
          update: {},
          create: { email },
        });
}