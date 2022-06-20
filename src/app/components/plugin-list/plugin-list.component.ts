import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Plugin } from 'src/app/shared/plugin/plugin';

@Component({
    selector: 'app-plugin-list',
    templateUrl: './plugin-list.component.html',
    styleUrls: ['./plugin-list.component.scss']
})
export class PluginListComponent implements OnInit {
    @Input()
    plugins?: string[];

    @Input()
    selectedPlugin?: Plugin;

    @Input()
    selectedPlugins?: Plugin[] = [];

    @Output()
    public selectPlugin = new EventEmitter<Plugin>();

    @Output()
    public addPlugin = new EventEmitter<string>();

    @Output()
    public removePlugin = new EventEmitter<Plugin>();

    addingPlugin = false;

    constructor() { }

    ngOnInit(): void {
    }
}
