import { Component } from '@angular/core';
import { Routes, Router } from '@angular/router';

import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';

@Component({
	selector: 'pages',
	template: `
		<ba-sidebar></ba-sidebar>
		<ba-page-top></ba-page-top>
		<div class="al-main">
			<div class="al-content">
				<ba-content-top></ba-content-top>
				<router-outlet></router-outlet>
			</div>
		</div>
		<ba-back-top position="200"></ba-back-top>
		`,
})
export class Pages {

	constructor(private _menuService: BaMenuService, private router:Router) {
	}

	ngOnInit() {

		let userToken = window.sessionStorage.getItem("userToken");
		
		if(!userToken){
	
			userToken = '';
			window.sessionStorage.clear();
	
			let path = window.location.hash.split('#')[1];
	
			if(path == "/login"){
				path = "/pages/userManagement/userQuery";
			}
			window.sessionStorage.setItem("redirectPage", path);
	
			window.alert("需要重新登入，将导向回登入页入页");
			this.router.navigate(["/login"]);
		};


		var menu = JSON.parse(window.sessionStorage.getItem("functionalPermission"));

		if(menu == null || menu == undefined || menu == ""){
			
			menu = [];
		  };

		this._menuService.updateMenuByRoutes(<Routes>menu);


	}
}
