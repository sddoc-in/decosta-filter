import Collections from "../Config/collections";
import ResStatus from "../Config/response/ResStatus";
import SecurityUserRoleMessage from "../Config/response/SecurityUserRole";
import { AdminRecId } from "../Config/Admin";
import SecurityUserRoleClass, { SecurityUserRoleInterface } from "../Interface/SecurityUserRole";
import ResponseClass from "./Response";
import Start from "./Start";



class SecurityUserRole extends Start implements SecurityUserRoleClass {
    SecurityRole: number = 0;
    UserId: string = '';
    RecId: number = 0;
    CreatedBy: string = '';
    CreatedDateTime: string = '';
    ModifiedBy: string = '';
    ModifiedDateTime: string = '';

    constructor(securityUserRole?: SecurityUserRoleInterface) {
        super();
        if (securityUserRole) {
            this.setSecurityUserRole(securityUserRole);
        } else {
            this.setBlank();
        }
    }

    setSecurityUserRole(securityUserRole: SecurityUserRoleInterface): void {
        this.SecurityRole = securityUserRole.SecurityRole;
        this.UserId = securityUserRole.UserId;
        this.RecId = securityUserRole.RecId || 0;
        this.CreatedBy = securityUserRole.CreatedBy;
        this.CreatedDateTime = securityUserRole.CreatedDateTime || '';
        this.ModifiedBy = securityUserRole.ModifiedBy;
        this.ModifiedDateTime = securityUserRole.ModifiedDateTime || '';
    }

    setBlank(): void {
        this.SecurityRole = 0;
        this.UserId = '';
        this.RecId = 0;
        this.CreatedBy = '';
        this.CreatedDateTime = '';
        this.ModifiedBy = '';
        this.ModifiedDateTime = '';
    }

    get(): SecurityUserRoleInterface {
        return {
            SecurityRole: this.SecurityRole,
            UserId: this.UserId,
            CreatedBy: this.CreatedBy,
            CreatedDateTime: this.CreatedDateTime,
            ModifiedBy: this.ModifiedBy,
            ModifiedDateTime: this.ModifiedDateTime
        }
    }

    flush(): void {
        super.flush();
        this.setBlank();
    }

    validate(): void {
        if (this.SecurityRole === 0) {
            throw new ResponseClass(ResStatus.BadRequest, 'SecurityRole is required')
        }
        if (this.UserId === '') {
            throw new ResponseClass(ResStatus.BadRequest, 'User is required')
        }
    }

    modified(): void {
        this.validate();
        this.ModifiedDateTime = this.getDateTime();
    }

    /**
     * Check if the SecurityUserRole exists
     * @param SecurityRole 
     * @param UserId 
     */
    async checkExists(SecurityRole: number = this.SecurityRole, UserId: string = this.UserId): Promise<void> {
        let result = (await this.getWithColumns(Collections.SecurityUserRole, { SecurityRole: SecurityRole, UserId: UserId }, ["RecId"])) as unknown as SecurityUserRoleInterface;
        if (result !== undefined && result.RecId) throw new ResponseClass(ResStatus.BadRequest, SecurityUserRoleMessage.USER_ROLE_ALREADY_EXISTS);
    }

    /**
     * Check if the User is Admin
     */
    async checkAdmin(UserId: string = this.UserId): Promise<void> {
        try {
            await this.connectDb()
            let result = (await this.getWithColumns(Collections.SecurityUserRole, { UserId: UserId, SecurityRole: AdminRecId }, ["RecId"])) as unknown as SecurityUserRoleInterface;
            if (result === undefined || !result.RecId) throw new ResponseClass(ResStatus.BadRequest, SecurityUserRoleMessage.USER_NOT_ADMIN);
        } catch (e) {
            throw new ResponseClass(ResStatus.BadRequest, SecurityUserRoleMessage.USER_NOT_ADMIN);
        }
        finally {
            this.flush()
        }

    }

    /**
     * Get the SecurityUserRole
     * @param UserId
     */
    async getSecurityRole(UserId: string = this.UserId) {
        try {
            await this.connectDb();
            let result = (await this.getAllWithColumns(Collections.SecurityUser, { UserId: UserId }, ["Name"])) as any[]
            this.flush();
            // result = result.map((item) => item.Name); // for multiple roles
            return result[0].Name; // for single role
        } catch (e) {
            this.flush();
            throw new ResponseClass(ResStatus.BadRequest, SecurityUserRoleMessage.USER_ROLE_NOT_FOUND);
        }
    }

    /**
     * Insert the SecurityUserRole
     */
    async insert(): Promise<void> {
        this.modified();
        this.CreatedDateTime = this.getDateTime();
        this.RecId = (await this.insertOneWithOutput(Collections.SecurityUserRole, this.get(), ["RecId"])).RecId
    }

    /**
     * Update the SecurityUserRole
     */
    async update(): Promise<void> {
        this.modified();
        await this.updateOne(Collections.SecurityUserRole, { RecId: this.RecId }, this.get());
    }

    /**
     * Delete the SecurityUserRole
     * @param RecId 
     * @param UserId 
     */
    async delete(RecId: number = this.RecId, UserId: string = this.UserId): Promise<void> {
        await this.deleteOne(Collections.SecurityUserRole, { RecId: RecId, UserId: UserId }, "OR");
    }

    // params
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

    paramSecurityRole(SecurityRole: number = this.SecurityRole): number {
        return this.SecurityRole = SecurityRole;
    }

    paramUser(User: string = this.UserId): string {
        return this.UserId = User;
    }

    paramRecId(RecId: number = this.RecId): number {
        return this.RecId = RecId;
    }

}


export default SecurityUserRole;