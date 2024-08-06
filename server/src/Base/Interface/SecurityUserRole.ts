


export interface SecurityUserRoleInterface {
    SecurityRole: number;
    UserId: string;
    RecId?: number;
    CreatedBy: string;
    CreatedDateTime?: string;
    ModifiedBy: string;
    ModifiedDateTime?: string;
}

export default interface SecurityUserRoleClass extends SecurityUserRoleInterface {
    setSecurityUserRole(securityUserRole: SecurityUserRoleInterface): void;
    setBlank(): void;
    validate(): void;
    modified(): void;
    insert(): void;
    update(): void;
    delete(): void;
    get(): SecurityUserRoleInterface;
    flush(): void;

    // params
    paramCreatedBy(CreatedBy: string): string;
    paramCreatedDateTime(CreatedDateTime: string): string;
    paramModifiedBy(ModifiedBy: string): string;
    paramModifiedDateTime(ModifiedDateTime: string): string;
    paramSecurityRole(SecurityRole: number): number;
    paramUser(User: string): string;
    paramRecId(RecId: number): number;
}


export const EmptySecurityUserRole: SecurityUserRoleInterface = {
    SecurityRole: 0,
    UserId: '',
    RecId: 0,
    CreatedBy: '',
    CreatedDateTime: '',
    ModifiedBy: '',
    ModifiedDateTime: ''
}