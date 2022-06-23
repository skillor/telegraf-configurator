import { Component, OnInit } from '@angular/core';
import { Setting } from 'src/app/shared/settings/setting';
import { SettingsService } from 'src/app/shared/settings/settings.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    settings: Setting[] = [];

    constructor(
        private settingsService: SettingsService,
    ) { }

    ngOnInit(): void {
        this.settings = this.loadSettings();
    }

    loadSettings(): Setting[] {
        const settings: Setting[] = [];
        for (let setting of this.settingsService.getSettings()) {
            settings.push({...setting});
        }
        return settings;
    }

    saveSettings(): void {
        for (let setting of this.settings) {
            this.settingsService.setSetting(setting.key, setting.value);
        }
        this.settingsService.saveSettings();
    }
}