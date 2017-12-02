import { Injectable } from '@angular/core';

import { HttpService } from './HttpService';
import { UpdateSysInfo, UpdateSysSetting } from '../domain/SysInfo';

import { Url } from "./url";

@Injectable()
export class SystemRepository {

    // Constructor
    constructor(private httpService: HttpService) { }


    // Get
    public GetSettingValue(sysId: string) {

        const url = Url + '/api/cc/v2/sys/setting';
        const body = {'sysId': sysId };

        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetAllSys() {

        const url = Url + '/api/cc/v2/sys';
        const body = '';


        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }

    public GetAllSysCategory() {

        const url = Url + '/api/cc/v2/sys/syscategory/query';
        const body = '';


        const result =
            this.httpService.post(url, body)
                .map(res => res.json());

        return result;
    }


    // Update & Delete
    public UpdateSys(sysInfo: UpdateSysInfo) {

        const url = Url + '/api/cc/v2/sys/update';
        const body = sysInfo;


        const result =
            this.httpService.post(url, body);

        return result;
    }

    public UpdateSetting(setting: UpdateSysSetting) {

        const url = Url + '/api/cc/v2/sys/setting/update';
        const body = setting;


        const result =
            this.httpService.post(url, body);

        return result;
    }

    public DisabledSys(sysId: string, hash: string) {

        const url = Url + '/api/cc/v2/sys/disable';
        const body = {'id': sysId, 'hash': hash };
        console.log(body);

        const result =
            this.httpService.post(url, body);

        return result;
    }

}
