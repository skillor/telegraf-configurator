import { Injectable } from '@angular/core';
import { RepoInfo } from '../github/repo-info';
import { Setting } from './setting';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private localStoragePrefix = 'settings_';
    private settings: {[key: string]: Setting};

    constructor() {
        // default settings
        let settings: Setting[] = [
            {
                key: 'git_repo_owner',
                title: 'Git Repo Owner',
                value: 'influxdata',
            },
            {
                key: 'git_repo_name',
                title: 'Git Repo Name',
                value: 'telegraf',
            },
            {
                key: 'git_repo_branch',
                title: 'Git Repo Branch',
                value: 'master',
            },
            {
                key: 'git_repo_branch',
                title: 'Git Repo Branch',
                value: 'master',
            },
            {
                key: 'activate_build_api',
                title: 'Activate Telegraf Build Api',
                value: false,
            },
            {
                key: 'build_api_url',
                title: 'Telegraf Build Api Url',
                value: 'http://127.0.0.1:8000',
            },
            {
                key: 'build_api_key',
                title: 'Telegraf Build Api Key',
                value: '',
            },
        ];
        this.settings = {};
        for (const setting of settings) {
            this.settings[setting.key] = setting;
        }
        this.loadSettings();
    }

    getRepoInfo(): RepoInfo {
        return {
            owner: this.getSetting('git_repo_owner').value,
            name: this.getSetting('git_repo_name').value,
            branch: this.getSetting('git_repo_branch').value
        };
    }

    private getLocalStorageKey(key: string): string {
        return this.localStoragePrefix + key;
    }

    private loadSetting(setting: Setting): void {
        const storedSetting = localStorage.getItem(this.getLocalStorageKey(setting.key));
        if (storedSetting === null) return;
        setting.value = JSON.parse(storedSetting);
    }

    private loadSettings(): void {
        for (const setting of Object.values(this.settings)) {
            this.loadSetting(setting);
        }
    }

    getSetting(key: string): Setting {
        return this.settings[key];
    }

    getSettings(): Setting[] {
        return Object.values(this.settings);
    }

    setSetting(key: string, value: any): void {
        this.settings[key].value = value;
    }

    saveSettings(): void {
        for (const setting of Object.values(this.settings)) {
            this.saveSetting(setting);
        }
    }

    private saveSetting(setting: Setting): void {
        localStorage.setItem(this.getLocalStorageKey(setting.key), JSON.stringify(setting.value));
    }
}
