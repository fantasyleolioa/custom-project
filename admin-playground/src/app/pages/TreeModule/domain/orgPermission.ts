import { AppPermission } from './appPermission';
import { AuthTree } from "./authTree";


export class OrgPermission{

    public sid:string;
    public label:string;
    public orgUrn:string;
    public orgUri:string;
    public orgName:string;
    public userId:string;
    public roleId:string;
    public roleName:string;
    public permission:AppPermission;
    public authData:AuthTree[];
    public priority:number;
    public hash:string;
    public subCollapsed: boolean = true;

    constructor() { }
}