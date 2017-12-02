import { Injectable } from '@angular/core';

import { HttpService } from './HttpService';
import { Application } from '../domain/Application';
import { Action } from '../domain/Action';
import { UpdateModuleInfo } from '../domain/UpdateModuleInfo';
import { BehaviorState } from '../domain/BehaviorState';
import { UpdateActionInfo } from '../domain/UpdateActionInfo';
import { DisableActionInfo } from '../domain/DisableActionInfo';

import { Url } from "./url";

@Injectable()
export class ApplicationRepository {

    // Constructor
    constructor(private httpService: HttpService) { }

    // Methods
    // Get
    public GetAllApp() {

        const url = Url + '/api/cc/v2/app/query';
        const body = {};

        const result =
            this.httpService.post(url, body)
                .map( res => res.json());

        return result;
    }

    public GetAlllModuleById(appId: string) {

        const url = Url + '/api/cc/v2/app/query/module';
        const body = {'id': appId };

        const result =
            this.httpService.post(url, body)
                .map( res => res.json());

        return result;
    }

    public GetAllActionById(appId: string, moduleId: string, actionId: string) {

        const url = '';
        const body = {'appId': appId, 'moduleId': moduleId, 'actionId': actionId };

        const result =
            this.httpService.post(url, body)
                .map( res => res.json());

        return result;
    }

    public GetAppById(appId: string) {

        const url = Url + '/api/cc/v2/app';
        const body = {'id': appId };

        const result =
            this.httpService.post(url, body)
                .map( res => res.json());

        return result;
    }

    public GetMdouleById(appId: string, moduleId: string) {

        const url = '';
        const body = {'appId': appId, 'moduleId': moduleId };

        const result =
            this.httpService.post(url, body)
                .map( res => res.json());

        return result;
    }

    public GetCascadeById(appId: string, moduleId: string) {

        const url = '';
        const body = { "appId": appId, 'moduleId': moduleId };

        const result =
            this.httpService.post(url, body)
                .map( res => res.json());

        return result;
    }

    public GetFILSetting() {

        const url = Url + '/api/cc/v2/ca/setting';
        const body = { "appId": 'FIL', 'moduleId': 'FIL', 'ERPIdKey':'ERPID', 'ERPUriKey': "ERPUri" };

        const result =
            this.httpService.post(url, body)
                .map( res => res.json());

        return result;
    }

    public GetAppToken(sysId: string) {

        const url = Url + '/api/cc/v2/app/token';
        const body = {'id': sysId };

        const result =
            this.httpService.post(url, body)
                .map( res => res.json());

        return result;
    }

    // Update & Add
    public AddOrUpdateModule(moduleInfo: UpdateModuleInfo) {

        const url = Url + '/api/cc/v2/app/module/update';
        const body = moduleInfo;

        const result =
            this.httpService.post(url, body);

        return result;
    }

    public AddOrUpdateAction(actionInfo: UpdateActionInfo) {

        const url = Url + '/api/cc/v2/app/action/update';
        const body = actionInfo;

        const result =
            this.httpService.post(url, body);


        return result;
    }

    public UpdateCondition(target: BehaviorState) {

        const url = Url + '/api/cc/v2/app/condition/update';
        const body = target;

        const result =
            this.httpService.post(url, body);


        return result;
    }

    public UpdateFILSetting(erpId: string, erpUri: string) {

        const url = Url + '/api/cc/v2/ca/setting/update';
        const body = {'appId': 'FIL', 'moduleId': 'FIL', 'ERPIdKey':'ERPID', 'ERPUriKey': "ERPUri", 'ERPIdValue': erpId, 'ERPUriValue': erpUri };

        const result =
            this.httpService.post(url, body);


        return result;
    }

    public RefreshAppToken(sysId: string) {

        const url = Url + '/api/cc/v2/app/token/refresh';
        const body = { "id": sysId };

        const result =
            this.httpService.post(url, body);

        return result;
    }

    // Disabled & Remove
    public DisabledModuleById(appId: string, moduleId: string, hash: string) {

        const url = Url + '/api/cc/v2/app/module/disable';
        const body = {
            'id': moduleId,
            'appId': appId,
            'hash': hash};

        const result =
            this.httpService.post(url, body);

        return result;
    }

    public RemoveCondition(target: BehaviorState) {

        const url = Url + '/api/cc/v2/app/condition/remove';
        const body = target;

        const result =
            this.httpService.post(url, body);


        return result;
    }

    public DisableAction(actionInfo: DisableActionInfo) {

        const url = Url + '/api/cc/v2/app/action/disable';
        const body = actionInfo;

        const result =
            this.httpService.post(url, body);


        return result;
    }


    // Application Account Setting
    public getAllAccountSetting() {
        const url = Url + '/api/cc/v2/app/counting/querycounter';
        const body = '';

        const result =
            this.httpService.post(url, body)
                .map( res => res.json());

        return result;
    }

    public getAccountingUserById(countingId: string) {
        const url = Url + '/api/cc/v2/app/counting/query';
        const body = { "countingId": countingId };

        const result =
            this.httpService.post(url, body)
                .map( res => res.json());

        return result;
    }

    public updateAccountingUser(countingId: string, userIds: string[]) {
        const url = Url + '/api/cc/v2/app/counting/update';
        const body = { "countingId": countingId, 'user': userIds };

        const result =
            this.httpService.post(url, body);

        return result;
    }
}

