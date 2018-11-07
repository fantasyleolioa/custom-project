import { AppInfo } from './appInfo';
import { ActionInfo } from './actionInfo';

export class AppPermission {

    public app:AppInfo;
    public modules:AppInfo[];
    public actions:ActionInfo[];
    public hash?:string;

    public allow?: ActionInfo[] = [];
    public deny?:ActionInfo[] = [];

    constructor(_app:AppInfo, _modules:AppInfo[], _actions:ActionInfo[]){
        
        this.app = _app;
        this.modules = _modules;
        this.actions = _actions;
        this.allow = [];
        this.deny = [];
    }
}