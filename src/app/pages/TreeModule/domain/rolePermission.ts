import { AppPermission } from './appPermission';
import { AuthTree } from "./authTree";


export class RolePermission{

    public permission:AppPermission;
    public constraint:string = '';
    public catalogId:string = '';
    public catalogName:string = '';
    public id:string = '';
    public name:string = '';
    public authData:AuthTree[];
    public subCollapsed: boolean = true;

    
    constructor() { }
}