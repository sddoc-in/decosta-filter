
/**
 * Results Interface
 * @description Results Interface
 * @param {string} PageName
 * @param {string} Description
 * @param {string} AdCreativeId
 * @param {string} AdArchiveID
 * @param {string} PageId
 * @param {string} CallToActionButton
 * @param {string} LinkUrl
 * @param {string} AdUrl
 * @param {string} PageProfileUrl
 * @param {number} IsActive
 * @param {number} TotalReach
 * @param {number} CurrentPageLike
 * @param {number} ActiveDays
 * @param {string} StartDate
 * @param {string} EndDate
 * @param {string} SearchId - RecordId of the search
 * @param {string} CreatedDateTime 
 */
export interface ResultsInterface {
    PageName: string;
    Description: string;
    AdCreativeId: string;
    AdArchiveID: string;
    PageId: string;
    CallToActionButton: string;
    LinkUrl: string;
    AdUrl: string;
    PageProfileUrl: string;
    IsActive: number;
    TotalReach: number;
    CurrentPageLike: number;
    Duplicate: number;
    ActiveDays: string;
    StartDate: string;
    EndDate: string;
    SearchId: string;
    CreatedDateTime: string;
    RecId?: number;
}

export default interface ResultsInterfaceClass extends ResultsInterface {
    setResults(results: ResultsInterface): void;
    setBlank(): void;
    insert(): void;
    delete(): void;
    get(): ResultsInterface;
    flush(): void;

    // params
    paramPageName(PageName: string): string;
    paramDescription(Description: string): string;
    paramAdCreativeId(AdCreativeId: string): string;
    paramAdArchiveID(AdArchiveID: string): string;
    paramPageId(PageId: string): string;
    paramCallToActionButton(CallToActionButton: string): string;
    paramLinkUrl(LinkUrl: string): string;
    paramAdUrl(AdUrl: string): string;
    paramPageProfileUrl(PageProfileUrl: string): string;
    paramIsActive(IsActive: number): number;
    paramTotalReach(TotalReach: number): number;
    paramCurrentPageLike(CurrentPageLike: number): number;
    paramActiveDays(ActiveDays: string): string;
    paramStartDate(StartDate: string): string;
    paramEndDate(EndDate: string): string;
    paramSearchId(SearchId: string): string;
    paramCreatedDateTime(CreatedDateTime: string): string;
    paramRecId(RecId: number): number;
}

export const EmptyResults: ResultsInterface = {
    PageName: "",
    Description: "",
    AdCreativeId: "",
    AdArchiveID: "",
    PageId: "",
    CallToActionButton: "",
    LinkUrl: "",
    AdUrl: "",
    PageProfileUrl: "",
    IsActive: 0,
    TotalReach: 0,
    CurrentPageLike: 0,
    Duplicate: 0,
    ActiveDays: "",
    StartDate: "",
    EndDate: "",
    SearchId: "",
    CreatedDateTime: "",
    RecId: 0
}


