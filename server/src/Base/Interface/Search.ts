

/**
 * Search Interface
 * @interface SearchInterface
 *  -- Used For Search Filters
 * @param Country - Country of the search - if multiple countries are selected then it will be stored as a string separated by comma
 * @param ContentLanguages - Content languages of the search - if multiple languages are selected then it will be stored as a string separated by comma
 * @param StartDate - Start date of the search
 * @param EndDate - End date of the search
 * @param Query - Query of the search
 * @param AdStatus - Ad status of the search
 * @param AdType - Ad type of the search
 * @param MinReach - Minimum reach of the search
 * @param MaxReach - Maximum reach of the search
 * @param MediaType - Media type of the search - if multiple media types are selected then it will be stored as a string separated by comma
 * @param PublisherPlatforms - Publisher platforms of the search - if multiple platforms are selected then it will be stored as a string separated by comma
 * @param SearchStatus - Search status of the search - Created - 0, InProgress - 1, Stopped - 2, Completed - 3
 * 
 *  -- Used For Keeping Details of the Search
 * @param SearchId - Search Id of the search - through a sequence number
 * @param FoundResults - Found results of the search - when click on search button the output will be stored here
 * @param Progress - Progress of the search - where the count of number of results found will be stored
 * @param CreatedDateTime - Created date time of the search
 * @param CreatedBy - Created by of the search - User ID
 * @param RecId - RecordId of the search
 * 
 * -- Used For Pagination
 * @param Page - Page number of the search
 * @param NextForwardCursor - Next forward cursor of the search
 * @param NextBackwardCursor - Next backward cursor of the search
 * @param NextCollationToken - Next collation token of the search
 * 
 */
interface  SearchInterface {

    // Filter
    Country:string;
    ContentLanguages:string;
    StartDate:Date;
    EndDate:Date;
    Query:string;
    AdStatus:number;
    AdType:number;
    MinReach:number;
    MaxReach:number;
    MediaType:string;
    PublisherPlatforms:string;

    // Metadata
    SearchId:string;
    SearchStatus:number;
    FoundResults:number;
    Progress:number;
    CreatedDateTime:string;
    CreatedBy:string;
    RecId:number;
    
    // Extra
    Page:number;
    NextForwardCursor:string;
    NextBackwardCursor:string;
    NextCollationToken:string;
}
