import { NgModule } from '@angular/core';

import { ApplicationRepository } from './ApplicationRepository';
import { PlatformRepository } from "./PlatformRepository";
import { RoleRepository } from './RoleRepository';
import { UserRepository } from './UserRepository';
import { OrganizationRepository } from './OrganizationRepository';
import { IdentityRepository } from './IdentityRepository';
import { AuthRepository } from './AuthRepository';
import { SystemRepository } from "./SystemRepository";
import { HttpService } from './HttpService';


@NgModule({
  imports: [

  ],
  declarations: [

  ],
  providers: [
    HttpService,
    ApplicationRepository,
    RoleRepository,
    UserRepository,
    OrganizationRepository,
    IdentityRepository,
    AuthRepository,
    PlatformRepository,
    SystemRepository
  ]
})
export class AccessModule { }
