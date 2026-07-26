import { contract } from "@repo/contract";
import { implement } from "@orpc/server";

export const os = implement(contract).$context<{
    headers: Headers;
    resHeaders: Headers;
}>()

