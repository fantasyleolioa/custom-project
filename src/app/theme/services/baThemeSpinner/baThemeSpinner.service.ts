import {Injectable} from '@angular/core';

@Injectable()
export class BaThemeSpinner {

  private _selector:string = 'preloader';
  private _element:HTMLElement;
  private _loadingSelector:string = "usageLoader";
  private _loading:HTMLElement;

  constructor() {
    this._element = document.getElementById(this._selector);
    this._loading = document.getElementById(this._loadingSelector)
  }

  public show():void {
    this._element.style['display'] = 'block';
  }

  public hide(delay:number = 0):void {
    setTimeout(() => {
      this._element.style['display'] = 'none';
    }, delay);
  }

  
  public preloaderShow(){
    this._loading.style['display'] = 'block';
  }

  public preloaderHide(delay:number = 0){
    setTimeout(() => {
      this._loading.style['display'] = 'none';
    }, delay);
  }
}
