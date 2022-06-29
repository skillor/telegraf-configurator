import { Observable } from "rxjs";

export interface Plugin {
    id: number,
    name: string,
    content: string | undefined,
    contentPath: string,
    error: string | undefined,
}
