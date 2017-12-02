import { Injectable } from '@angular/core';

import { HttpService } from './HttpService';
import { LoginInfo } from '../domain/LoginInfo';

import { Url } from "./url";

@Injectable()
export class IdentityRepository{

    // Constructor
    constructor(private httpService:HttpService) { }


    //  Method
    public login(loginInfo:LoginInfo){

        let url = Url + "/api/cc/v2/identity/login";
        let body = loginInfo;

        let result =
            this.httpService.post(url, loginInfo)
                .map( res => res.json());

        return result;
    }

    public getStage(){
        let url = Url + "/api/cc/v2/env/stage/time";
        let body = "";

        let result =
            this.httpService.post(url, body)
                .map( res => res.json());

        return result;
    };

    public updateStage(){
        let url = Url + "/api/cc/v2/env/stage/product";
        let body = "";

        let result =
            this.httpService.post(url, body);

        return result;
    };
}