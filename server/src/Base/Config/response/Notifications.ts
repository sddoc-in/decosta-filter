
/**
 * enum NotificationsResponse
 * @description Notifications response messagess
 */
enum NotificationsResponse {
    GeneratedBy = "GeneratedBy is required",
    GeneratedFor = "GeneratedFor is required",
    Title = "Title is required",
    Description = "Description is required",
    CreatedStatus = "Notification created successfully",
    UpdatedStatus = "Notification updated successfully",
    DeletedStatus = "Notification deleted successfully",
    NotFound = "Notification not found",
    InvalidId = "Invalid notification id",
    ApprovedStatus = "Approved successfully",
    RejectedStatus = "Rejected successfully",
}


export default NotificationsResponse;