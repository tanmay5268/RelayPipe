import { contract } from "@repo/contract";
import { implement, ORPCError } from "@orpc/server";
import { clerk_user_email } from "@/lib/fetchuser";
export const os = implement(contract).$context<{
    headers: Headers;
    resHeaders: Headers;
}>()

export const secureOs = os.use(async ({ next }) => {
    const email = await clerk_user_email()
    if (!email) {
        throw new ORPCError("UNAUTHORIZED")
    }
    return next({
        context: {
            email
        }
    })
})  