

export interface NotificationsInterface {
    Type: number;
    Show:number;
    Status: number;
    Title: string;
    Description: string;
    GeneratedBy: string;
    GeneratedFor: number;
    RefRecId: number;
    RefTableId: number;
    RecId?: number;
    CreatedBy: string;
    CreatedDateTime?: string;
    ModifiedBy: string;
    ModifiedDateTime?: string;
}

export default interface NotificationsClass extends  NotificationsInterface {
    setNotification(Notification: NotificationsInterface): void;
    setBlank(): void;
    validate(): void;
    modified(): void;
    insert(): void;
    update(): void;
    delete(): void;
    get(): void;
    flush(): void;

    // params
    paramType(Type: number): number;
    paramShow(Show:number):number;
    paramStatus(Status: number): number;
    paramTitle(Title: string): string;
    paramDescription(Description: string): string;
    paramGeneratedBy(GeneratedBy: string): string;
    paramGeneratedFor(GeneratedFor: number): number;
    paramRefRecId(RefRecId: number): number;
    paramRefTableId(RefTable: number): number;
    paramRecId(RecId: number): number;
    paramCreatedBy(CreatedBy: string): string;
    paramCreatedDateTime(CreatedDateTime: string): string;
    paramModifiedBy(ModifiedBy: string): string;
    paramModifiedDateTime(ModifiedDateTime: string): string;
}

export const EmptyNotifications: NotificationsInterface = {
    Type: 0,
    Status: 0,
    Show:0,
    Title: "",
    Description: "",
    GeneratedBy: '',
    GeneratedFor: 0,
    RefRecId: 0,
    RefTableId: 0,
    RecId: 0,
    CreatedBy: "",
    ModifiedBy: "",
    ModifiedDateTime: "",
    CreatedDateTime: ""
}