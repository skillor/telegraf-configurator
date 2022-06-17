import { GithubBlob } from "./github-blob";

export interface GithubRepo {
    sha: string,
    url: string,
    tree: GithubBlob[],
}
