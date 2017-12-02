import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';

import { CCContext } from '../../domain/CCContext';
import { LoginInfo } from '../../domain/LoginInfo';

import * as Crypto from 'crypto-js';

import { BaThemeSpinner } from "../../theme/services/baThemeSpinner";


@Component({
  selector: 'Login',
  styleUrls: [('./login.scss')],
  templateUrl: './login.html',
})
export class LoginComponent {

  public form: FormGroup;
  public account: AbstractControl;
  public psw: AbstractControl; 
  public loginButtonText: string = '登入';
  public loginStatus: boolean = false;
 
  constructor(private fb: FormBuilder, private ccContext: CCContext, private router: Router, private preloader:BaThemeSpinner) {

    this.preloader.preloaderHide();

    this.form = fb.group({
      account: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      psw: ['', Validators.compose([Validators.required, Validators.minLength(4)])], 
    });

    this.account = this.form.controls['account'];
    this.psw = this.form.controls['psw'];

    const isIE = navigator.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    console.log(isIE);

    if (isIE[1] == 'MSIE' || isIE[1] == 'Trident') {

      window.alert('请使用chrome或火狐浏览器，IE11以下(包含11)会有部分功能无法使用');
    }
  }

  
  public onSubmit() {

    if (this.form.valid) {

      this.loginButtonText = '登入中，请稍后';
      this.loginStatus = true;

      const encryptedPsw =  Crypto.enc.Base64.stringify(Crypto.SHA256(Crypto.SHA256(this.form.value.psw)));
      
      const loginInfo = new LoginInfo(this.form.value.account, encryptedPsw, 'token');
      
      this.ccContext.IdentityRepository.login(loginInfo)
        .subscribe(
          (result) => {


            const permission = JSON.stringify(result.permission);

            window.sessionStorage.setItem('userToken', result.token);
            window.sessionStorage.setItem('nowUserId', result.userId);
            window.sessionStorage.setItem('nowUserName', result.userName);
            window.sessionStorage.setItem('functionalPermission', permission);

            const redirectUrl = window.sessionStorage.getItem('redirectPage');

            if (redirectUrl) {

              this.router.navigate([redirectUrl]);
            }
            else {
              this.router.navigate(['/pages/userManagement/userQuery']);
            }

            window.sessionStorage.removeItem('redirectPage');
          },
          (error) => {

              if (error._body != '') {
                window.alert(JSON.parse(error._body).message);
              }
              else {
                window.alert(error.statusText);
              }

              this.loginButtonText = '登入';
              this.loginStatus = false;
          },
        );

    }
  }
}
