import { contract } from "@repo/contract";
import { implement } from "@orpc/server";
import { NextRequest } from "next/server";
import { clerk_user_email } from "@/lib/fetchuser";
export const os = implement(contract).$context<{
    headers: Headers;
    resHeaders: Headers;
    req:NextRequest
}>()

export const secureOs = os.use(async ({ context, next }) => {
    const email = await clerk_user_email()
    console.log(context.headers)
    return next()
})  