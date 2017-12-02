import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { routing } from './custom.routing';

import { CustomComponent } from './custom.component';
import { TabComponent } from "./components/TabComponent/tab.component";
import { TabContent1Component } from "./components/TabComponent/tabContent1/tabContent1.component";
import { TabContent2Component } from "./components/TabComponent/tabContent2/tabContent2.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing
  ],
  declarations: [
    CustomComponent,
    TabComponent,
    TabContent1Component,
    TabContent2Component
  ],
  providers: [
  ]
})
export class CustomModule {}
