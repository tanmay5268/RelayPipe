import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { SmartCoercionPlugin } from "@orpc/json-schema";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { CORSPlugin } from "@orpc/server/plugins";
import { onError } from "@orpc/server";
import { router } from "@/router";
const schemaConverters = [new ZodToJsonSchemaConverter()];
const handler = new OpenAPIHandler(router, {
  plugins: [
        new OpenAPIReferencePlugin(
            {
                schemaConverters,
                specGenerateOptions: {
                    info: {
                      title: "File Processing System",
                      version: "1.0.0",
                      description:
                        "File Processing System with worker + s3+ redis",
                    },
                    security: [{ bearerAuth: [] }],
                    // components: {
                    //   securitySchemes: {
                    //     bearerAuth: {
                    //       type: "http",
                    //       scheme: "bearer",
                    //     },
                    //   },
                    // },
                }
        }
    ),
    new SmartCoercionPlugin({ schemaConverters }),
    new CORSPlugin({
      origin: "*",
    }),
    ],
    interceptors: [
      onError((error) => {
        console.error(error);
      }),
    ],

});

async function handleRequest(request: Request) {
  const resHeaders = new Headers();

  const { response } = await handler.handle(request, {
    prefix: "/api",
    context: {
      headers: request.headers,
        resHeaders,
    },
  });

  if (!response) {
    return new Response("Not found", { status: 404 });
  }
  const setCookieHeaders = resHeaders.getSetCookie();
  if (setCookieHeaders.length > 0) {
    const newHeaders = new Headers(response.headers);
    for (const cookie of setCookieHeaders) {
      newHeaders.append("Set-Cookie", cookie);
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }

  return response;
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
