import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, tap } from 'rxjs';
import { BuildApiService } from 'src/app/shared/build-api/build-api.service';
import { BuildInfo } from 'src/app/shared/build-api/build-info';
import { SourceInfo } from 'src/app/shared/build-api/source-info';
import { PluginService } from 'src/app/shared/plugin/plugin.service';
import { SettingsService } from 'src/app/shared/settings/settings.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    buildLoading = false;
    buildInfoError: undefined | Error = undefined;
    buildSourceInfoError: undefined | Error = undefined;
    buildError: undefined | Error = undefined;
    buildResultLink: undefined | string = undefined;
    buildInfo$?: Observable<BuildInfo>;
    buildSourceInfo$?: Observable<boolean>;
    buildOs = '';
    buildArch = '';

    constructor(
        private router: Router,
        public pluginService: PluginService,
        public buildApiService: BuildApiService,
        public settingsService: SettingsService,
    ) {
    }

    ngOnInit(): void {
        if (this.pluginService.getSampleConfs() === undefined) {
            this.router.navigate(['']);
            return;
        }

        this.pluginService.validateSelectedPlugin();

        if (this.settingsService.getSetting('activate_build_api').value) {
            this.buildInfo$ = this.buildApiService.getBuildInfo().pipe(
                catchError(err => {
                    this.buildInfoError = err;
                    throw err;
                }),
                tap(buildInfo => {
                    this.buildOs = Object.keys(buildInfo.os)[0];
                    this.buildArch = buildInfo.os[this.buildOs][0];
                }),
            );

            this.buildSourceInfo$ = this.buildApiService.getSourceInfo().pipe(
                catchError(err => {
                    this.buildSourceInfoError = err;
                    throw err;
                }),
                map((sourceInfo: SourceInfo) => {
                    return sourceInfo.head === this.pluginService.getGitSha()!;
                }),
            );
        }
    }

    changeOs(buildInfo: BuildInfo): void {
        this.buildArch = buildInfo.os[this.buildOs][0];
    }

    build(): void {
        this.buildError = undefined;
        this.buildLoading = true;
        this.buildApiService.buildGetResultLink(
            this.buildOs,
            this.buildArch,
            this.pluginService.getSelectedPlugins(),
        ).pipe(
            catchError(err => {
                this.buildLoading = false;
                this.buildError = err;
                throw err;
            }),
        ).subscribe((build_id: string) => {
            this.buildLoading = false;
            this.buildResultLink = build_id;
        });
    }

    newBuild(): void {
        this.buildError = undefined;
        this.buildLoading = false;
        this.buildResultLink = undefined;
    }
}
