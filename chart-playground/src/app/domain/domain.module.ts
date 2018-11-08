import { NgModule } from '@angular/core';
import { AccessModule } from "../access/access.module";

import { ChartPlaygroundContext } from './ChartPlaygroundContext'



@NgModule({
  imports: [
    AccessModule
  ],
  declarations: [

  ],
  providers: [
    ChartPlaygroundContext
  ]
})
export class DomainModule { }
