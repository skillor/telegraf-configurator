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

    saveSetting(setting: Setting) {
        this.settingsService.setSetting(setting.key, setting.value);
    }

    saveSettings(): void {
        for (const setting of this.getSettings()) {
            if (setting.value !== undefined) {
                this.settingsService.setSetting(setting.key, setting.value);
            }
        }
        this.settingsService.saveSettings();
        this.router.navigate(['']);
    }

    getSettings(): Setting[] {
        return Object.values(this.settings);
    }

    jsonSettings(): string {
        return JSON.stringify(Object.fromEntries(Object.values(this.settings).map(setting => [setting.key, setting.value])));
    }

    exportSettings(): void {
        const a = document.createElement('a');
        const file = new Blob([this.jsonSettings()], {type: 'text/plain'});
        a.href = URL.createObjectURL(file);
        a.download = 'settings-' + new Date().toLocaleDateString('en-CA') + '.json';
        a.click();
    }

    importSettings(): void {
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
                    for (const [key, value] of Object.entries(JSON.parse(content))) {
                        if (key in this.settings && typeof this.settings[key].value === typeof value) {
                            this.settings[key].value = value;
                        } else {
                            console.warn('unknown key or type mismatch', key, value);
                        }
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
