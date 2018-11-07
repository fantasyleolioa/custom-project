import { Injectable } from '@angular/core';

import * as Collections from 'typescript-collections';
import { AuthTree } from '../domain/authTree';
import { AppPermission } from '../domain/appPermission';
import { ActionInfo } from '../domain/actionInfo';
import { AppInfo } from '../domain/appInfo';


@Injectable()
export class AuthTreeService {

    constructor() { }

    // Transfer
    public TransferApplication(target: AppPermission) {

        const resultTree: AuthTree[] = [];
        const actionTree: AuthTree[] = [];
 
        const actionNodes: Collections.Dictionary<string, AuthTree[]> = new Collections.Dictionary<string, AuthTree[]>();
        const rootList: AuthTree[] = [];

        if (target.modules.length > 0 && target.actions.length > 0 ) {
            target.actions.forEach(
                (actionElement: ActionInfo) => {

                    const current = new AuthTree(actionElement.name, actionElement.id);
                    current.moduleId = actionElement.moduleId;
                    current.condition = actionElement.condition;
                    current.parentId = actionElement.parentId;

                    if (actionElement.effect == 'allow') {
                        current.allow = true;
                    }
                    else if (actionElement.effect == 'deny') {
                        current.deny = true;
                    }

                    const ParentKey = current.moduleId + ':' + current.parentId;

                    if (actionElement.parentId == '[empty]') {

                        rootList.push(current);
                    }
                    else if (!actionNodes.containsKey(ParentKey)) {

                        actionNodes.setValue(ParentKey, new Array<AuthTree>());
                        actionNodes.getValue(ParentKey).push(current);
                    }
                    else {
                        actionNodes.getValue(ParentKey).push(current);
                    }
                },
            );

            rootList.forEach(
                (root: AuthTree, i: number) => {

                    actionTree.push(root);
                    this.BuildApp(root, actionNodes, actionTree);
                    actionTree[i].SetSubCollapsed(false);
                },
            );

            target.modules.forEach(
                (moduleElement: AppInfo) => {

                    const current: AuthTree = new AuthTree(moduleElement.name, moduleElement.id);
                    current.moduleId = moduleElement.id;
                    current.condition = [];

                    if (moduleElement.effect == 'allow') {
                        current.allow = true;
                    }
                    else if (moduleElement.effect == 'deny') {
                        current.deny = true;
                    }
                    resultTree.push(current);
                },
            );

            resultTree.forEach(
                (root: AuthTree) => {
                    
                    actionTree.forEach(
                        (actionChild: AuthTree) => {

                            if (root.id == actionChild.moduleId) {
                                root.child.push(actionChild);
                            }
                        },
                    );
                },
            );

            return resultTree;
        }
        else {
            return [];
        }
    }


    private BuildApp(parent: AuthTree, nodesList: Collections.Dictionary<string, AuthTree[]>, tree: AuthTree[]) {

        const ParentKey = parent.moduleId + ':' + parent.id;

        if (!nodesList.containsKey(ParentKey)) return null;

        nodesList.getValue(ParentKey).forEach(
            (current: AuthTree) => {

                
                tree[tree.indexOf(parent)].child.push(current);
                tree[tree.indexOf(parent)].SetSubCollapsed(true);

                this.BuildApp(current, nodesList, tree[tree.indexOf(parent)].child);
            },
        );
    }
}
