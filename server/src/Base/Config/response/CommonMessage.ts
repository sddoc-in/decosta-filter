enum CommonMessage {
  InvalidToken = "Invalid Token",
  TokenExpired = "Token Expired",
  SessionExpired = "Session Expired",
  SessionRequired = "Session Required",
  ConnectionError = "Error connecting to MongoDB Atlas",
  ConnectionSuccess = "Connection to MongoDB Atlas established!",
  InvalidRequest = "Invalid Request",
  InvalidCredentials = "Invalid Credentials",
  UnknownError = "Unknown Error",
  InternalServerError = "Internal Server Error",
  ServiceUnavailable = "Service Unavailable",
  OrganisationWorkspaceNotFound = "Organisation Or Workspace Not Found",
  Success = "Success",
  NotFound = "Not Found",
  InvalidData = "Invalid Data",
  DataFound = "Data Found",
}

export default CommonMessage;
