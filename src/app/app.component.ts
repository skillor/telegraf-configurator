import { Component, HostListener, OnInit } from '@angular/core';
import { SettingsService } from './shared/settings/settings.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler() {
        return false;
    }

    constructor(
        public settingsService: SettingsService,
    ) { }

    ngOnInit(): void {
        // this.settingsService.setTheme('dark');
    }
}
