
/**
 * interface for Settings
 * @param MaxExtractionPerDay: number
 * @param MaxExtractionPerMonth: number
 * @param MaxSearchPerDay: number
 * @param MaxSearchPerMonth: number
 * @param HiddenResultsColumns: string - filter the columns in the results
 * @param RecId: number
 * @param UserId: number - when user create their own settings
 * @param CreatedBy: string
 * @param CreatedDateTime: Date 
 * @param ModifiedBy: string
 * @param ModifiedDateTime: Date
 */
export interface SettingsInterface {
    MaxExtractionPerDay: number;
    MaxExtractionPerMonth: number;
    MaxSearchPerDay: number;
    MaxSearchPerMonth: number;
    HiddenResultsColumns: string;
    RecId?: number;
    UserId: string;
    CreatedBy: string;
    CreatedDateTime?: string;
    ModifiedBy: string;
    ModifiedDateTime?: string;
}


export default interface SettingsClassInterface extends SettingsInterface {

    setSettings(settings: SettingsInterface): void;
    setBlankSettings(): void;
    get(): SettingsInterface;


    // params
    paramMaxExtractionPerDay(MaxExtractionPerDay: number): number;
    paramMaxExtractionPerMonth(MaxExtractionPerMonth: number): number;
    paramMaxSearchPerDay(MaxSearchPerDay: number): number;
    paramMaxSearchPerMonth(MaxSearchPerMonth: number): number;
    paramHiddenResultsColumns(HiddenResultsColumns: string): string;
    paramRecId(RecId: number): number;
    paramUserId(UserId: string): string;
    paramCreatedBy(CreatedBy: string): string;
    paramCreatedDateTime(CreatedDateTime: string): string;
    paramModifiedBy(ModifiedBy: string): string;
    paramModifiedDateTime(ModifiedDateTime: string): string;

    /**
     * Get the settings for the user
     * @param UserId: string
     * @param RecId: number
     */
    getSettings(UserId: string, RecId: number): Promise<SettingsInterface>;

    /**
     * Create the settings for the user
     */
    createSettings(): Promise<void>;

    /**
     * Update the settings for the user
     */
    updateSettings(): Promise<void>;

    /**
     * Delete the settings for the user
     * @param UserId: string
     * @param RecId: number
     */
    deleteSettings(UserId: string, RecId: number): Promise<void>;
}


export const EmptySettings: SettingsInterface = {
    MaxExtractionPerDay: 0,
    MaxExtractionPerMonth: 0,
    MaxSearchPerDay: 0,
    MaxSearchPerMonth: 0,
    HiddenResultsColumns: '',
    RecId: 0,
    UserId: "",
    CreatedBy: "",
    ModifiedBy: "",
    CreatedDateTime: '',
    ModifiedDateTime: ''
}