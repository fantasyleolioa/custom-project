export class TreeData {

    id: string;
    name: string;
    checked: boolean = false;
    singleChecked: boolean = false;
    isIndeterminate: boolean = false;
    isInherit: boolean;
    hash: string;
    child: TreeData[];

    orgTypeName?: string;
    orgTypeUri?: string;
    orgUrn?: string;
    orgUri?: string;
    roleCatalogName?: string;
    label?: string;
    subCollapsed?: boolean;
    catalogId?: string;
    moduleId?: string;
    parentId?: string;
    isDisabled?: boolean;
    isMultiSelect?: boolean;
    constraint?: string;
    level?: number;
    readOnly?: boolean;

    constructor( _name: string, _id: string, _isInherit: boolean, _hash: string) {

        this.name = _name;
        this.id = _id;
        this.isInherit = _isInherit;
        this.child = [];
        this.hash = _hash;
    }

    public SetSubCollapsed(target: boolean) {
        this.subCollapsed = target;
    }
}