import { contract } from "@repo/contract";
import { implement, ORPCError } from "@orpc/server";

export const os = implement(contract).$context<{
    headers: Headers;
    resHeaders: Headers;
}>()

export const secureOs = os.use(({ context, next }) => {
    const apikey = context.headers.get("cookie")
    if (!apikey) {
        throw new  ORPCError("UNAUTHORIZED")
    }
    return next({context:{apikey}})
})