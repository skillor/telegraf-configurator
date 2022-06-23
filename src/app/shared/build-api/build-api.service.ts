import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Plugin } from '../plugin/plugin';
import { SettingsService } from '../settings/settings.service';
import { BuildInfo } from './build-info';

@Injectable({
    providedIn: 'root'
})
export class BuildApiService {

    constructor(
        private http: HttpClient,
        private settingsService: SettingsService,
    ) { }

    private getUrl(endpoint: string): string {
        const url = new URL(this.settingsService.getSetting('build_api_url').value + endpoint);
        url.searchParams.append('api_key', this.settingsService.getSetting('build_api_key').value);
        return url.toString();
    }

    private pluginListToTypeList(pluginList: Plugin[]): {[key: string]: string[]} {
        const plugins: {[key: string]: string[]} = {};
        for (const pluginName of new Set(pluginList.map(plugin => plugin.name))) {
            const pluginType = pluginName.split('/')[0];
            const name = pluginName.substring(pluginType.length + 1);
            if (pluginType in plugins) {
                plugins[pluginType].push(name)
            } else {
                plugins[pluginType] = [name];
            }
        }
        return plugins;
    }

    build(
        os: string,
        arch: string,
        pluginList: Plugin[],
    ): Observable<{build_id: string}> {
        const plugins = this.pluginListToTypeList(pluginList);
        return this.http.post<{build_id: string}>(this.getUrl('/build'), {
            go_os: os,
            go_arch: arch,
            plugins: plugins,
        });
    }

    getBuildInfo(): Observable<BuildInfo> {
        return this.http.get<BuildInfo>(this.getUrl('/build-info'));
    }
}
