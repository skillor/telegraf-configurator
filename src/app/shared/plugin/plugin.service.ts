import { Injectable } from '@angular/core';
import { catchError, map, Observable,  of,  tap } from 'rxjs';
import { GithubService } from '../github/github.service';
import { IndexedBlobs } from '../github/indexed-blobs';
import { SettingsService } from '../settings/settings.service';
import { StorageService } from '../storage/storage.service';
import { Plugin } from './plugin';

@Injectable({
    providedIn: 'root'
})
export class PluginService {

    private gitSha?: string = undefined;
    private sampleConfsError: undefined | Error = undefined;
    private sampleConfs?: IndexedBlobs = undefined;

    private mandatoryPlugins: Plugin[];

    private selectedPlugin?: Plugin = undefined;
    private selectedPlugins: {[id: string]: Plugin} = {};
    private selectedPluginsCounter = 0;

    constructor(
        private githubService: GithubService,
        private storageService: StorageService,
        private settingsService: SettingsService,
    ) {
        this.mandatoryPlugins = [
            {
                id: 1,
                name: 'agent',
                content: undefined,
                contentPath: 'config/agent.conf',
                error: undefined,
            }
        ];

        if (this.mandatoryPlugins && this.mandatoryPlugins.length >= 1) {
            this.selectSelectedPlugin(this.mandatoryPlugins[0]);
        }
    }

    updateSampleConfs(): Observable<IndexedBlobs> {
        this.sampleConfsError = undefined;
        return this.githubService.getIndexedBlobs(
            this.githubService.getApiUrl(this.settingsService.getRepoInfo(), true),
            'plugins/',
            '/sample.conf',
        ).pipe(
            catchError(err => {
                this.sampleConfsError = err;
                throw err;
            }),
            tap(res => {
                this.storageService.saveSampleConfs(res.blobs);
                this.sampleConfs = res.blobs;
                this.storageService.saveGitSha(res.sha);
                this.gitSha = res.sha;
            }),
            map(res => res.blobs),
        );
    }

    loadSampleConfs(): Observable<IndexedBlobs> {
        const gitSha = this.storageService.loadGitSha();
        if (gitSha !== null) {
            this.gitSha = gitSha;
            const sampleConfs = this.storageService.loadSampleConfs();
            if (sampleConfs !== null) {
                this.sampleConfs = sampleConfs;
                return of(sampleConfs);
            }
        }
        return this.updateSampleConfs();
    }

    getSampleConfsError(): Error | undefined {
        return this.sampleConfsError;
    }

    getGitSha(): string | undefined {
        return this.gitSha;
    }

    getSampleConfs(): IndexedBlobs | undefined {
        return this.sampleConfs;
    }

    getMandatoryPlugins(): Plugin[] | undefined {
        return this.mandatoryPlugins;
    }

    getOptionalPlugins(): string[] | undefined {
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
            contentPath: this.sampleConfs![pluginName].path,
            error: undefined,
        };
        this.selectedPlugins[this.selectedPluginsCounter] = plugin;
        this.selectedPluginsCounter++;
        this.selectSelectedPlugin(plugin);
    }

    removeSelectedPlugin(plugin: Plugin) {
        if (plugin === this.selectedPlugin) this.selectedPlugin = undefined;
        delete this.selectedPlugins[plugin.id];
    }

    validateSelectedPlugin() {
        if (this.selectedPlugin && this.selectedPlugin.error) {
            this.selectSelectedPlugin(this.selectedPlugin);
        }
    }

    selectSelectedPlugin(plugin: Plugin) {
        this.selectedPlugin = plugin;
        plugin.error = undefined;
        if (plugin.content === undefined) {
            this.githubService.getRawContent(this.githubService.getRawUrl(this.settingsService.getRepoInfo(), plugin.contentPath)).pipe(
                catchError(err => {
                    plugin.error = err;
                    throw err;
                })
            ).subscribe(
                content => plugin.content = content
            );
        }
    }

    getConfigContent(): string {
        return this.mandatoryPlugins.concat(Object.values(this.selectedPlugins)).filter(
            plugin => plugin.content
        ).map(
            plugin => plugin.content
        ).join('\n');
    }

    downloadConfig() {
        const a = document.createElement('a');
        const file = new Blob([this.getConfigContent()], {type: 'text/plain'});
        a.href = URL.createObjectURL(file);
        a.download = 'telegraf.conf';
        a.click();
    }
}
