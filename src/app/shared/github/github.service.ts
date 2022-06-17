import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { GithubRepo } from './github-repo';
import { GithubBlob } from './github-blob';
import { IndexedBlobs } from './indexed-blobs';

@Injectable({
    providedIn: 'root'
})
export class GithubService {


    constructor(private http: HttpClient) { }

    private indexBlobs(blobs: GithubBlob[], startsWith: string = '', endsWith: string = '', seperator: string = '/'): IndexedBlobs {
        let indexed: IndexedBlobs = {};
        for (let blob of blobs) {
            if (blob.path.startsWith(startsWith) && blob.path.endsWith(endsWith)) {
                const path = blob.path.substring(startsWith.length, blob.path.length-endsWith.length);
                indexed[path] = blob;
            }
        }
        return indexed;
    }

    getApiUrl(
        repo_owner: string,
        repo_name: string,
        branch_name: string,
        recursive: boolean = false,
    ): string {
        let url = new URL('https://api.github.com/repos/' + repo_owner + '/' + repo_name + '/git/trees/' + branch_name);
        if (recursive) url.searchParams.append('recursive', '1');
        return url.toString();
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
}
