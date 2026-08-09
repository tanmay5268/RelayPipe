import { currentUser } from "@clerk/nextjs/server";
export async function clerk_user_email() {
    const cleruserdetails = await currentUser();
    if (!cleruserdetails || !cleruserdetails.emailAddresses[0]?.emailAddress) {
        throw new Error("CLERK USER DETAILS NOT FOUND");
    }
    return cleruserdetails.emailAddresses[0]?.emailAddress
    
}