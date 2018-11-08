import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { ToasterService, Toast, BodyOutputType, OnActionCallback } from 'angular2-toaster';
import { SpinnerService } from "../@theme/services/spinner.service";



@Injectable()
export class HttpService {
    // constructor
    constructor(private http: HttpClient, private toasterService:ToasterService, private router:Router, private spinner: SpinnerService) { }


    // methods
    public get(_baseUrl: string, isResponse?: boolean): Observable<any> {

        if(isResponse){
            return this.http.get(_baseUrl, { observe: 'response' })
                        .pipe(
                            catchError(error => this.handleError(error))
                        );
        }else {
            return this.http.get(_baseUrl)
                        .pipe(
                            catchError(error => this.handleError(error))
                        );
        }
    }

    public post(_baseUrl: string, _body: Object): Observable<any> {

        let body = JSON.stringify(_body);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post(_baseUrl, body, { headers: headers })
                        .pipe(
                            catchError(error => this.handleError(error))
                        );
    }

    public put(_baseUrl: string, _body: Object): Observable<any> {

        let body = JSON.stringify(_body);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.put(_baseUrl, body, { headers: headers });
    }

    public delete(_baseUrl: string): Observable<any> {

        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.delete(_baseUrl, { headers: headers });
    }

    private handleError(error: any) {
        
        if(error.status != 401) return throwError(error);

        if(error.status === 401 || error.error.message === 'Token is expired'){
            
            this.spinner.show();
            this.makeToast(
                'token逾時，請重新登入',
                'error',
                () => {
                    this.spinner.hide();
                    localStorage.clear(); 
                    this.router.navigate(['/login']);
                }
            );
        }

        return throwError(error);
    }

    // toaster
	private makeToast(body: string, type: string, hideCallback: OnActionCallback) {
		const toastDetail: Toast = {
			type: type,
			body: body,
			timeout: 0,
			showCloseButton: true,
			bodyOutputType: BodyOutputType.TrustedHtml,
			onHideCallback: hideCallback
		};

		this.toasterService.pop(toastDetail)
	}
}