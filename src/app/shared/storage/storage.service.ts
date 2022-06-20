import { Injectable } from '@angular/core';
import { IndexedBlobs } from '../github/indexed-blobs';
import { RepoInfo } from '../github/repo-info';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor() { }

    loadRepoInfo(): RepoInfo | null {
        const repoInfo = localStorage.getItem('telegraf_repo_info');
        if (repoInfo === null) return null;
        return JSON.parse(repoInfo);
    }

    saveSampleConfs(confs: IndexedBlobs) {
        localStorage.setItem('telegraf_sample_confs', JSON.stringify(confs));
    }

    loadSampleConfs(): IndexedBlobs | null {
        const confs = localStorage.getItem('telegraf_sample_confs');
        if (confs === null) return null;
        return JSON.parse(confs);
    }
}
