import { Injectable } from '@angular/core';
import { Observable,  of,  tap } from 'rxjs';
import { GithubService } from '../github/github.service';
import { IndexedBlobs } from '../github/indexed-blobs';
import { RepoInfo } from '../github/repo-info';
import { StorageService } from '../storage/storage.service';
import { Plugin } from './plugin';

@Injectable({
    providedIn: 'root'
})
export class PluginService {

    private repoInfo: RepoInfo;
    private sampleConfs?: IndexedBlobs = undefined;

    private selectedPlugin?: Plugin = undefined;
    private selectedPlugins: {[id: string]: Plugin} = {};
    private selectedPluginsCounter = 0;

    constructor(
        private githubService: GithubService,
        private storageService: StorageService,
    ) {
        const repoInfo = this.storageService.loadRepoInfo();
        if (repoInfo === null) {
            this.repoInfo = {owner: 'influxdata', name: 'telegraf', branch: 'master'};
        } else {
            this.repoInfo = repoInfo;
        }
    }

    loadSampleConfs(): Observable<IndexedBlobs> {
        const sampleConfs = this.storageService.loadSampleConfs();
        if (sampleConfs !== null) {
            this.sampleConfs = sampleConfs;
            return of(sampleConfs);
        }
        return this.githubService.getIndexedBlobs(
            this.githubService.getApiUrl(this.repoInfo, true),
            'plugins/',
            '/sample.conf',
        ).pipe(
            tap(blobs => {
                this.storageService.saveSampleConfs(blobs);
                this.sampleConfs = blobs;
            }),
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

    getSelectedPlugin(): Plugin | undefined {
        return this.selectedPlugin;
    }

    addSelectedPlugin(pluginName: string) {
        const plugin = {
            name: pluginName,
            id: this.selectedPluginsCounter,
            content: undefined,
        };
        this.selectedPlugins[this.selectedPluginsCounter] = plugin;
        this.selectedPluginsCounter++;
        this.selectSelectedPlugin(plugin);
    }

    removeSelectedPlugin(plugin: Plugin) {
        if (plugin === this.selectedPlugin) this.selectedPlugin = undefined;
        delete this.selectedPlugins[plugin.id];
    }

    selectSelectedPlugin(plugin: Plugin) {
        this.selectedPlugin = plugin;
        if (plugin.content === undefined) {
            this.githubService.getRawContent(this.githubService.getRawUrl(this.repoInfo, this.sampleConfs![plugin.name].path)).subscribe(
                content => plugin.content = content
            );
        }
    }
}
