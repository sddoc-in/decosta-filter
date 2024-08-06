import Collections from "../Config/collections";
import ResStatus from "../Config/response/ResStatus";
import SecurityRoleMessage from "../Config/response/SecurityRole";
import SecurityRoleClass, { SecurityRoleInterface } from "../Interface/SecurityRole";
import ResponseClass from "./Response";
import Start from "./Start";



class SecurityRole extends Start implements SecurityRoleClass {
    Name: string = "";
    Description: string = "";
    RecId: number = 0;
    CreatedBy: string = "";
    CreatedDateTime: string = "";
    ModifiedBy: string = "";
    ModifiedDateTime: string = "";

    constructor(securityRole?: SecurityRoleInterface) {
        super();
        if (securityRole) {
            this.setSecurityRole(securityRole);
        } else {
            this.setBlank();
        }
    }

    /**
     * Set the values of the SecurityRole
     * @param securityRole 
     * @returns void
     */
    setSecurityRole(securityRole: SecurityRoleInterface): void {
        this.Name = securityRole.Name;
        this.Description = securityRole.Description;
        this.RecId = securityRole.RecId || 0;
        this.CreatedBy = securityRole.CreatedBy;
        this.CreatedDateTime = securityRole.CreatedDateTime || '';
        this.ModifiedBy = securityRole.ModifiedBy;
        this.ModifiedDateTime = securityRole.ModifiedDateTime || '';
    }

    /**
     * Set the values of the SecurityRole as Blank
     * @returns void
     */
    setBlank(): void {
        this.Name = '';
        this.Description = '';
        this.RecId = 0;
        this.CreatedBy = '';
        this.CreatedDateTime = '';
        this.ModifiedBy = '';
        this.ModifiedDateTime = '';
    }

    /**
     * Get the SecurityRole
     * @returns SecurityRoleInterface
     */
    get(): SecurityRoleInterface {
        return {
            Name: this.Name,
            Description: this.Description,
            CreatedBy: this.CreatedBy,
            CreatedDateTime: this.CreatedDateTime,
            ModifiedBy: this.ModifiedBy,
            ModifiedDateTime: this.ModifiedDateTime
        }
    }

    paramCreatedBy(CreatedBy: string = this.CreatedBy): string {
        this.CreatedBy = CreatedBy
        return this.CreatedBy
    }

    paramCreatedDateTime(CreatedDateTime: string = this.CreatedDateTime): string {
        this.CreatedDateTime = CreatedDateTime
        return this.CreatedDateTime
    }

    paramModifiedBy(ModifiedBy: string = this.ModifiedBy): string {
        this.ModifiedBy = ModifiedBy
        return this.ModifiedBy
    }

    paramModifiedDateTime(ModifiedDateTime: string = this.ModifiedDateTime): string {
        this.ModifiedDateTime = ModifiedDateTime
        return this.ModifiedDateTime
    }

    paramName(Name: string = this.Name): string {
        this.Name = Name
        return this.Name
    }

    paramDescription(Description: string = this.Description): string {
        this.Description = Description
        return this.Description
    }

    paramRecId(RecId: number = this.RecId): number {
        this.RecId = RecId
        return this.RecId
    }


    /**
     * Validate the SecurityRole
     * @returns void
     */
    validate(): void {
        this.validateName(this.Name);
        this.validateDescription(this.Description);
    }

    /**
     * Modify the SecurityRole
     */
    modified(): void {
        this.validate();
        this.ModifiedDateTime = this.getDateTime();
    }

    /**
     * Check the SecurityRole already exists
     * @param Name 
     */
    async checkExists(Name:string = this.Name): Promise<void> {
        let result = (await this.getWithColumns(Collections.SecurityRole, { Name: Name },["RecId"])) as unknown as SecurityRoleInterface;
        if(result !== undefined && result.RecId) throw new ResponseClass(ResStatus.BadRequest, SecurityRoleMessage.ROLE_ALREADY_EXISTS);
    }


    /**
     * Insert the SecurityRole
     */
    async insert(): Promise<void> {
        this.modified();
        this.CreatedDateTime = this.ModifiedDateTime;
        this.RecId = (await this.insertOneWithOutput(Collections.SecurityRole, this.get(), ["RecId"])).RecId
    }

    /**
     * Update the SecurityRole
    */
    async update(): Promise<void> {
        this.modified();
        await this.updateOne(Collections.SecurityRole, this.get(), { RecId: this.RecId });
    }

    /**
     * Delete the SecurityRole
     * @param RecId 
     * @param Name 
     */
    async delete(RecId: number = this.RecId, Name: string = this.Name): Promise<void> {
        await this.deleteOne(Collections.SecurityRole, { RecId: RecId, Name: Name }, "OR");

    }
    flush(): void {
        super.flush();
        this.setBlank()
    }
}


export default SecurityRole;