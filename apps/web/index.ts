import { prisma } from "@repo/database/index";

async function main(){
    const users = await prisma.user.findMany()
        console.log(users)
}
main().finally(async () => { 

    prisma.$disconnect()
    
})