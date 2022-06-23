import { Component, OnInit } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { BuildApiService } from 'src/app/shared/build-api/build-api.service';
import { BuildInfo } from 'src/app/shared/build-api/build-info';
import { Plugin } from 'src/app/shared/plugin/plugin';
import { PluginService } from 'src/app/shared/plugin/plugin.service';
import { SettingsService } from 'src/app/shared/settings/settings.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    buildLoading = false;
    buildInfo$?: Observable<BuildInfo>;
    buildOs = '';
    buildArch = '';

    constructor(
        public pluginService: PluginService,
        public buildApiService: BuildApiService,
        public settingsService: SettingsService,
    ) {
    }

    ngOnInit(): void {
        if (this.settingsService.getSetting('activate_build_api').value) {
            this.buildInfo$ = this.buildApiService.getBuildInfo().pipe(
                tap(buildInfo => {
                    this.buildOs = buildInfo.os[0];
                    this.buildArch = buildInfo.arch[0];
                })
            );
        }

        this.pluginService.loadSampleConfs().subscribe();
    }

    build(): void {
        this.buildLoading = true;
        this.buildApiService.build(
            this.buildOs,
            this.buildArch,
            this.pluginService.getSelectedPlugins(),
        ).pipe(
            catchError(err => {
                this.buildLoading = false
                return err;
            }),
        ).subscribe(x => {
            this.buildLoading = false;
            console.log(x)
        });
    }
}
