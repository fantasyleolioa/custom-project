import {Component} from '@angular/core';
import { Router } from '@angular/router';

import {GlobalState} from '../../../global.state';

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss']
})
export class BaPageTop {

  public isScrolled:boolean = false;
  public isMenuCollapsed:boolean = false;
  public userName: string = '';

  constructor(private _state:GlobalState, private router:Router) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });

    this.userName = window.sessionStorage.getItem("nowUserName");
    
    if(!this.userName){

      this.userName = '';
    };
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }

  public logout(){
    
    window.sessionStorage.clear();
    this.router.navigate(["/login"]);
  }
}
