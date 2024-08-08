import Collections from "../Config/collections";
import NotificationsResponse from "../Config/response/Notifications";
import ResStatus from "../Config/response/ResStatus";
import NotificationsClass, { NotificationsInterface } from "../Interface/Notifications";
import ResponseClass from "./Response";
import Start from "./Start";


class Notifications extends Start implements NotificationsClass {
    Type: number = 0;
    Show: number = 0;
    Status: number = 0;
    Title: string = "";
    Description: string = "";
    GeneratedBy: string = "";
    GeneratedFor: number = 0;
    RefRecId: number = 0;
    RefTableId: number = 0;
    RecId: number = 0;
    CreatedBy: string = "";
    CreatedDateTime: string = "";
    ModifiedBy: string = "";
    ModifiedDateTime: string = "";

    constructor(Notification?: NotificationsInterface) {
        super();
        if (Notification) this.setNotification(Notification);
    }

    setNotification(Notification: NotificationsInterface): void {
        this.Type = Notification.Type || 0;
        this.Show = Notification.Show || 0;
        this.Status = Notification.Status || 0;
        this.Title = Notification.Title || "";
        this.Description = Notification.Description || "";
        this.GeneratedBy = Notification.GeneratedBy || "";
        this.GeneratedFor = Notification.GeneratedFor || 0;
        this.RefRecId = Notification.RefRecId || 0;
        this.RefTableId = Notification.RefTableId || 0;
        this.RecId = Notification.RecId || 0;
        this.CreatedBy = Notification.CreatedBy || "";
        this.CreatedDateTime = Notification.CreatedDateTime || "";
        this.ModifiedBy = Notification.ModifiedBy || "";
        this.ModifiedDateTime = Notification.ModifiedDateTime || "";
    }

    setBlank(): void {
        this.Type = 0;
        this.Show = 0;
        this.Status = 0;
        this.Title = "";
        this.Description = "";
        this.GeneratedBy = "";
        this.GeneratedFor = 0;
        this.RefRecId = 0;
        this.RefTableId = 0;
        this.RecId = 0;
        this.CreatedBy = "";
        this.CreatedDateTime = "";
        this.ModifiedBy = "";
        this.ModifiedDateTime = "";
    }

    paramStatus(Status: number = this.Status): number {
        this.Status = Status;
        return this.Status;
    }

    paramShow(Show: number = this.Show): number {
        this.Show = Show;
        return this.Show;
    }

    paramType(Type: number = this.Type): number {
        this.Type = Type;
        return this.Type;
    }

    paramTitle(Title: string = this.Title): string {
        this.Title = Title;
        return this.Title;
    }

    paramDescription(Description: string = this.Description): string {
        this.Description = Description;
        return this.Description;
    }

    paramGeneratedBy(GeneratedBy: string = this.GeneratedBy): string {
        this.GeneratedBy = GeneratedBy;
        return this.GeneratedBy;
    }

    paramGeneratedFor(GeneratedFor: number = this.GeneratedFor): number {
        this.GeneratedFor = GeneratedFor;
        return this.GeneratedFor;
    }

    paramRefRecId(RefRecId: number = this.RefRecId): number {
        this.RefRecId = RefRecId;
        return this.RefRecId;
    }

    paramRefTableId(RefTableId: number = this.RefTableId): number {
        this.RefTableId = RefTableId;
        return this.RefTableId;
    }

    paramRecId(RecId: number = this.RecId): number {
        this.RecId = RecId;
        return this.RecId;
    }

    paramCreatedBy(CreatedBy: string = this.CreatedBy): string {
        this.CreatedBy = CreatedBy;
        return this.CreatedBy;
    }

    paramCreatedDateTime(CreatedDateTime: string = this.CreatedDateTime): string {
        this.CreatedDateTime = CreatedDateTime;
        return this.CreatedDateTime;
    }

    paramModifiedBy(ModifiedBy: string = this.ModifiedBy): string {
        this.ModifiedBy = ModifiedBy;
        return this.ModifiedBy;
    }

    paramModifiedDateTime(ModifiedDateTime: string = this.ModifiedDateTime): string {
        this.ModifiedDateTime = ModifiedDateTime;
        return this.ModifiedDateTime;
    }

    validate(): void {
        if (!this.GeneratedFor) throw new ResponseClass(ResStatus.BadRequest, NotificationsResponse.GeneratedFor)
        if (!this.GeneratedBy) throw new ResponseClass(ResStatus.BadRequest, NotificationsResponse.GeneratedBy)
        if (!this.Title) throw new ResponseClass(ResStatus.BadRequest, NotificationsResponse.Title)
        if (!this.Description) throw new ResponseClass(ResStatus.BadRequest, NotificationsResponse.Description)
    }

    getNotification(): NotificationsInterface {
        return {
            Type: this.Type,
            Show: this.Show,
            Status: this.Status,
            Title: this.Title,
            Description: this.Description,
            GeneratedBy: this.GeneratedBy,
            GeneratedFor: this.GeneratedFor,
            RefRecId: this.RefRecId,
            RefTableId: this.RefTableId,
            CreatedBy: this.CreatedBy,
            CreatedDateTime: this.CreatedDateTime,
            ModifiedBy: this.ModifiedBy,
            ModifiedDateTime: this.ModifiedDateTime,
        }
    }

    modified(): void {
        this.validate();
        this.ModifiedDateTime = this.getDateTime();
    }

    async insert(): Promise<void> {
        this.modified();
        this.CreatedDateTime = this.ModifiedDateTime
        this.RecId = (await this.insertOneWithOutput(Collections.Notifications, this.getNotification(), ["RecId"])).RecId
    }

    async update(): Promise<void> {
        this.modified();
        await this.updateOne(Collections.Notifications, { RecId: this.RecId }, this.getNotification())
    }

    async delete(): Promise<void> {
        await this.deleteOne(Collections.Notifications, { RecId: this.RecId })
    }

    async get(): Promise<NotificationsInterface[]> {
        return await this.getAll(Collections.Notifications, this.getNotification())
    }

    flush(): void {
        super.flush();
        this.setBlank();
    }
}

export default Notifications;