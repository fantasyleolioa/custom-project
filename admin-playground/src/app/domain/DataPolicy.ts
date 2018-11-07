export class DataPolicy{

    sid: string;
    id: string;
    name: string;
    effectiveTime: string;
    expiredTime: string;
    effectiveDate?: string;
    expiredDate?: string;
    hash: string;
    createBy: string;
    statements: PolicyStatement[];
    subCollapsed?: boolean = true;

    targetOrgs: TargetOrg[];
    targetOrgTags: TargetOrgTag[];
    affectedOrgTypes: AffectedOrgType[];
    userInOrg:BelongedUserInOrg;

    constructor(){ }
}

export class PolicyStatement{

    sid: string;
    effect: string;
    effecName?: string;
    include: ServeOrg;
    targetOrgs: TargetOrg[];
    targetOrgsCollapsed: boolean = true;    
    targetOrgTags: TargetOrgTag[];
    targetOrgTagsCollapsed: boolean = true;        
    affectedOrgTypes: AffectedOrgType[];
    affectedOrgTypesCollapsed: boolean = true;        

    constructor(){ }
}

export class ServeOrg{

    userInOrg: boolean;

    constructor() { }
}

export class BelongedUserInOrg{

    checked: boolean;
    effect: string;
    effectName: string;
}

export class TargetOrg{

    label: string;
    name: string;
    uri: string;
    urn: string;
    effect: string;
    effectName: string;

    constructor() { }
}


export class TargetOrgTag{
    
    id: string;
    name: string;
    effect: string;
    effectName: string;

    constructor() { }
}

export class AffectedOrgType{
    
    id: string;
    uri: string;
    name: string;

    constructor() { }
}

export class UpdatedDataPolicy{
    
    id: string;
    name: string;
    hash: string;
    effectiveTime?: string;
    expiredTime?: string;
    attachment?: any;
    statement:UpdatedPolicyStatement;

    targetOrgs: UpdatedStatementInfo[];
    targetOrgTags: UpdatedStatementInfo[];
    affectedOrgTypes: UpdatedStatementInfo[];
    userInOrg: BelongedUserInOrg;

    constructor(_id:string, _name:string) {

        this.id = _id;
        this.name = _name;
    }
}

export class UpdatedAttachment{
    type: string;
    id: string;

    constructor(_type:string, _id:string){

        this.type = _type;
        this.id = _id;
    }
}

export class UpdatedPolicyStatement{

    effect: string;
    include: ServeOrg;
    targetOrgs: UpdatedStatementInfo[];
    targetOrgTags: UpdatedStatementInfo[];
    affectedOrgTypes: UpdatedStatementInfo[];

    constructor() { }
}

export class UpdatedStatementInfo{
    id: string;
    uri: string;
    effect: string;

    constructor() { }
}

export class RequestedOrgTreeBody{

    policyId: string;
    attachment: UpdatedAttachment;
    orgCatalogId: string;
    orgAspectId:string;

    constructor(_policyId:string, _attachment:UpdatedAttachment){
        this.policyId = _policyId;
        this.attachment = _attachment;
    }
}

export class UserDataPolicyView{

    result: DataPolicyResultList[];
    role: DataPolicyRoleList[];
    user: DataPolicyUserList;
    action: any;
}

export class DataPolicyResultList{
    effect: string;
    effectName: string;
    isUserInOrg: boolean;
    name: string;
    orgTag: TargetOrgTag[];
    orgType: string;
    orgTypeName: string;
    role: string;
    roleCatalogId: string;
    uri: string;
    urn: string;
}

export class DataPolicyRoleList{
    catalogId: string;
    catalogName: string;
    dataPermission: DataPolicyResultList[];
    id: string;
    name: string;
    subCollapsed: boolean;
}

export class DataPolicyUserList{
    dataPermission: DataPolicyResultList[];
    id: string;
    name: string;
}