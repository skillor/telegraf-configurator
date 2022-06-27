import { Injectable } from '@angular/core';
import { IndexedBlobs } from '../github/indexed-blobs';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor() { }

    saveGitSha(sha: string) {
        localStorage.setItem('telegraf_git_sha', sha);
    }

    loadGitSha(): string | null {
        return localStorage.getItem('telegraf_git_sha');
    }

    removeGitSha(): void {
        localStorage.removeItem('telegraf_git_sha');
    }

    removeSampleConfs(): void {
        localStorage.removeItem('telegraf_sample_confs');
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
