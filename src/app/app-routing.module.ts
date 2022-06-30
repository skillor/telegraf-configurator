import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HomeComponent } from './pages/home/home.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SetupComponent } from './setup/setup.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: SetupComponent,
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'settings',
        component: SettingsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: environment.router_use_hash })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
