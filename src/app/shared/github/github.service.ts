import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { GithubRepo } from './github-repo';
import { GithubBlob } from './github-blob';
import { IndexedBlobs } from './indexed-blobs';
import { RepoInfo } from './repo-info';

@Injectable({
    providedIn: 'root'
})
export class GithubService {


    constructor(private http: HttpClient) { }

    private indexBlobs(blobs: GithubBlob[], startsWith: string = '', endsWith: string = '', seperator: string = '/'): IndexedBlobs {
        let indexed: IndexedBlobs = {};
        for (const blob of blobs) {
            if (blob.path.startsWith(startsWith) && blob.path.endsWith(endsWith)) {
                const path = blob.path.substring(startsWith.length, blob.path.length-endsWith.length);
                indexed[path] = blob;
            }
        }
        return indexed;
    }

    getApiUrl(repoInfo: RepoInfo, recursive: boolean = false): string {
        let url = new URL('https://api.github.com/repos/' + repoInfo.owner + '/' + repoInfo.name + '/git/trees/' + repoInfo.branch);
        if (recursive) url.searchParams.append('recursive', '1');
        return url.toString();
    }

    getRawUrl(repoInfo: RepoInfo, path: string): string {
        return 'https://raw.githubusercontent.com/' + repoInfo.owner + '/' + repoInfo.name + '/' + repoInfo.branch + '/' + path;
    }

    getIndexedBlobs(
        url: string,
        startsWith: string = '',
        endsWith: string = '',
    ): Observable<IndexedBlobs> {
        return this.http.get<GithubRepo>(url).pipe(
            map(res => res.tree),
            map(tree => tree.filter((item: GithubBlob) => item.type === 'blob')),
            map(tree => this.indexBlobs(tree, startsWith, endsWith)),
        );
    }

    getBlobContent(url: string): Observable<string> {
        return this.http.get<GithubBlob>(url).pipe(
            map(
                res => {
                    if (res.content === undefined) {
                        throw new Error('blob content not found');
                    }
                    if (res.encoding !== 'base64') {
                        throw new Error('blob encoding is not base64');
                    }
                    return atob(res.content);
                },
            ),
        );
    }

    getRawContent(url: string): Observable<string> {
        return this.http.get(url, {responseType: 'text'});
    }
}
