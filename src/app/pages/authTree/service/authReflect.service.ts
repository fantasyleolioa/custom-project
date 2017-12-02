import { Injectable } from '@angular/core';

import { AuthTree } from '../domain/authTree';
import { AppPermission } from '../domain/appPermission';
import { AuthSource } from '../domain/authSource';
import { AppInfo } from '../domain/appInfo';
import { ActionInfo } from '../domain/actionInfo';
import { OrgPermission } from '../domain/orgPermission';
import { UpdatedPermission } from '../domain/UpdatedPermission';


@Injectable()
export class AuthReflectService {

    constructor() { }

    public reflectPermission(edittedSource: AppPermission, permissionEffect: PermissionEffectInfo) {

        if (permissionEffect.id == permissionEffect.moduleId) {

            if (permissionEffect.effect == 'allow') {
    
                edittedSource.modules.forEach(
                    (item) => {

                        if (item.id == permissionEffect.id) {
                            item.effect = permissionEffect.effect;
                        }
                    },
                );

                edittedSource.actions.forEach(
                    (item) => {

                        if (item.moduleId == permissionEffect.id) {
                            item.effect = permissionEffect.effect;
                        }
                    },
                );
            }
            else {
                edittedSource.modules.forEach(
                    (item) => {

                        if (item.id == permissionEffect.id) {
                            item.effect = permissionEffect.effect;
                        }
                    },
                );
            }
        }
        else {

            edittedSource.actions.forEach(
                (item) => {

                    if (item.moduleId == permissionEffect.moduleId && item.id == permissionEffect.id) {
                        item.effect = permissionEffect.effect;
                    }
                },
            );

            if (permissionEffect.effect == 'allow') {

                edittedSource.actions.forEach(
                    (item) => {

                        if (item.moduleId == permissionEffect.id) {
                            item.effect = permissionEffect.effect;
                        }
                    },
                );
            }
        }
    }

    public reflectCondition(edittedSource: AppPermission, target: AuthTree) {

        edittedSource.actions.forEach(
            (action) => {

                if (action.id == target.id && action.moduleId == target.moduleId) {

                    action.condition = target.condition;
                }
            },
        );
    }

    public filterChangedCondition(sourceData: AppPermission, target: AppPermission) {

        let result;

        if (target != null || target != undefined) { result = JSON.parse(JSON.stringify(target));}

        result.actions.forEach(
            (actionElement, index) => {

                if (actionElement.condition.length >= 1 ) {
                    const compareFinal = [];

                    actionElement.condition.forEach(
                        (condition, conditionIndex) => {

                            if (condition.value != sourceData.actions[index].condition[conditionIndex].value) {
                                compareFinal.push(condition);
                            }
                        },
                    );

                    actionElement.condition = compareFinal;
                }
            },
        );

        return result;  
    }

    private moduleCalculate(source: AuthSource) {

        const resultPermission: AppInfo[] = [];
        const modulesGroup: AppPermission[] = [];
        
        source.user.permission.modules.forEach(
            (module) => {

                resultPermission.push(module);
            },
        );
        
        source.role.forEach(
            (rolePermission) => {

                modulesGroup.push(rolePermission.permission);
            },
        );

    
        source.org.forEach(
            (orgPermission) => {

                modulesGroup.push(orgPermission.permission);
            },
        );

        resultPermission.forEach(
            (module) => {

                if (module.effect == '[empty]') {

                    this.modulePermissionMapping(modulesGroup, module);
                }
            },
        );

        return resultPermission;
    }

    private modulePermissionMapping(source: AppPermission[], target: AppInfo) {

        for (let i = 0; i < source.length; i++) {
            
            for (let j = 0; j < source[i].modules.length; j++) {

                if (source[i].modules[j].id == target.id) {

                    if (source[i].modules[j].effect != '[empty]') {

                        target.effect = source[i].modules[j].effect;
                        return null;
                    }
                }
            }
        }
    }

    private actionsCalculate(source: AuthSource) {

        const resultPermission: ActionInfo[] = [];
        const actionsGroup: AppPermission[] = [];
        
        source.user.permission.actions.forEach(
            (action) => {

                resultPermission.push(action);
            },
        );
        
        source.role.forEach(
            (rolePermission) => {

                actionsGroup.push(rolePermission.permission);
            },
        );

    
        source.org.forEach(
            (orgPermission) => {

                actionsGroup.push(orgPermission.permission);
            },
        );

        resultPermission.forEach(
            (action) => {

                if (action.effect == '[empty]') {

                    this.actionPermissionMapping(actionsGroup, action);
                }
            },
        );

        return resultPermission;
    }

    private actionPermissionMapping(source: AppPermission[], target: ActionInfo) {

        for (let i = 0; i < source.length; i++) {
            
            for (let j = 0; j < source[i].actions.length; j++) {

                if (source[i].actions[j].id == target.id && source[i].actions[j].moduleId == target.moduleId) {

                    if (source[i].actions[j].effect != '[empty]') {

                        target.effect = source[i].actions[j].effect;
                        target.condition = source[i].actions[j].condition;
                        return null;
                    }
                }
            }
        }
    }
}

class PermissionEffectInfo{

  id: string;
  moduleId: string;
  effect: string;

  constructor(_id: string, _moduleId: string, _effect: string) {

    this.id = _id;
    this.moduleId = _moduleId;
    this.effect = _effect;
  }
}


class ResultPermission{

    roleDataList: RoleDataInfo[];
    permission: AppPermission;

    constructor(_roleDataList: RoleDataInfo[], _permission: AppPermission) {

        this.roleDataList = _roleDataList;
        this.permission = _permission;
    }
}

class RoleDataInfo{

    id: string;
    hash: string;
    priority: number;
    orgName: string;
    roleId: string;
    roleName: string;
    constraint: string;
    roleConstraint: string;
    permission: AppPermission;

    constructor(_id: string, 
                _priority: number,
                 _orgName: string, 
                 _roleId: string,
                 _roleName: string, 
                 _constraint: string, 
                 _permission: AppPermission,
                 _hash: string) {

        this.id = _id;
        this.priority = _priority;
        this.roleId = _roleId;
        this.orgName = _orgName;
        this.roleName = _roleName;
        this.constraint = _constraint;
        this.permission = _permission;
        this.hash = _hash;
    }
}
