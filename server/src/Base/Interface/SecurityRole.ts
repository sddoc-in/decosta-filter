

export interface SecurityRoleInterface {
    Name: string;
    Description: string;
    RecId?: number;
    CreatedBy: string;
    CreatedDateTime?: string;
    ModifiedBy: string;
    ModifiedDateTime?: string;
}


export default interface SecurityRoleClass extends SecurityRoleInterface {
    setSecurityRole(securityRole: SecurityRoleInterface): void;
    setBlank(): void;
    validate(): void;
    modified(): void;
    insert(): void;
    update(): void;
    delete(): void;
    get(): SecurityRoleInterface;
    flush(): void;

    // params
    paramCreatedBy(CreatedBy: string): string;
    paramCreatedDateTime(CreatedDateTime: string): string;
    paramModifiedBy(ModifiedBy: string): string;
    paramModifiedDateTime(ModifiedDateTime: string): string;
    paramName(Name: string): string;
    paramDescription(Description: string): string;
    paramRecId(RecId: number): number;
}


export const EmptySecurityRole: SecurityRoleInterface = {
    Name: '',
    Description: '',
    RecId: 0,
    CreatedBy: '',
    CreatedDateTime: '',
    ModifiedBy: '',
    ModifiedDateTime: ''
}