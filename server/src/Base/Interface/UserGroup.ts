

/**
 * UserGroupInterface
 * @export
 * @interface UserGroupInterface
 * @param Name: string
 * @param Description: string
 * @param Settings: number - RecId of the settings
 * @param RecId: number
 * @param CreatedBy: number
 * @param CreatedDateTime: Date
 * @param ModifiedBy: number
 * @param ModifiedDateTime: Date
 */
export interface UserGroupInterface {
    Name: string;
    Description: string;
    Settings: number;
    RecId?: number;
    CreatedBy: string;
    CreatedDateTime?: string;
    ModifiedBy: string;
    ModifiedDateTime?: string;
}

export default interface UserGroupClassInterface extends UserGroupInterface {

    setUserGroup(userGroup: UserGroupInterface): void;
    setBlankUserGroup(): void;
    get(): UserGroupInterface;


    // params
    paramName(Name: string): string;
    paramDescription(Description: string): string;
    paramSettings(Settings: number): number;
    paramRecId(RecId: number): number;
    paramCreatedBy(CreatedBy: string): string;
    paramCreatedDateTime(CreatedDateTime: string): string;
    paramModifiedBy(ModifiedBy: string): string;
    paramModifiedDateTime(ModifiedDateTime: string): string;

    /**
    * Get the user group
    * @param Name: string
    * @param RecId: number
    */
    getUserGroup(Name: string ,RecId:number): Promise<UserGroupInterface>;

    /**
    * Create the user group
    */
    createUserGroup(): Promise<void>;

    /**
    * Update the user group
    */
    updateUserGroup(): Promise<void>;

    /**
    * Delete the user group
    * @param Name: string
    * @param RecId: number
    */
    deleteUserGroup(Name: string ,RecId:number): Promise<void>;

}


export const EmptyUserGroup: UserGroupInterface = {
    Name: "",
    Description: "",
    Settings: 0,
    RecId: 0,
    CreatedBy: "",
    CreatedDateTime: "",
    ModifiedBy: "",
    ModifiedDateTime: ""
}