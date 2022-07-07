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

    private unsavedChanges = false;

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
                contentPath: 'config/printer/agent.conf',
                error: undefined,
            }
        ];

        if (this.mandatoryPlugins && this.mandatoryPlugins.length >= 1) {
            this.selectSelectedPlugin(this.mandatoryPlugins[0]);
        }
    }

    hasUnsavedChanges(): boolean {
        return this.unsavedChanges;
    }

    resetPlugins(): void {
        this.unsavedChanges = false;
        this.selectedPlugins = {};
        this.selectedPluginsCounter = 0;
        if (!this.mandatoryPlugins.includes(this.selectedPlugin!)) {
            this.selectedPlugin = undefined;
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

    addSelectedPlugin(pluginName: string, content: string | undefined = undefined, select: boolean = true) {
        this.unsavedChanges = true;
        const plugin = {
            name: pluginName,
            id: this.selectedPluginsCounter,
            content: content,
            contentPath: this.sampleConfs![pluginName].path,
            error: undefined,
        };
        this.selectedPlugins[this.selectedPluginsCounter] = plugin;
        this.selectedPluginsCounter++;
        if (select) this.selectSelectedPlugin(plugin);
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

    setPlugin(pluginName: string, pluginContent: string) {
        const mandatoryPlugins = this.getMandatoryPlugins();
        if (mandatoryPlugins !== undefined) {
            for (const plugin of mandatoryPlugins) {
                if (pluginName === plugin.name) {
                    plugin.content = pluginContent;
                    return;
                }
            }
        }


        const optionalPlugins = this.getOptionalPlugins();
        if (optionalPlugins !== undefined) {
            if (!optionalPlugins.includes(pluginName)) {
                console.warn('Plugin: "' + pluginName + '" was not found, skipping...');
                return;
            }
            this.addSelectedPlugin(pluginName, pluginContent, false);
        }
    }

    load(plugins: {[key: string]: string}) {
        this.resetPlugins();
        const pluginNames = Object.keys(plugins);
        if (pluginNames.length === 0) return;
        for (const plugin of pluginNames) {
            this.setPlugin(plugin, atob(plugins[plugin]));
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

    private jsonPlugins(): string {
        return JSON.stringify(this.mandatoryPlugins.concat(Object.values(this.selectedPlugins)).filter(
            plugin => plugin.content,
        ).map(
            plugin => {
                return {name: plugin.name, content: plugin.content};
            },
        ));
    }

    exportPlugins(): void {
        const a = document.createElement('a');
        const file = new Blob([this.jsonPlugins()], {type: 'text/plain'});
        a.href = URL.createObjectURL(file);
        a.download = 'telegraf-config-' + new Date().toLocaleDateString('en-CA') + '.json';
        a.click();
    }

    importPlugins(): void {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.style.display = 'none';
        document.body.appendChild(input);

        const onEnd = () => {
            document.body.removeChild(input);
        };

        input.onchange = () => {
            if (!input.files || input.files.length == 0 || input.files[0].size > 250000000 || !FileReader) {
                return onEnd();
            }
            const file = input.files[0];
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                if (!e.target || !e.target.result) {
                    return onEnd();
                }
                let content: string;
                if (typeof e.target.result === 'string') {
                    content = e.target.result;
                } else {
                    content = new TextDecoder().decode(e.target.result);
                }

                try {
                    this.resetPlugins();
                    const plugins: {name: string, content: string}[] = JSON.parse(content);
                    for (const plugin of plugins) {
                        this.setPlugin(plugin.name, plugin.content);
                    }
                } catch (err) {
                    console.error(err);
                }
                onEnd();
            };
            fileReader.readAsText(file);
        };
        input.click();
    }
}
