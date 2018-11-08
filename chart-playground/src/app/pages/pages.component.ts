import { Component } from '@angular/core';
import { Router } from "@angular/router";

import { ToasterService, ToasterConfig } from 'angular2-toaster';

import 'style-loader!angular2-toaster/toaster.css';


@Component({
  selector: 'ng-pages',
  styleUrls: ['./pages.scss'],
	templateUrl: './pages.html',
})
export class PagesComponent {
  // property
  toasterconfig: ToasterConfig;


  // constructor
  constructor(private toasterService: ToasterService, 
              private router: Router) 
  {
    this.toasterconfig = new ToasterConfig({
      positionClass: 'toast-top-center',
      timeout: 0,
      newestOnTop: true,
      tapToDismiss: true,
      preventDuplicates: false,
      animation: 'slideDown',
      limit: 1
    });

    // setTimeout(() => {
    //   const toastDetail: Toast = {
    //     type: 'error',
    //     body: '尚未登入，將導向回登入頁入頁',
    //     timeout: 0,
    //     showCloseButton: true,
    //     bodyOutputType: BodyOutputType.TrustedHtml,
    //     onHideCallback: () => {  }
    //   };

    //   this.toasterService.pop(toastDetail)
    // }, 100);
  }
}
