import { Injectable } from '@angular/core';

import { HttpService } from './HttpService';
import { OrgInfo } from '../domain/OrgInfo';
import { BasicMetadata } from '../domain/BasicMetadata';
import { OrgAspect } from '../domain/OrgInfo';
import { RequestedOrgTreeBody } from "../domain/DataPolicy";

import { UpdateUserInOrganizationInfo } from '../domain/UpdateUserInOrganizationInfo';

import { Url } from "./url";

@Injectable()
export class OrganizationRepository {

    // Constructor
    constructor(private httpService: HttpService) { }

    // Methods
    // Get
    public GetOrgById(id: string) {

        const url = Url + '/api/cc/v2/org';
        const body = { 'id': id };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetAllOrgCatalog() {

        const url = Url + '/api/cc/v2/org/catalog';
        const body = '';

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetAllOrgTag() {

        const url = Url + '/api/cc/v2/org/tag/query';
        const body = '';

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetAllOrgTagChecked(userId:string) {

        const url = Url + '/api/cc/v2/org/tag/query/checked';
        const body = { 'id':userId };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetOrgAspectByCatalogId(id: string) {

        const url = Url + '/api/cc/v2/org/catalog/query';
        const body = { 'id': id };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetAllOrgByOrgAspectId(id: string) {

        const url = Url + '/api/cc/v2/org/aspect';
        const body = { 'id': id };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetUserInOrgByOrdId(id: string) {

        const url = Url + '/api/cc/v2/org/userinorg';
        const body = { 'id': id };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetOrgTreeByCatalogId(id: string) {

        const url = Url + '/api/cc/v2/org/query/cascade';
        const body = { 'id': id };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetAllDisabledOrg(pageNumber: number, orgId: string, orgName: string) {

        const url = Url + '/api/cc/v2/org/query/disabled';
        const body = {'pageCount': 20, 'pageNumber': pageNumber, 'id': orgId, 'name': orgName   };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetOrgSourceTree(orgCatalogId: string, orgAspectId: string, userId: string) {

        const url = Url + '/api/cc/v2/org/query/cascade/checked';
        const body = { "orgCatalogId": orgCatalogId, "orgAspectId":orgAspectId, 'userId': userId };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetOrgSourceTreeById(orgCatalogId: string) {

        const url = Url + '/api/cc/v2/org/catalog/query/cascade';
        const body = { 'id': orgCatalogId };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetOrganizationAspect(orgId: string) {

        const url = Url + '/api/cc/v2/org/aspect';
        const body = { 'id': orgId };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetOrgTreeByPolicy(target:RequestedOrgTreeBody){
        let url = Url + "/api/cc/v2/datapolicy/query/org/checked/withouteffect";
        let body = target;

        let result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetOrgTagTreeByPolicy(target:RequestedOrgTreeBody){
        let url = Url + "/api/cc/v2/datapolicy/query/orgtag/checked/withouteffect";
        let body = target;

        let result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetOrgTypeTreeByPolicy(target:RequestedOrgTreeBody){
        let url = Url + "/api/cc/v2/datapolicy/query/orgtype/checked/withouteffect";
        let body = target;

        let result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }


    // Update
    public UpdateOrganization(updateOrg: OrgInfo) {

        const url = Url + '/api/cc/v2/org/update';
        const body = updateOrg;

        const result =
            this.httpService.post(url, body);

        return result;
    }

    public UpdateOrgCatalog(updateOrgCatalog: BasicMetadata) {

        const url = Url + '/api/cc/v2/org/catalog/update';
        const body = updateOrgCatalog;

        const result =
            this.httpService.post(url, body);

        return result;
    }

    public UpdateOrgAspect(updateOrgAspect) {

        const url = Url + '/api/cc/v2/org/aspect/update';
        const body = updateOrgAspect;

        const result =
            this.httpService.post(url, body);

        return result;
    }

    // Others
    public DisableOrganization(id: string, hash: string) {

        const url = Url + '/api/cc/v2/org/disable';
        const body = { 'id': id, 'hash': hash };

        const result =
            this.httpService.post(url, body);

        return result;
    }

    public DisableOrgAspect(id: string, hash: string) {

        const url = Url + '/api/cc/v2/org/aspect/disable';
        const body = { 'id': id, 'hash': hash };

        const result =
            this.httpService.post(url, body);

        return result;
    }

    public DisableCatalog(id: string, hash: string) {

        const url = Url + '/api/cc/v2/org/catalog/disable';
        const body = { 'id': id, 'hash': hash };

        const result =
            this.httpService.post(url, body);

        return result;
    }

    public EnableOrganization(org) {

        const url = Url + '/api/cc/v2/org/enable';
        const body = org;

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }


    public UpdateUserInOrganization(updateUserInOrganizationInfo: UpdateUserInOrganizationInfo) {

        const url = Url + '/api/cc/v2/org/userinorg/update';
        const body = updateUserInOrganizationInfo;

        const result = this.httpService.post(url, body);

        return result;
    }


}


