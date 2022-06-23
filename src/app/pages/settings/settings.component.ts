import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Setting } from 'src/app/shared/settings/setting';
import { SettingsService } from 'src/app/shared/settings/settings.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    settings: {[key:string]: Setting} = {};

    constructor(
        private settingsService: SettingsService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.settings = this.loadSettings();
    }

    typeOf(value: any): string {
        return typeof value;
    }

    loadSettings(): { [key: string]: Setting } {
        const settings: { [key: string]: Setting } = {};
        for (const setting of this.settingsService.getSettings()) {
            settings[setting.key] = {...setting};
        }
        return settings;
    }

    saveSettings(): void {
        for (const setting of this.getSettings()) {
            this.settingsService.setSetting(setting.key, setting.value);
        }
        this.settingsService.saveSettings();
        this.router.navigate(['/home']);
    }

    getSettings(): Setting[] {
        return Object.values(this.settings);
    }
}
