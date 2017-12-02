import { Injectable }     from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/rx';


@Injectable() 
export class HttpService {

    // Field
    public userToken: string = '';

    // Constructor
    constructor (private http: Http, private router: Router) {}

    
    // Methods
    public get(_baseUrl: string): Observable<any> {

        return this.http.get(_baseUrl);
    }

    public post(_baseUrl: string, _body: Object): Observable<any> {

        this.userToken = window.sessionStorage.getItem('userToken');
        
        const body = JSON.stringify(_body);
        const headers = new Headers({ 'Content-Type': 'application/json', 'digi-middleware-auth-user': this.userToken });
        const options = new RequestOptions({ headers });

        return this.http.post(_baseUrl, body, options)
                        .catch(error => this.handleError(error));
    }

    public put(_baseUrl: string, _body: Object): Observable<any> {
        
        const body = JSON.stringify(_body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers });


        return this.http.put(_baseUrl, body, options);
    }

    public delete(_baseUrl: string): Observable<any> {
        
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers });


        return this.http.delete(_baseUrl, options);
    }

    private handleError (error: any) {

        console.log(error);

        if (error._body != '') {
            if (JSON.parse(error._body).message == 'token異常，無法繼續操作' || JSON.parse(error._body).message == 'token逾時，請重新取得新token' || error.status == 406) {
                
                window.sessionStorage.clear();

                let path = window.location.hash.split('#')[1];


                if (path == '/login' || path == '/pages/userManagement/userEdit') {
                    path = '/pages/userManagement/userQuery';
                }
                else if (path == '/pages/permissionsManagement/roleAuthEdit'){
                    path = '/pages/permissionsManagement/authRoleQuery'
                }
                else if (path == '/pages/permissionsManagement/authDataEdit'){
                    path = '/pages/permissionsManagement/authDataQuery'
                }
                window.sessionStorage.setItem('redirectPage', path);

                window.alert('需要重新登入，将导向回登入页入页');
                this.router.navigate(['/login']);
            }
        }

        return Observable.throw(error);
    }
}
