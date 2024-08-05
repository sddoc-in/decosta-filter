
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
 * @param {string} IsActive
 * @param {string} TotalReach
 * @param {string} CurrentPageLike
 * @param {string} ActiveDays
 * @param {string} StartDate
 * @param {string} EndDate
 * @param {string} SearchId - RecordId of the search
 * @param {string} CreatedDateTime 
 */
interface ResultsInterface {
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
}