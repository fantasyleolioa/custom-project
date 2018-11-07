import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  { path: '', redirectTo: 'pages/custom/tab', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages/custom/tab' },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
