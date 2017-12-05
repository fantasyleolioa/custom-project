import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { routing } from './custom.routing';

import { TreeModule } from "../TreeModule/treeModule.module";

import { CustomComponent } from './custom.component';
import { TabComponent } from "./components/TabComponent/tab.component";
import { TabContent1Component } from "./components/TabComponent/tabContent1/tabContent1.component";
import { TabContent2Component } from "./components/TabComponent/tabContent2/tabContent2.component";
import { TreeComponent } from "./components/TreeComponent/tree.component";
import { AuthDemoComponent } from "./components/TreeComponent/components/authDemo/authDemo.component";
import { NormalDemoComponent } from "./components/TreeComponent/components/normalDemo/normalDemo.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    TreeModule,
    routing
  ],
  declarations: [
    CustomComponent,
    TabComponent,
    TabContent1Component,
    TabContent2Component,
    TreeComponent,
    AuthDemoComponent,
    NormalDemoComponent
  ],
  providers: [
  ]
})
export class CustomModule {}
