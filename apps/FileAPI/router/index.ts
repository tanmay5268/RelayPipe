import { os } from "./os";
import { Fileinit, Fileupload } from "./file";

export const router = os.router({
    relaypipe: {
        fileinit: Fileinit,
        fileupload:Fileupload
    }
}) 