import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Plugin } from 'src/app/shared/plugin/plugin';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-plugin-list',
    templateUrl: './plugin-list.component.html',
    styleUrls: ['./plugin-list.component.scss']
})
export class PluginListComponent implements OnInit {
    @Input()
    mandatoryPlugins?: Plugin[];

    @Input()
    optionalPlugins?: string[];

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

    searchedOptionalPlugins?: string[];

    addingPlugin = false;
    searchControl!: FormControl;

    constructor() { }

    ngOnInit(): void {
        this.searchedOptionalPlugins = this.optionalPlugins;

        this.searchControl = new FormControl('')
        this.searchControl.valueChanges.pipe(
            debounceTime(200),
            distinctUntilChanged()
        ).subscribe(query => {
            this.searchedOptionalPlugins = this.optionalPlugins!.filter(
                plugin => plugin.includes(query)
            );
        });
    }
}
