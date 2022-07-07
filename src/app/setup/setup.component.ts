import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PluginService } from '../shared/plugin/plugin.service';

@Component({
    selector: 'app-setup',
    templateUrl: './setup.component.html',
    styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public pluginService: PluginService,
    ) { }

    ngOnInit(): void {
        if (this.pluginService.hasUnsavedChanges()) {
            const confirmation = confirm('You have unsaved changes! Are you sure you want to discard them?');
            if (!confirmation) {
                this.router.navigate(['home']);
                return;
            }
        }

        this.pluginService.loadSampleConfs().subscribe(() => {
            this.route.queryParams.subscribe(
                (params: {[key: string]: string}) => {
                    this.pluginService.load(params);
                    this.router.navigate(['home']);
                }
            )
        });
    }

}
