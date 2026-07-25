import { oc } from "@orpc/contract";
import * as z from "zod"
import { uploadInitInputSchema,uploadInitOutputSchema,confirmUploadInputSchema,confirmUploadOutputSchema} from "./schema/file.schema";
export const base = oc.errors({
    BAD_REQUEST: {
        status: 400,
        message: "Invalid request data",
        data: z.object({
            field: z.string().min(3),
            issue: z.string().min(3),
        }),
    },
    TOO_MANY_REQUESTS: {
        status: 429,
        message: "You have exceeded your allowed rate limit",
    },
    UNAUTHORIZED: {
        status: 401,
        message: "Authentication required",
    },
    FORBIDDEN: {
        status: 403,
        message: "You dont have required permissions to perform this action",
        data: z.object({
            reason: z.enum(["Locked", "Unverified"]),
        }),
    },
    NOT_FOUND: {
        status: 404,
        message: "Resource not found",
        data: z.object({
            resource: z.string(),
            issue: z.string(),
        }),
    },
    CONFLICT: {
        status: 409,
        message: "Resource conflict",
        data: z.object({
            field: z.string(),
            value: z.string().nullable(),
        }),
    },
    INTERNAL_SERVER_ERROR: {
        status: 500,
        message: "An unexpected error occurred",
        data: z.object({
            errorId: z.string().optional(),
            details: z.string(),
        }),
    },
    DOMAIN_RULE_VIOLATION: {
        status: 422,
        message: "Business rule violation",
        data: z.object({
            rule: z.string(),
        }),
    },
});

const fileinit_contract = base.route({
    method: "POST",
    path: "/v1/fileinit",
    successStatus: 200,
    tags:["file"]
}).input(uploadInitInputSchema).output(uploadInitOutputSchema)

const fileconfirm_contract = base.route({
    method: "POST",
    path: "/v1/fileconfirm",
    successStatus: 200,
    tags:["file"]
}).input(confirmUploadInputSchema).output(confirmUploadOutputSchema)

export const contract = {
    relaypipe: {
        fileinit: fileinit_contract,
        fileupload:fileconfirm_contract
    }
}