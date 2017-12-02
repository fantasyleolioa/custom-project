import { Routes, RouterModule }  from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'custom/tab', pathMatch: 'full' },
      { path: 'custom', loadChildren: './custom/custom.module#CustomModule' },
    ],
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
