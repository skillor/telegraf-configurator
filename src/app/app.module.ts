import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { PluginListComponent } from './components/plugin-list/plugin-list.component';
import { AdvancedConfigEditorComponent } from './components/advanced-config-editor/advanced-config-editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule, MONACO_PATH } from '@materia-ui/ngx-monaco-editor';
import { SettingsComponent } from './pages/settings/settings.component';
import { SetupComponent } from './setup/setup.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        PluginListComponent,
        AdvancedConfigEditorComponent,
        SettingsComponent,
        SetupComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MonacoEditorModule,
    ],
    providers: [{
        provide: MONACO_PATH,
        useValue: 'https://unpkg.com/monaco-editor@0.33.0/min/vs'
    }],
    bootstrap: [AppComponent]
})
export class AppModule { }
