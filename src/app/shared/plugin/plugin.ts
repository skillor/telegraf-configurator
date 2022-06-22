import { Observable } from "rxjs";

export interface Plugin {
    id: number,
    name: string,
    content: string | undefined,
    contentGetter: Observable<string>,
}
