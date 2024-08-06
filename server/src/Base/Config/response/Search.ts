

/**
 * Enum for search messages
 * @readonly
 */

enum SearchMessage {
    SearchStarted = "Search started",
    SearchCompleted = "Search completed",
    SearchFailed = "Search failed",
    SearchNotFound = "Search not found",
    SearchFound = "Search found",
    SearchAlreadyExists = "Search already exists",
    SearchCreated = "Search created",
    SearchUpdated = "Search updated",
    SearchDeleted = "Search deleted",
    SearchStopped = "Search stopped",
    QueryEmpty = "Query is empty",
    SearchIdEmpty = "SearchId is empty",
    SearchIdNotExists = "SearchId does not exist",
    SearchIdExists = "SearchId already exists",
    SearchIdNotValid = "SearchId is not valid",
    StartDateEmpty = "StartDate is empty",
    EndDateEmpty = "EndDate is empty",
    StartDateNotValid = "StartDate is not valid",
    EndDateNotValid = "EndDate is not valid",
    StartDateGreaterThanEndDate = "StartDate is greater than EndDate",
}

export default SearchMessage;
