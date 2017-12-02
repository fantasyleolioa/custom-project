import { Injectable } from '@angular/core';

import { HttpService } from './HttpService';
import { AddUserInfo } from '../domain/AddUserInfo';
import { UserInfo } from '../domain/UserInfo';
import { DisableUserInfo } from '../domain/DisableUserInfo';
import { UpdateUserOrganizationInfo } from '../domain/UpdateUserOrganizationInfo';
import { UpdateMappingInfo } from '../domain/UserMappingInfo';

import { Url } from "./url";

@Injectable()
export class UserRepository {

    // Constructor
    constructor(private httpService: HttpService) { }

    // Methods
    // Get
    public QueryUser(pageNumber: number, userId: string, userName: string) {

        const url = Url + '/api/cc/v2/user/query';
        const body = { "pageCount": 10, 'pageNumber': pageNumber, 'id': userId, 'name': userName };


        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public QueryDisabledUser(pageNumber: number, userId: string, userName: string) {

        const url = Url + '/api/cc/v2/user/query/disabled';
        const body = {'pageCount': 10, 'pageNumber': pageNumber, 'id': userId, 'name': userName };


        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public QueryUserMetaDataColum(id: string) {

        const url = Url + '/api/cc/v2/usermetadata';
        const body = { "id": id };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public QueryDisabledUserMetaData(id: string) {

        const url = Url + '/api/cc/v2/usermetadata/disabled';
        const body = { "id": id };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public QueryMetaDataColum() {

        const url = Url + '/api/cc/v2/usermetadata/column';
        let body;


        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetUserById(userId: string) {

        const url = Url + '/api/cc/v2/user';
        const body = { 'id': userId };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetAllUser() {

        const url = Url + '/api/cc/v2/user/getAllUser';

        const result =
            this.httpService.post(url, '')
                .map(res => res.json());

        return result;
    }

    public GetUserInRole(roleId: string) {
        const url = Url + '/api/cc/v2/association/userinrole';
        const body = { 'roleId': roleId };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetUserNotInRole(roleId: string) {
        const url = Url + '/api/cc/v2/association/usernotinrole';
        const body = { 'roleId': roleId };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetUserInOrg(userId: string) {

        const url = Url + '/api/cc/v2/user/org';
        const body = { 'id': userId };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetUserMapping(userId: string) {

        const url = Url + '/api/cc/v2/user/mapping';
        const body = { 'id': userId };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetUserInOrgTag(userId:string){

        const url = Url + '/api/cc/v2/user/org/tag';
        const body = { 'userId': userId };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }


    // Update
    public AddUser(AddUserInfo) {

        const url = Url + '/api/cc/v2/user/update';
        const body = AddUserInfo;

        const result =
            this.httpService.post(url, body);

        return result;
    }

    public UpdateUser(UpdateUserInfo) {

        const url = Url + '/api/cc/v2/user/update';
        const body = UpdateUserInfo;

        const result =
            this.httpService.post(url, body);

        return result;
    }

    public UpdatePasswordForce(id: string, hash: string, newPsw: string) {

        const url = Url + '/api/cc/v2/user/update/password/force';
        const body = { 'id': id, 'hash': hash, 'newPasswordHash': newPsw };

        const result =
            this.httpService.post(url, body);

        return result;
    }

    public UpdatePassword(id: string, hash: string, oldPsw: string, newPsw: string) {

        const url = Url + '/api/cc/v2/user/update/password';
        const body = { 'id': id, 'hash': hash, 'oldPasswordHash': oldPsw, 'newPasswordHash': newPsw };

        const result =
            this.httpService.post(url, body);

        return result;
    }

    public UpdateUserOrganization(updateUserOrgInfo: UpdateUserOrganizationInfo) {

        const url = Url + '/api/cc/v2/user/org/update';
        const body = updateUserOrgInfo;

        const result =
            this.httpService.post(url, body);

        return result;
    }

    public UpdateMapping(mappingInfo: UpdateMappingInfo) {

        const url = Url + '/api/cc/v2/identity/mapping';
        const body = mappingInfo;

        const result =
            this.httpService.post(url, body);

        return result;
    }

    public UpdateMappingForce(mappingInfo: UpdateMappingInfo) {

        const url = Url + '/api/cc/v2/identity/mapping/force';
        const body = mappingInfo;

        const result =
            this.httpService.post(url, body);

        return result;
    }

    // Others
    public DisableUser(id: string, hash: string, cause: string) {

        const url = Url + '/api/cc/v2/user/disable';
        const body = { 'id': id, 'hash': hash, 'cause': cause }; ;

        const result =
            this.httpService.post(url, body);

        return result;
    }

    public EnableUser(id: string, cause: string) {

        const url = Url + '/api/cc/v2/user/enable';
        const body = { 'id': id, 'cause': cause };

        const result =
            this.httpService.post(url, body);

        return result;
    }
}
