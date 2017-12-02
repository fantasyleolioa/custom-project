import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { routing } from './console.routing';

import { ConsoleComponent } from './console.component';
import { tabTestComponent } from "./tabContent/tabTest.component";



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing
  ],
  declarations: [
    ConsoleComponent,
    tabTestComponent
  ],
  providers: [
  ]
})
export class ConsoleModule {}
