import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { PluginListComponent } from './components/plugin-list/plugin-list.component';
import { AdvancedConfigEditorComponent } from './components/advanced-config-editor/advanced-config-editor.component';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PluginListComponent,
    AdvancedConfigEditorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MonacoEditorModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
