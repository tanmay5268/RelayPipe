import { os } from "./os";
import { Fileinit, Fileupload,ApiKey } from "./file";

export const router = os.router({
    relaypipe: {
        fileinit: Fileinit,
        fileupload: Fileupload,
        apikey:ApiKey
    }
}) 