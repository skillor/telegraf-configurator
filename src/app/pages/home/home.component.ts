import { Component, OnInit } from '@angular/core';
import { Plugin } from 'src/app/shared/plugin/plugin';
import { PluginService } from 'src/app/shared/plugin/plugin.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(public pluginService: PluginService) { }

    ngOnInit(): void {
        this.pluginService.loadSampleConfs().subscribe(
            // x => console.log(x)
        );
    }
}
