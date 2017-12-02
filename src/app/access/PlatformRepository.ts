import {Injectable} from '@angular/core';

import {HttpService} from './HttpService';
import {RoleInfo} from '../domain/RoleInfo';

import {Url} from "./url";
import {UpdatedSimplePermission} from "../pages/authTree/domain/UpdatedSimplePermission";

@Injectable()
export class PlatformRepository {

    // Constructor
    constructor(private httpService: HttpService) {
    }

    /**
     * 获取指定的角色信息
     * @returns {Observable<any>}
     * @constructor
     */
    public GetPlatformRole(roleId) {
        const url = Url + '/api/cc/v2/platform/role';
        const body = {
            id: roleId
        };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }


    public GetRolePolicy(roleId: string) {
        const url = Url + '/api/cc/v2/platform/role/policy';
        const body = {'id': roleId};

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    /**
     * 更新指定用户的名称
     * @param role {id, name, hash}
     * @returns {Observable<any>}
     * @constructor
     */
    public UpdateRole(role: any) {
        const url = Url + '/api/cc/v2/platform/role/update';
        const body = role;

        const result =
            this.httpService.post(url, body).map(res => res.json());

        return result;
    }

    /**
     * 更新指定用户的名称
     * @param role {roleId: string, userIds: string[]}
     * @returns {Observable<any>}
     * @constructor
     */
    public UpdateRoleUsers(role: any) {
        const url = Url + '/api/cc/v2/platform/role/updateuser';
        const body = role;

        const result =
            this.httpService.post(url, body);

        return result;
    }

    /**
     * 停用指定角色
     * @returns {Observable<any>}
     * @constructor
     */
    public DisableRole(roleId: string, hash: string) {

        const url = Url + '/api/cc/v2/platform/role/disable';
        const body = {'id': roleId, 'hash': hash};

        const result = this.httpService.post(url, body);

        return result;
    }

    /**
     * 获取全部有管理员权限的角色
     * @returns {Observable<any>}
     * @constructor
     */
    public GetAllAdminRole(): any {
        const url = Url + '/api/cc/v2/platform/role/getAllRole';
        const body = {};

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    /**
     * 获取指定角色的全部用户
     * @returns {Observable<any>}
     * @constructor
     */
    public GetRoleAllUsers(roleID): any {
        const url = Url + '/api/cc/v2/platform/role/userinrole';
        const body = {
            roleId: roleID || ''
        };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    /**
     * 获取指定角色的全部用户
     * @returns {Observable<any>}
     * @constructor
     */
    public GetRoleAllUsersWithCondition(roleID, _content, _pageNumber): any {
        const url = Url + '/api/cc/v2/platform/role/userinrole/checked';
        const body = {
            roleId: roleID || '',
            content: _content || '',
            pageCount: 10,
            pageNumber: _pageNumber || 1
        }

        const result =
            this.httpService.post(url, body).map(res => res.json());

        return result;
    }

    /**
     * 获取指定角色的应用权限
     * @returns {Observable<any>}
     * @constructor
     */
    public GetRoleAppPolicy(roleID): any {
        const url = Url + '/api/cc/v2/platform/role/apppolicy';
        const body = {
            id: roleID || ''
        }

        const result =
            this.httpService.post(url, body).map(res => res.json());

        return result;
    }

    /**
     * 获取指定角色的应用权限
     * @returns {Observable<any>}
     * @constructor
     */
    public UpdateRoleAppPolicy(target: UpdatedSimplePermission): any {
        const url = Url + '/api/cc/v2/platform/role/apppolicy/update';
        const body = target;

        const result =
            this.httpService.post(url, body);
        //.map(res => res.json());
        return result;
    }

    /**
     * 获取指定角色的组织权限信息
     * @returns {Observable<any>}
     * @constructor
     */
    public GetRoleOrgPolicy(roleId: string): any {
        const url = Url + '/api/cc/v2/platform/role/orgpolicy';
        const body = {
            id: roleId || ''
        };

        const result =
            this.httpService.post(url, body).map(res => res.json());
        return result;
    }

    /**
     * 获取指定角色的组织权限信息
     * @returns {Observable<any>}
     * @constructor
     */
    public UpdateRoleOrgPolicy(target: any): any {
        const url = Url + '/api/cc/v2/platform/role/orgpolicy/update';
        const body = target || {};

        const result =
            this.httpService.post(url, body); // .map(res => res.json());
        return result;
    }

    /**
     * 获取组织分类
     * @returns {Observable<any>}
     * @constructor
     */
    public GetOrgCatalog(): any {
        const url = Url + '/api/cc/v2/platform/orgcatalog';
        const body = {};

        const result =
            this.httpService.post(url, body).map(res => res.json());
        return result;
    }

    /**
     * 获取指定组织分类的组织树
     * @returns {Observable<any>}
     * @constructor
     */
    public GetOrgTreeByCatalog(id: string): any {
        const url = Url + '/api/cc/v2/platform/orgcatalog/getallaspect';
        const body = {
            id: id || ''
        };

        const result =
            this.httpService.post(url, body).map(res => res.json());
        return result;
    }

    /**
     * 获取指定组织树的组织
     * @param target {roleId, aspectId}
     * @returns {Observable<any>}
     * @constructor
     */
    public GetOrgPolicy(target: any): any {
        const url = Url + '/api/cc/v2/platform/role/orgpolicywithallorg';
        const body = target || {};

        const result =
            this.httpService.post(url, body).map(res => res.json());
        return result;
    }
}

