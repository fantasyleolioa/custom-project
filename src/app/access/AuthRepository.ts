import { Injectable } from '@angular/core';

import { HttpService } from './HttpService';

import { UpdatedPermission } from '../pages/authTree/domain/UpdatedPermission';
import { UpdatedSimplePermission } from '../pages/authTree/domain/UpdatedSimplePermission';
import { UpdatedDataPolicy } from "../domain/DataPolicy";

import { Url } from "./url";

@Injectable()
export class AuthRepository {

    // Constructor
    constructor(private httpService: HttpService) { }

    // Method
    // Get
    public GetAllPermission(userId: string, appId: string) {

        const url = Url + '/api/cc/v2/policy/attach/user/all';
        const body = { 'userId': userId, 'appId': appId };

        const result =
            this.httpService.post(url, body)
                .map( res => res.json());

        return result;
    }

    public GetUserPermission(userId: string, appId: string) {

        const url = Url + '/api/cc/v2/policy/attach/user';
        const body = { 'userId': userId, 'appId': appId };

        const result =
            this.httpService.post(url, body)
                .map( res => res.json());

        return result;
    }

    public GetRolePermission(roleId: string, appId: string) {

        const url = Url +  '/api/cc/v2/policy/attach/role';
        const body = { 'roleId': roleId, 'appId': appId };

        const result =
            this.httpService.post(url, body)
                .map( res => res.json());

        return result;
    }

    public GetOrgPermission(orgId: string, appId: string) {

        const url = Url + '/api/cc/v2/policy/attach/org';
        const body = { 'orgId': orgId, 'appId': appId };

        const result =
            this.httpService.post(url, body)
                .map( res => res.json());

        return result;
    }

    public GetAllDatapolicy(userId:string){
        const url = Url + '/api/cc/v2/datapolicy/attach/user/allresult';
        const body = { 'id': userId };

        const result =
            this.httpService.post(url, body)
                .map( res => res.json());

        return result;
    }

    public GetRoleDataPolicy(roleId: string){

        const url = Url + '/api/cc/v2/datapolicy/attach/role/flatten';
        const body = { 'id': roleId };

        const result =
            this.httpService.post(url, body)
                .map( res => res.json());

        return result;
    }


    public GetUserDataPolicy(userId:string){
        const url = Url + '/api/cc/v2/datapolicy/attach/user/flatten';
        const body = { 'id': userId };

        const result =
            this.httpService.post(url, body)
                .map( res => res.json());

        return result;
    }



    // Update
    public UpdateUserPermission(target: UpdatedSimplePermission) {

        const url = Url + '/api/cc/v2/policy/attach/user/update';
        const body = target;

        const result =
            this.httpService.post(url, body);

        return result;
    }

    public UpdateOrgPermission(target: UpdatedSimplePermission) {

        const url = Url + '/api/cc/v2/policy/attach/org/update';
        const body = target;

        const result =
            this.httpService.post(url, body);

        return result;
    }

    public UpdateRolePermission(target: UpdatedSimplePermission) {

        const url = Url + '/api/cc/v2/policy/attach/role/update';
        const body = target;

        const result =
            this.httpService.post(url, body);

        return result;
    }

    public UpdatePolicy(target: UpdatedDataPolicy){

        const url = Url + '/api/cc/v2/datapolicy/update/self';
        const body = target;

        const result =
            this.httpService.post(url, body);

        return result;
    }

    public UpdatePolicyContent(target: UpdatedDataPolicy){

        const url = Url + '/api/cc/v2/datapolicy/update/org';
        const body = target;

        const result =
            this.httpService.post(url, body);

        return result;
    }

    public UpdatePolicyOrgType(target: UpdatedDataPolicy){

        const url = Url + '/api/cc/v2/datapolicy/update/orgType';
        const body = target;

        const result =
            this.httpService.post(url, body);

        return result;
    }


    // Disabled
    public DisabledPolicy(target:UpdatedDataPolicy){

        const url = Url + '/api/cc/v2/datapolicy/disable';
        const body = target;

        const result =
            this.httpService.post(url, body);

        return result;
    }
}

