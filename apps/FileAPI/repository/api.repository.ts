import { prisma } from "@repo/database";

class apiOperations{
    async getnewApi(randomApi:string) {
        const apiInfo = await prisma.apiKey.create({
            data: {
                key: randomApi
            }
        })
        return apiInfo ?? null;
    }
}

export const apirepo= new apiOperations()