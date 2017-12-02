import { Injectable } from '@angular/core';

import { ApplicationRepository } from '../access/ApplicationRepository';
import { RoleRepository } from '../access/RoleRepository';
import { UserRepository } from '../access/UserRepository';
import { OrganizationRepository } from '../access/OrganizationRepository';
import { IdentityRepository } from '../access/IdentityRepository';
import { AuthRepository } from '../access/AuthRepository';
import { PlatformRepository } from '../access/PlatformRepository';
import { SystemRepository } from "../access/SystemRepository";

@Injectable()
export class CCContext {

    constructor(
        public ApplicationRepository: ApplicationRepository,
        public RoleRepository: RoleRepository,
        public UserRepository: UserRepository,
        public OrganizationRepository: OrganizationRepository,
        public IdentityRepository:IdentityRepository,
        public AuthRepository:AuthRepository,
        public PlatformRepository: PlatformRepository,
        public SystemRepository: SystemRepository
    ) { }
}

