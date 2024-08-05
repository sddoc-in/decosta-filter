

/**
 * Enum for SysEmailParamsMessage
 * @readonly
 */
enum SysEmailParamsMessage{
    SMTPDomain = "SMTP Domain is required",
    SMTPPort = "SMTP Port is required",
    SMTPUserName = "SMTP User Name is required",
    SMTPPassword = "SMTP Password is required",
    BrevoAPIKey = "Brevo API Key is required",
    BrevoAPISecret = "Brevo API Secret is required",
    SendGridAPIKey = "SendGrid API Key is required",
    SendGridAPISecret = "SendGrid API Secret is required",
    
    SysEmailParamsCreated = "EmailParams Created",
    SysEmailParamsUpdated = "EmailParams Updated",
    SysEmailParamsDeleted = "EmailParams Deleted",
    SysEmailParamsAlreadyExists = "EmailParams Already Exists",
    SysEmailParamsNotFound = "EmailParams Not Found",
    SysEmailParamsFound = "EmailParams Found",
}



export default SysEmailParamsMessage;