import { Component, Input, OnInit } from '@angular/core';
import { MonacoEditorConstructionOptions, MonacoEditorLoaderService } from '@materia-ui/ngx-monaco-editor';
import { filter, take } from 'rxjs';
import { tomlLanguage } from 'src/app/shared/languages/toml.language';
import { Plugin } from 'src/app/shared/plugin/plugin';

@Component({
    selector: 'app-advanced-config-editor',
    templateUrl: './advanced-config-editor.component.html',
    styleUrls: ['./advanced-config-editor.component.scss']
})
export class AdvancedConfigEditorComponent implements OnInit {
    editorOptions: MonacoEditorConstructionOptions = {
        theme: 'vs-dark',
        language: 'toml',
        minimap: {enabled: false},
    };

    @Input()
    plugin?: Plugin;

    constructor(private monacoLoaderService: MonacoEditorLoaderService) {
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
