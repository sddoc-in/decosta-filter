
/**
 * Enum for Recurrence Messages
 * @enum {string}
 */
enum RecurrenceMessage {
    Created = "Recurrence Created Successfully",
    Updated = "Recurrence Updated Successfully",
    Deleted = "Recurrence Deleted Successfully",
    AlreadyExists = "Recurrence Already Exists",
    NotFound = "Recurrence Not Found",
    Found = "Recurrence Found",
    RecurrenceStartDateTime = "Recurrence Start Date Time is required",
    RecurrenceEndDateTime = "Recurrence End Date Time is required",
    StartDateGreaterThanEndDate = "Recurrence Start Date should be less than Recurrence End Date",
}


export default RecurrenceMessage;