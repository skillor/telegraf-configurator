export interface GithubBlob {
    path: string,
    type: string,
    sha: string,
    url: string,
    content: string | undefined,
    encoding: string | undefined,
}
