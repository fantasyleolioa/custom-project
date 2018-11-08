import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
// import { JwtModule } from '@auth0/angular-jwt';
import { ToasterModule } from 'angular2-toaster';
import { ThemeModule } from "../@theme/theme.module";

// import { HttpModule } from "@angular/http";
import { HttpService } from "./httpService.service";
import { DataRepository } from "./dataRepository";


import { environment } from "../../environments/environment";


@NgModule({
  imports: [
    HttpClientModule,
    ToasterModule.forChild()
  ],
  declarations: [
  ],
  providers: [
    HttpService,
    DataRepository,
  ]
})
export class AccessModule {
}
