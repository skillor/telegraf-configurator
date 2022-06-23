import { Injectable } from '@angular/core';
import { IndexedBlobs } from '../github/indexed-blobs';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor() { }

    saveSampleConfs(confs: IndexedBlobs) {
        localStorage.setItem('telegraf_sample_confs', JSON.stringify(confs));
    }

    loadSampleConfs(): IndexedBlobs | null {
        const confs = localStorage.getItem('telegraf_sample_confs');
        if (confs === null) return null;
        return JSON.parse(confs);
    }
}
