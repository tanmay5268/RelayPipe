import { ORPCError } from "@orpc/server"
class ApiFunctions {
    async createApi() {
        const randomApi: string = `relay_${crypto.randomUUID()}`
        // const db_response = apirepo.getnewApi(randomApi)
        // if (!db_response) {
        //     throw new ORPCError("INTERNAL_SERVER_ERROR")
        // }
        // return db_response
        
    }
}
export const ApiService= new ApiFunctions()