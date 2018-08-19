import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardGeneral } from './services/auth-guard-general.service';
import { AnonimousGuard } from './services/anonimous-guard.service';
import { AppSummaryComponent } from './components/app-summary.component';
import { AppLoginComponent } from './components/app-login.component';
import { AppInitializeComponent } from './components/app-initialize.component';
import { AppDataComponent } from './components/app-data.component';

export const APP_ROUTES: Routes = [
	{path: 'login', component: AppLoginComponent, canActivate: [AnonimousGuard]},
	{path: 'initialize', component: AppInitializeComponent, canActivate: [AnonimousGuard]},
	{path: 'summary', component: AppSummaryComponent, canActivate: [AuthGuardGeneral]},
	{path: 'data', component: AppDataComponent, canActivate: [AuthGuardGeneral]},
	{path: '', redirectTo: 'login', pathMatch: 'full'},
	{path: '**', redirectTo: 'login'}
];

/**
 * Application routing module.
 */
@NgModule({
	imports: [ RouterModule.forRoot(APP_ROUTES) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}