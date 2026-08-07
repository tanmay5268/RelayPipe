import { contract } from "@repo/contract";
import { implement, ORPCError } from "@orpc/server";
import { NextRequest } from "next/server";
import { getAuth, clerkClient } from '@clerk/nextjs/server'
export const os = implement(contract).$context<{
    headers: Headers;
    resHeaders: Headers;
    req:NextRequest
}>()

export const secureOs = os.use(({ context, next }) => {
    const { isAuthenticated, userId } = getAuth(context.req)
    if (!isAuthenticated) {
        throw new ORPCError("UNAUTHORIZED")
    }
    console.log(userId)
    return next({context:{userId}})
})