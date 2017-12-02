import { NgModule } from '@angular/core';
import { AccessModule } from "../access/AccessModule.module";

import { CCContext } from './CCContext';



@NgModule({
  imports: [
    AccessModule
  ],
  declarations: [

  ],
  providers: [
    CCContext
  ]
})
export class DomainModule { }
