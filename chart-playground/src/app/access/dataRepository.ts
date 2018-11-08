import { Injectable } from '@angular/core';

import { HttpService } from './httpService.service';
import { environment } from "../../environments/environment";


@Injectable()
export class DataRepository {

    constructor(private httpService: HttpService) {
    }


    // method
    getDashboardData(userId: string) {
        let url = environment.url + '/dashboard/';
        let body = { 'user': userId};

        let result =
            this.httpService.post(url, body);

        return result;
    }

    getAdsFlowData(userId :string){
        let url = environment.url + '/dashboard/';
        let body = { 'user': userId};

        let result =
            this.httpService.post(url, body);

        return result;
    }

    getAdsQualityData(userId: string) {
        let url = environment.url + '/dashboard/';
        let body = { 'user': userId};

        let result =
            this.httpService.post(url, body);

        return result;
    }

    getAdsCostData(userId: string) {
        let url = environment.url + '/dashboard/';
        let body = { 'user': userId};

        let result =
            this.httpService.post(url, body);

        return result;
    }

    getAdsResultData(userId: string) {
        let url = environment.url + '/dashboard/';
        let body = { 'user': userId};

        let result =
            this.httpService.post(url, body);

        return result;
    }
}