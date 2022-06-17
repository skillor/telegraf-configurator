import { Injectable } from '@angular/core';
import { Observable,  tap } from 'rxjs';
import { GithubService } from '../github/github.service';
import { IndexedBlobs } from '../github/indexed-blobs';
import { Plugin } from './plugin';

@Injectable({
    providedIn: 'root'
})
export class PluginService {

    private sampleConfs?: IndexedBlobs = undefined;

    private selectedPlugins: {[id: string]: Plugin} = {};
    private selectedPluginsCounter = 0;

    constructor(private githubService: GithubService) { }

    loadSampleConfs(): Observable<IndexedBlobs> {
        return this.githubService.getIndexedBlobs(
            this.githubService.getApiUrl('influxdata', 'telegraf', 'master', true),
            'plugins/',
            '/sample.conf',
        ).pipe(
            tap(blobs => this.sampleConfs = blobs),
        );
    }

    getSampleConfs(): IndexedBlobs | undefined {
        return this.sampleConfs;
    }

    getPlugins(): string[] | undefined {
        if (this.sampleConfs === undefined) return undefined;
        return Object.keys(this.sampleConfs);
    }

    getSelectedPlugins(): Plugin[] {
        return Object.values(this.selectedPlugins);
    }

    addSelectedPlugin(pluginName: string) {
        this.selectedPlugins[this.selectedPluginsCounter] = {name: pluginName, id: this.selectedPluginsCounter};
        this.selectedPluginsCounter++;
    }

    removeSelectedPlugin(plugin: Plugin) {
        delete this.selectedPlugins[plugin.id];
    }

    selectSelectedPlugin(plugin: Plugin) {
        console.log('select ' + plugin.name);
    }
}
