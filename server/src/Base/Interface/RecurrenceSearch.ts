
/**
 * RecurrenceSearchInterface
 * @export
 */
export interface RecurrenceSearchInterface {
    SearchId: number;
    RecurrenceId: number;
    RecId: number;
    CreatedBy: string;
    CreatedDateTime: string;
}

export default interface RecurrenceSearchClassInterface extends RecurrenceSearchInterface {

    setRecurrenceSearch(recurrenceSearch: RecurrenceSearchInterface): void;
    setBlankRecurrenceSearch(): void;
    get(): RecurrenceSearchInterface;

    // params
    paramSearchId(SearchId: number): number;
    paramRecurrenceId(RecurrenceId: number): number;
    paramRecId(RecId: number): number;
    paramCreatedBy(CreatedBy: string): string;
    paramCreatedDateTime(CreatedDateTime: string): string;

    /**
     * Get the recurrence search
     * @param SearchId: number
     * @param RecurrenceId: number
     */
    getRecurrenceSearch(SearchId: number, RecurrenceId: number): Promise<RecurrenceSearchInterface>;

    /**
     * Create the recurrence search
     */
    createRecurrenceSearch(): Promise<void>;

    /**
     * Update the recurrence search
     */
    updateRecurrenceSearch(): Promise<void>;

    /**
     * Delete the recurrence search
     */
    deleteRecurrenceSearch(SearchId: number, RecurrenceId: number): Promise<void>;
}


export const RecurrenceSearch = {
    SearchId: 0,
    RecurrenceId: 0,
    RecId: 0,
    CreatedBy: '',
    CreatedDateTime: ''
} as RecurrenceSearchInterface
