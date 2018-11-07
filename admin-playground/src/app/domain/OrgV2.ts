export class OrgV2Info {

    sid: string;
    label: string;
    name: string;
    parentSid: number;
    orgAspectSid: number;
    typeSid: number;
    typeUri: string;
    uri: string;
    urn: string;
    createBy: string;
    hash: string;
    checked?: boolean;
    isDisabled?: boolean;

    constructor() { }
} 

export class OrgV2Aspect {

    sid: string;
    id: string;
    name: string;
    orgCatalogSid: string;
    createBy: string;
    hash: string;

    constructor() { }
}
