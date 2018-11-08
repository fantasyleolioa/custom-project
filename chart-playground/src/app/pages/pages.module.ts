import { NgModule } from '@angular/core';
import { ToasterModule } from 'angular2-toaster';

import { PagesComponent } from './pages.component';
import { ThemeModule } from '../@theme/theme.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ChartsComponent } from './charts/charts.component';


const PAGES_COMPONENTS = [
  PagesComponent,
  ChartsComponent,
];

@NgModule({
  imports: [
    ThemeModule,
    PagesRoutingModule,
    ToasterModule.forChild(),
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}
