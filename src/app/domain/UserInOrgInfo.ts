export class UserInOrgInfo {

    public userId:string;
    public userName:string;
    public roleId:string;
    public roleName:string;
    public orgId:string;
    public orgName:string;
    public constraint:string;   
    public priority:number;
    public orgUrn:string;
    public hash:string;

    constructor(_userId:string, 
                _userName:string, 
                _roleId:string, 
                _roleName:string, 
                _orgId:string, 
                _orgName:string,
                _constraint:string, 
                _priority:number, 
                _orgUrn:string, 
                _hash:string ) 
    {

        this.userId = _userId;
        this.userName = _userName;
        this.roleId = _roleId;
        this.roleName = _roleName;
        this.orgId = _orgId;
        this.orgName = _orgName;
        this.constraint = _constraint;
        this.priority = _priority;
        this.orgUrn =_orgUrn;
        this.hash = _hash;
    }
}