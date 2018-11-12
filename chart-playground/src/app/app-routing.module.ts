import { NgModule } from '@angular/core';
import { ExtraOptions, Routes, RouterModule } from '@angular/router';


const routes: Routes = [
	{ path: 'pages', loadChildren: './pages/pages.module#PagesModule' },
	{ path: '', redirectTo: 'pages/charts', pathMatch: 'full' },
	{ path: '**', redirectTo: 'pages/charts' },
];

const config: ExtraOptions = {
	scrollPositionRestoration: 'enabled',
	useHash: true
};

@NgModule({
	imports: [RouterModule.forRoot(routes, config)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
