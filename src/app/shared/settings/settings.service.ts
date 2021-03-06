import { Injectable } from '@angular/core';
import { RepoInfo } from '../github/repo-info';
import { StorageService } from '../storage/storage.service';
import { Setting } from './setting';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private localStoragePrefix = 'settings_';
    private settings: { [key: string]: Setting };

    private possibleThemes: { [key: string]: { vs: string, daisy: string } } = {
        light: { vs: 'vs', daisy: 'light' },
        dark: { vs: 'vs-dark', daisy: 'dark' }
    };

    constructor(
        private storageService: StorageService
    ) {
        // default settings
        const settings: Setting[] = [
            {
                key: 'theme_style',
                type: 'select',
                title: 'Theme',
                value: Object.keys(this.possibleThemes)[0],
                options: Object.keys(this.possibleThemes),
            },
            {
                key: 'git_repo_owner',
                type: 'text',
                title: 'Git Repo Owner',
                value: 'influxdata',
                change_callback: () => {
                    this.storageService.removeGitSha();
                },
            },
            {
                key: 'git_repo_name',
                type: 'text',
                title: 'Git Repo Name',
                value: 'telegraf',
                change_callback: () => {
                    this.storageService.removeGitSha();
                },
            },
            {
                key: 'git_repo_branch',
                type: 'text',
                title: 'Git Repo Branch',
                value: 'master',
                change_callback: () => {
                    this.storageService.removeGitSha();
                },
            },
            {
                key: 'update_git_button',
                type: 'button',
                title: 'Update Git',
                value: undefined,
                change_callback: () => {
                    this.storageService.removeGitSha();
                },
            },
            {
                key: 'activate_build_api',
                type: 'checkbox',
                title: 'Activate Telegraf Build Api',
                value: false,
            },
            {
                key: 'build_api_url',
                type: 'text',
                title: 'Telegraf Build Api Url',
                value: 'http://127.0.0.1:8000',
                condition: 'activate_build_api',
            },
            {
                key: 'build_api_key',
                type: 'text',
                title: 'Telegraf Build Api Key',
                value: '',
                condition: 'activate_build_api',
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

    getPossibleThemes(): string[] {
        return Object.keys(this.possibleThemes);
    }

    getTheme(): string {
        return this.getSetting('theme_style').value;
    }

    getVsTheme(): string {
        return this.possibleThemes[this.getTheme()].vs;
    }

    getDaisyTheme(): string {
        return this.possibleThemes[this.getTheme()].daisy;
    }

    getSetting(key: string): Setting {
        return this.settings[key];
    }

    getSettings(): Setting[] {
        return Object.values(this.settings);
    }

    setSetting(key: string, value: any): void {
        if (this.settings[key].value === undefined || this.settings[key].value !== value) {
            this.settings[key].value = value;
            this.settings[key].change_callback?.(value);
        }
    }

    saveSettings(): void {
        for (const setting of Object.values(this.settings)) {
            this.saveSetting(setting);
        }
    }

    private saveSetting(setting: Setting): void {
        if (setting.value === undefined) return;
        localStorage.setItem(this.getLocalStorageKey(setting.key), JSON.stringify(setting.value));
    }
}
