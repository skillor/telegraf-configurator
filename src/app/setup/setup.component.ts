import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PluginService } from '../shared/plugin/plugin.service';

@Component({
    selector: 'app-setup',
    templateUrl: './setup.component.html',
    styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {

    constructor(
        private router: Router,
        public pluginService: PluginService,
    ) { }

    ngOnInit(): void {
        this.pluginService.loadSampleConfs().subscribe(() => {
            this.router.navigate(['home']);
        });
    }

}
