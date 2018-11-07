export class OrgInfo {
    
    sid: string;
    label: string;
    name: string;
    parentSid: string;
    orgAspectSid: string;
    typeSid: string;
    typeName: string;
    typeUri: string;
    uri: string;
    urn: string;
    createBy: string;
    hash: string;
    checked?: boolean;
    isDisabled?: boolean;
    id?: string;

    constructor() { }
} 

export class OrgAspect {
    
    sid: string;
    id: string;
    name: string;
    orgCatalogSid: string;
    createBy: string;
    hash: string;

    constructor() { }
}

export class OrgTag{

    sid: string;
    id: string;
    name: string;
    foregroundColor: string;
    backgroundColor: string;
    org: OrgInOrgTag[];
    hash: string;
    orgType: string = '';

    checked: boolean = false;
    subCollapsed?: boolean;

    constructor() { }
}

export class OrgInOrgTag{

    orgSid: string;
    orgName: string;
    orgLabel: string;
    orgUri: string;
    orgUrn: string;
    typeUri: string;
    typeName: string;

    constructor() { }
}

export class OrgTagTreeData{

    sid: string;
    id: string;
    name: string;
    foregroundColor: string;
    backgroundColor: string;
    child: OrgTagTreeData[] = [];
    hash: string;
    orgType: string = '';

    checked: boolean = false;
    subCollapsed?: boolean;

    constructor(_sid:string, _id:string, _name:string, _hash: string){
        this.sid = _sid;
        this.id = _id;
        this.name = _name;
        this.hash = _hash;
    }
}
    
