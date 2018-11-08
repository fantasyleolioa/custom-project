import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { ChartsComponent } from './charts/charts.component';


const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
    {
      path: 'charts',
      component: ChartsComponent,
    },
    // {
    //   path: 'memberManagement',
    //   loadChildren: './memberManagement/member.module#MemberModule',
    // }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}