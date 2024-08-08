

/**
 * Recurrence Interface
 * @interface RecurrenceInterface
 *  -- Used For Recurrence Filters
 * @param Country - Country of the Recurrence - if multiple countries are selected then it will be stored as a string separated by comma
 * @param ContentLanguages - Content languages of the Recurrence - if multiple languages are selected then it will be stored as a string separated by comma
 * @param StartDate - Start date of the Recurrence
 * @param EndDate - End date of the Recurrence
 * @param Query - Query of the Recurrence
 * @param AdStatus - Ad status of the Recurrence
 * @param AdType - Ad type of the Recurrence
 * @param MinReach - Minimum reach of the Recurrence
 * @param MaxReach - Maximum reach of the Recurrence
 * @param MediaType - Media type of the Recurrence - if multiple media types are selected then it will be stored as a string separated by comma
 * @param PublisherPlatforms - Publisher platforms of the Recurrence - if multiple platforms are selected then it will be stored as a string separated by comma
 * 
 * -- Used For Keeping Details of the Recurrence
 * @param RecurrenceId - Recurrence Id of the Recurrence - through a sequence number
 * @param RecurrenceStatus - Recurrence status of the Recurrence - Created - 0, InProgress - 1, Stopped - 2, Completed - 3
 * @param RecurenceStartDateTime - Recurrence start date time of the Recurrence
 * @param RecurrenceEndDateTime - Recurrence end date time of the Recurrence
 * @param Progress - Progress of the Recurrence - recors how may searches has been done by this recurrence
 * @param CreatedDateTime - Created date time of the Recurrence
 * @param CreatedBy - Created by of the Recurrence - User ID
 * @param RecId - RecordId of the Recurrence
 */
export interface RecurrenceInterface {

    // Filter
    Country: string;
    ContentLanguages: string;
    StartDate: string;
    EndDate: string;
    Query: string;
    AdStatus: string;
    AdType: string;
    MinReach: number;
    MaxReach: number;
    MediaType: string;
    PublisherPlatforms: string;

    // Metadata
    RecurrenceId: string;
    RecurrenceStatus: number;
    RecurenceStartDateTime?: string;
    RecurrenceEndDateTime?: string;
    Progress: number;
    CreatedDateTime?: string;
    CreatedBy: string;
    ModifiedBy?: string;
    ModifiedDateTime?: string;
    RecId?: number;

    // Extra
    ScheduleDateTime: string;
    RecurrenceType: number;
}

export default interface RecurrenceClass extends RecurrenceInterface {
    setRecurrence(recurrence: RecurrenceInterface): void;
    setBlank(): void;
    validate(): void;
    modified(): void;
    flush(): void;

    // params
    paramCreatedBy(CreatedBy: string): string;
    paramCreatedDateTime(CreatedDateTime: string): string;
    paramModifiedBy(ModifiedBy: string): string;
    paramModifiedDateTime(ModifiedDateTime: string): string;
    paramRecId(RecId: number): number;
    paramRecurrenceId(RecurrenceId: string): string;
    paramRecurrenceStatus(RecurrenceStatus: number): number;
    paramRecurenceStartDateTime(RecurenceStartDateTime: string): string;
    paramRecurrenceEndDateTime(RecurrenceEndDateTime: string): string;
    paramProgress(Progress: number): number;
    paramCountry(Country: string): string;
    paramContentLanguages(ContentLanguages: string): string;
    paramStartDate(StartDate: string): string;
    paramEndDate(EndDate: string): string;
    paramQuery(Query: string): string;
    paramAdStatus(AdStatus: string): string;
    paramAdType(AdType: string): string;
    paramMinReach(MinReach: number): number;
    paramMaxReach(MaxReach: number): number;
    paramMediaType(MediaType: string): string;
    paramPublisherPlatforms(PublisherPlatforms: string): string;
    paramScheduleDateTime(ScheduleDateTime: string): string;
    paramRecurrenceType(RecurrenceType: number): number;

    /**
     * Get the Recurrence
     * @param RecurrenceId: string
     */
    getRecurrence(RecurrenceId: string,RecId:number): Promise<RecurrenceInterface>;

    /**
     * Create the Recurrence
     */
    createRecurrence(): Promise<void>;

    /**
     * Update the Recurrence
     */
    updateRecurrence(): Promise<void>;

    /**
     * Delete the Recurrence
     */
    deleteRecurrence(): Promise<void>;

}


export const EmptyRecurrence: RecurrenceInterface = {
    Country: '',
    ContentLanguages: '',
    StartDate: "",
    EndDate: "",
    Query: '',
    AdStatus: '',
    AdType: '',
    MinReach: 0,
    MaxReach: 0,
    MediaType: '',
    PublisherPlatforms: '',
    RecurrenceId: '',
    RecurrenceStatus: 0,
    RecurenceStartDateTime: '',
    RecurrenceEndDateTime: '',
    Progress: 0,
    CreatedDateTime: '',
    CreatedBy: '',
    RecId: 0,
    ScheduleDateTime: '',
    RecurrenceType: 0
}