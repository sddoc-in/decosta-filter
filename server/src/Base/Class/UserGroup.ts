import Collections from "../Config/collections";
import ResStatus from "../Config/response/ResStatus";
import UserGroupMessage from "../Config/response/UserGroup";
import UserGroupClassInterface, { UserGroupInterface } from "../Interface/UserGroup";
import ResponseClass from "./Response";
import Start from "./Start";



class UserGroup extends Start implements UserGroupClassInterface {
    Name: string = '';
    Description: string = '';
    Settings: number = 0;
    RecId: number = 0;
    CreatedBy: string = "";
    CreatedDateTime?: string = '';
    ModifiedBy: string = "";
    ModifiedDateTime?: string = '';

    constructor(userGroup?: UserGroupInterface) {
        super();
        if (userGroup) {
            this.setUserGroup(userGroup);
        }
        else {
            this.setBlankUserGroup();
        }
    }

    setUserGroup(userGroup: UserGroupInterface): void {
        this.Name = userGroup.Name || '';
        this.Description = userGroup.Description || '';
        this.Settings = userGroup.Settings || 0;
        this.RecId = userGroup.RecId || 0;
        this.CreatedBy = userGroup.CreatedBy || "";
        this.CreatedDateTime = userGroup.CreatedDateTime || '';
        this.ModifiedBy = userGroup.ModifiedBy || "";
        this.ModifiedDateTime = userGroup.ModifiedDateTime || '';
    }

    setBlankUserGroup(): void {
        this.Name = '';
        this.Description = '';
        this.Settings = 0;
        this.RecId = 0;
        this.CreatedBy = "";
        this.ModifiedBy = "";
    }

    get(): UserGroupInterface {
        return {
            Name: this.Name,
            Description: this.Description,
            Settings: this.Settings,
            CreatedBy: this.CreatedBy,
            CreatedDateTime: this.CreatedDateTime,
            ModifiedBy: this.ModifiedBy,
            ModifiedDateTime: this.ModifiedDateTime
        };
    }

    paramName(Name: string = this.Name): string {
        return this.Name = Name;
    }
    paramDescription(Description: string = this.Description): string {
        return this.Description = Description;
    }
    paramSettings(Settings: number = this.Settings): number {
        return this.Settings = Settings;
    }
    paramRecId(RecId: number = this.RecId): number {
        return this.RecId = RecId;
    }
    paramCreatedBy(CreatedBy: string = this.CreatedBy): string {
        return this.CreatedBy = CreatedBy;
    }
    paramCreatedDateTime(CreatedDateTime: string = this.CreatedDateTime || ""): string {
        return this.CreatedDateTime = CreatedDateTime;
    }
    paramModifiedBy(ModifiedBy: string = this.ModifiedBy): string {
        return this.ModifiedBy = ModifiedBy;
    }
    paramModifiedDateTime(ModifiedDateTime: string = this.ModifiedDateTime || ""): string {
        return this.ModifiedDateTime = ModifiedDateTime;
    }

    modified() {
        this.ModifiedDateTime = this.getDateTime();
    }

    async CheckExists(Name: string = this.Name,RecId:number= this.RecId): Promise<void> {
        let userGroup = await this.getOne(Collections.UserGroup, { Name: Name, RecId: RecId }, "OR");
        if (userGroup && userGroup.RecId) {
            return;
        }
        throw new ResponseClass(ResStatus.BadRequest, UserGroupMessage.UserGroupNotFound);
    }

    async CheckNotExists(Name: string = this.Name,RecId:number= this.RecId): Promise<void> {
        let userGroup = await this.getOne(Collections.UserGroup, { Name: Name, RecId: RecId }, "OR");
        if (userGroup && userGroup.RecId) {
            throw new ResponseClass(ResStatus.BadRequest, UserGroupMessage.UserGroupAlreadyExist);
        }
        return;
    }


    async getUserGroup(Name: string = this.Name,RecId:number= this.RecId): Promise<UserGroupInterface> {
        let userGroup = await this.getOne(Collections.UserGroup, { RecId: RecId, Name: Name }, "OR");
        if (userGroup && userGroup.RecId) {
            return userGroup;
        }
        throw new ResponseClass(ResStatus.BadRequest, UserGroupMessage.UserGroupNotFound);
    }

    async createUserGroup(): Promise<void> {
        this.modified();
        this.CreatedDateTime = this.ModifiedDateTime
        this.RecId = (await this.insertOneWithOutput(Collections.UserGroup, this.get(),["RecId"])).RecId;
    }

    async updateUserGroup(): Promise<void> {
        this.modified();
        await this.updateOne(Collections.UserGroup, { RecId: this.RecId }, this.get());
    }

    async deleteUserGroup(Name: string = this.Name,RecId:number= this.RecId): Promise<void> {
        await this.deleteOne(Collections.UserGroup, { Name: Name, RecId: RecId }, "OR");
    }


    flush(): void {
        super.flush();
        this.setBlankUserGroup();
    }
}

export default UserGroup;