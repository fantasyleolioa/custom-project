import { Injectable } from '@angular/core';

import { TreeData } from '../../domain/TreeData';
import { SourceTreeData } from '../../domain/SourceTreeData';
import { Application } from '../../domain/Application';
import { BasicMetadata } from '../../domain/BasicMetadata';
import { Action } from '../../domain/Action';
import { RoleMetadata } from '../../domain/RoleMetadata';
import { RoleInfo } from '../../domain/RoleInfo';
import { RoleCatalogInfo } from '../../domain/RoleCatalogInfo';
import { OrgInfo, OrgAspect } from '../../domain/OrgInfo';

import * as Collections from 'typescript-collections';


@Injectable()
export class TreeDataTransferService {

    constructor() {}

    public TransferApplication(target: Application) {

        const resultTree: TreeData[] = [];
        const actionTree: TreeData[] = [];
 
        const actionNodes: Collections.Dictionary<string, TreeData[]> = new Collections.Dictionary<string, TreeData[]>();
        const rootList: TreeData[] = [];

        target.modules.forEach(
                (moduleElement: BasicMetadata) => {

                    const current: TreeData = new TreeData(moduleElement.name, moduleElement.id, false, moduleElement.hash);
                    resultTree.push(current);
                },
            );

        if (target.actions.length > 0) {
            target.actions.forEach(
                (actionElement: Action) => {

                    const current = new TreeData(actionElement.name, actionElement.id, false, actionElement.hash);
                    current.moduleId = actionElement.moduleId;
                    current.parentId = actionElement.parentId;

                    const ParentKey = current.moduleId + ':' + current.parentId;

                    if (actionElement.parentId == '[empty]') {

                        rootList.push(current);
                    }
                    else if (!actionNodes.containsKey(ParentKey)) {

                        actionNodes.setValue(ParentKey, new Array<TreeData>());
                        actionNodes.getValue(ParentKey).push(current);
                    }
                    else {
                        actionNodes.getValue(ParentKey).push(current);
                    }
                },
            );

            rootList.forEach(
                (root: TreeData, i: number) => {

                    actionTree.push(root);
                    this.BuildApp(root, actionNodes, actionTree);
                    actionTree[i].SetSubCollapsed(false);
                },
            );


            resultTree.forEach(
                (root: TreeData) => {
                    
                    actionTree.forEach(
                        (actionChild: TreeData) => {

                            if (root.id == actionChild.moduleId) {
                                root.child.push(actionChild);
                            }
                        },
                    );
                },
            );
        }

        return resultTree;
    }

    public TransferRole(target: RoleMetadata) {

        const resultTree: TreeData[] = [];
        const roleTree: TreeData[] = [];

        target.roleCatalog.forEach(
            (roleCatalogElement) => {

                const current: TreeData = new TreeData(roleCatalogElement.name, roleCatalogElement.id, false, roleCatalogElement.hash);
                current.isMultiSelect = roleCatalogElement.isMultiSelect;
                current.readOnly = roleCatalogElement.readOnly;
                resultTree.push(current);
            },
        );

        if (target.role.length > 0) {

            target.role.forEach(
                (roleElement: RoleInfo) => {

                    const current = new TreeData(roleElement.name, roleElement.id, false, roleElement.hash);
                    current.catalogId = roleElement.catalogId;
                    current.roleCatalogName = roleElement.catalogName;
                    current.constraint = roleElement.constraint;
                    current.level = roleElement.level;
                    if (roleElement.checked) {
                        current.checked = roleElement.checked;
                    }
                    roleTree.push(current);
                },
            );

            resultTree.forEach(
                (root: TreeData) => {
                    
                    roleTree.forEach(
                        (roleChild: TreeData) => {

                            if (root.id == roleChild.catalogId) {
                                root.child.push(roleChild);
                            }
                        },
                    );

                    root.SetSubCollapsed(true);
                },
            );
        }

        return resultTree;
    }

    public TransferOrg(target: OrgSourceTreeData) {
        const resultTree: TreeData[] = [];
        const orgTree: TreeData[] = [];

        const orgNodes: Collections.Dictionary<string, TreeData[]> = new Collections.Dictionary<string, TreeData[]>();

        target.orgAspect.forEach(
            (OrgAspectlement: OrgAspect) => {
                const current: TreeData = new TreeData(OrgAspectlement.name, OrgAspectlement.sid, false, OrgAspectlement.hash);
                current.label = OrgAspectlement.id;
                current.SetSubCollapsed(true);
                resultTree.push(current);
            }
        );

        if (target.org.length > 0) {
            target.org.forEach(
                (orgElement: OrgInfo) => {
                    const current = new TreeData(orgElement.name, orgElement.sid, false, orgElement.hash);
                    current.catalogId = orgElement.orgAspectSid;
                    current.label = orgElement.label;
                    current.orgTypeName = orgElement.typeName;
                    current.orgTypeUri = orgElement.typeUri;
                    current.orgUrn = orgElement.urn;
                    current.orgUri = orgElement.uri;
                    
                    if (orgElement.checked != undefined) {
                        current.checked = orgElement.checked;
                    }
                    current.SetSubCollapsed(true);
                    if (!orgNodes.containsKey(orgElement.parentSid)) {
                        
                        orgNodes.setValue(orgElement.parentSid, new Array<TreeData>());
                        orgNodes.getValue(orgElement.parentSid).push(current);
                    }else {

                        orgNodes.getValue(orgElement.parentSid).push(current);
                    }
                },
            );

            orgNodes.getValue(('0')).forEach(
                (root: TreeData, i: number) => {

                    orgTree.push(root);
                    this.Build(root, orgNodes, orgTree);
                },
            );

            resultTree.forEach(
                (root: TreeData) => {
                    
                    orgTree.forEach(
                        (orgChild: TreeData) => {
                            if (root.id == orgChild.catalogId) {
                                root.child.push(orgChild);
                            }
                        },
                    );
                },
            );
        }

        return resultTree;
    }

    public TransferOrgWithOutAspect(target: OrgInfo[], isType?:boolean) {

        const resultTree: TreeData[] = [];
        
        const orgNodes: Collections.Dictionary<string, TreeData[]> = new Collections.Dictionary<string, TreeData[]>();

        if (target.length > 0) {

            target.forEach(
                (orgElement: OrgInfo) => {
                    const current = new TreeData(orgElement.name, orgElement.sid, false, orgElement.hash);
                    
                    current.catalogId = orgElement.orgAspectSid;
                    current.label = orgElement.label;
                    current.orgTypeName = orgElement.typeName;
                    current.orgTypeUri = orgElement.typeUri;
                    current.orgUrn = orgElement.urn;
                    current.orgUri = orgElement.uri;
                    if(isType) {current.label = orgElement.id;}
                    
                    if (orgElement.checked) {
                        current.checked = true;
                        current.singleChecked = true;
                    }
                    if (orgElement.isDisabled) {
                        current.isDisabled = true;
                    }

                    current.SetSubCollapsed(false);

                    if (!orgNodes.containsKey(orgElement.parentSid)) {
                        
                        orgNodes.setValue(orgElement.parentSid, new Array<TreeData>());
                        orgNodes.getValue(orgElement.parentSid).push(current);
                    }else {

                        orgNodes.getValue(orgElement.parentSid).push(current);
                    }
                },
            );

            orgNodes.getValue(('0')).forEach(
                (root: TreeData, i: number) => {

                    resultTree.push(root);
                    this.Build(root, orgNodes, resultTree);
                    root.SetSubCollapsed(false);
                },
            );

            return resultTree;
        }else {

            return [];
        }
    }

    // For open
    public openAllcollapse(target: TreeData[]) {
        target.forEach(
            (item, index) => {

                target[index].subCollapsed = false;

                if (item.child.length > 0) {

                    this.openAllcollapse(item.child);
                }
            },
        );

        return target;
    }


    // Private
    private Build(parent: TreeData, nodesList: Collections.Dictionary<string, TreeData[]>, tree: TreeData[]) {

        if (!nodesList.containsKey(parent.id)) return null;

        nodesList.getValue(parent.id).forEach(
            (current: TreeData) => {

                
                tree[tree.indexOf(parent)].child.push(current);
                tree[tree.indexOf(parent)].SetSubCollapsed(true);

                this.Build(current, nodesList, tree[tree.indexOf(parent)].child);
            },
        );
    }

    private BuildApp(parent: TreeData, nodesList: Collections.Dictionary<string, TreeData[]>, tree: TreeData[]) {

        const ParentKey = parent.moduleId + ':' + parent.id;

        if (!nodesList.containsKey(ParentKey)) return null;

        nodesList.getValue(ParentKey).forEach(
            (current: TreeData) => {

                
                tree[tree.indexOf(parent)].child.push(current);
                tree[tree.indexOf(parent)].SetSubCollapsed(true);

                this.BuildApp(current, nodesList, tree[tree.indexOf(parent)].child);
            },
        );
    }
}

class OrgSourceTreeData{

  orgAspect: OrgAspect[];
  org: OrgInfo[];
}
