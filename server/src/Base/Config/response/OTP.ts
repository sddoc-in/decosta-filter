
/**
 * OTP Message
 * @enum {string}
 */
enum OTPMessage {
    OTP_SENT = "OTP sent successfully",
    OTP_VERIFIED = "OTP verified successfully",
    OTP_EXPIRED = "OTP expired",
    OTP_INVALID = "Invalid OTP",
    OTP_NOT_SENT = "OTP not sent",
    OTP_NOT_VERIFIED = "OTP not verified",
    OTP_RESEND = "OTP resent successfully",
    OTP_RESEND_LIMIT = "OTP resend limit reached",
    OTP_RESEND_TIME = "Please wait for sometime before resending OTP",
    OTPRequired = "OTP is required",
    UserIdRequired = "UserId is required",
}

export default OTPMessage;