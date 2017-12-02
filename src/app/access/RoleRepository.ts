import { Injectable } from '@angular/core';

import { HttpService } from './HttpService';
import { RoleInfo } from '../domain/RoleInfo';

import { Url } from "./url";

@Injectable()
export class RoleRepository {

    // Constructor
    constructor(private httpService: HttpService) { }

    // Methods
    // Get
    public GetAllRole(){
        const url = Url + "/api/cc/v2/role/query/cascade";
        const body = {};

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    };

    public GetAllRoleByPage(pageNumber: number, roleId: string, roleName: string){
        const url = Url + "/api/cc/v2/role/query/page";
        const body = { "queryParameter":{ "type": "enabled" }, "pageCount": 10, 'pageNumber': pageNumber, 'id': roleId, 'name': roleName };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    };

    public GetRoleById(roleId:string) {

        const url = Url + "/api/cc/v2/role";
        const body = {"id" : roleId};

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    };

    public GetRoleByCatalogId(roleCatalogId:string){

        const url = Url + "/api/cc/v2/role/catalog/query";
        const body = {"id" : roleCatalogId};

        const result =
            this.httpService.post(url, body)
                .map(res => res.json())
                .map(
                    (response) => {

                        return response;
                    }
                );

        return result;
    };

    public GetRoleInUser(userId: string) {

        const url = Url + "/api/cc/v2/user/role";
        const body = { "id": userId };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    };

    public GetAllRoleCatalog(){
        const url = Url + "/api/cc/v2/role/catalog";
        const body = {};

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    };

    public QueryRole(type: string) {

        const url = Url + "/api/cc/v2/role/query";
        const body = { "queryParameter": { "type": type } };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    };

    public QueryDisabledRole(pageNumber:number,  roleId:string, roleName:string) {

        const url = Url + "/api/cc/v2/role/query";
        const body = { "queryParameter": { "type": "disabled" }, "pageCount":20, "pageNumber":pageNumber, "id":roleId, "name":roleName   };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    };

    public GetRoleSourceTree(userId:string){

        const url = Url + "/api/cc/v2/role/query/cascade/checked";
        const body = {"id":userId };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    };

    // Update
    public UpdateRole(updatedRoleInfo: RoleInfo) {

        const url = Url + "/api/cc/v2/role/update";
        const body = updatedRoleInfo;

        const result = this.httpService.post(url, body);

        return result;
    };

    public UpdateRoleCatalog(roleCatalogId:string, roleCatalogName:string, hash:string ) {

        const url = Url + "/api/cc/v2/role/catalog/update";
        const body = { "id":roleCatalogId, "name":roleCatalogName, "hash":hash };

        const result = this.httpService.post(url, body);


        return result;
    };

    public UpdateUserInRole(associationInfo:EditedRoleInfo){

        const url = Url + "/api/cc/v2/association/role/updateuser";
        const body = associationInfo;

        const result = this.httpService.post(url, body);


        return result;
    };

    // Others
    public DisableRole(roleId: string, hash: string) {

        const url = Url + "/api/cc/v2/role/disable";
        const body = { "id": roleId, "hash": hash };

        const result = this.httpService.post(url, body);

        return result;
    };

    public DisableRoleCatalog(roleCatalogId: string, hash: string){

        const url = Url + "/api/cc/v2/role/catalog/disable";
        const body = { "id": roleCatalogId, "hash": hash };

        const result =
            this.httpService.post(url, body);

        return result;
    };

    public EnableRole(roleId: string,catalogId:string) {

        const url = Url + "/api/cc/v2/role/enable";
        const body = {
            "id": roleId,
            "catalogId":catalogId
        };

        const result =
            this.httpService.post(url, body);

        return result;
    };

    public QueryRoleCatalog(catalogId:string){
        const url = Url + "/api/cc/v2/role/catalog/query";
        const body = { "id": catalogId};

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    };
}


export class EditedRoleInfo{
    roleId:string;
    userIds: Array<string>;

    constructor(){
        this.roleId = "";
        this.userIds = [];
    }
};




