import { Component, Input, OnInit } from '@angular/core';
import { MonacoEditorConstructionOptions, MonacoEditorLoaderService } from '@materia-ui/ngx-monaco-editor';
import { filter, take } from 'rxjs';
import { tomlLanguage } from 'src/app/shared/languages/toml.language';
import { Plugin } from 'src/app/shared/plugin/plugin';
import { SettingsService } from 'src/app/shared/settings/settings.service';

@Component({
    selector: 'app-advanced-config-editor',
    templateUrl: './advanced-config-editor.component.html',
    styleUrls: ['./advanced-config-editor.component.scss']
})
export class AdvancedConfigEditorComponent implements OnInit {
    editorOptions: MonacoEditorConstructionOptions = {
        language: 'toml',
        minimap: {enabled: false},
    };

    @Input()
    plugin?: Plugin;

    constructor(
        private monacoLoaderService: MonacoEditorLoaderService,
        private settingsService: SettingsService,
    ) {
        this.editorOptions.theme = this.settingsService.getVsTheme();

        this.monacoLoaderService.isMonacoLoaded$.pipe(
            filter(isLoaded => isLoaded),
            take(1),
        ).subscribe(() => {
            monaco.languages.register({
                id: tomlLanguage.id,
                extensions: tomlLanguage.extensions,
                aliases: tomlLanguage.aliases,
            });
            monaco.languages.setMonarchTokensProvider(tomlLanguage.id, {
                escapes: tomlLanguage.escapes,
                tokenizer: tomlLanguage.tokenizer,
            });
        });
    }

    ngOnInit(): void {
    }

}
