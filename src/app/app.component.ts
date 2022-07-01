import { Component, HostListener, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler() {
        return false;
    }

    constructor(
    ) { }

    ngOnInit(): void {
    }
}
