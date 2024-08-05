import { Request, Response } from "express";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import UserFieldsMessage from "../../../config/response/User";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import User from "../../../Base/Class/User";
import SecurityUserRole from "../../../Base/Class/SecurityUserRole";

/**
 * Delete User
 */
class DeleteUser {

  /**
   * Constructor
   */
  constructor() {
    this.deleteUser = this.deleteUser.bind(this);
  }

  /**
   * Update User
   * @param req
   * @param res
   */
  async deleteUser(req: Request, res: Response) {
    try {

      new UserAccess({ Id: req.query.Id as string, Session: req.query.Session as string, Token: req.query.Token as string }).validate();
      await new SecurityUserRole().checkAdmin(req.query.Id as string);
      let deleteId = req.query.user as string;
      const user = new User();
      user.paramId(deleteId);
      await user.connectDb();
      await user.checkNotExists(deleteId);
      await user.delete();
      user.flush();

      let userAccess = new UserAccess()
      userAccess.paramId(deleteId)
      await userAccess.connectDb();
      await userAccess.delete();
      userAccess.flush()

      let securityUserRole = new SecurityUserRole()
      securityUserRole.paramUser(deleteId)
      await securityUserRole.connectDb();
      await securityUserRole.delete();
      securityUserRole.flush()

      return res
        .status(ResStatus.Success)
        .send(
          new ResponseClass(
            ResStatus.Success,
            UserFieldsMessage.UserDeleted
          ).getResponse()
        );
    } catch (error) {
      if (error instanceof ResponseClass) {
        return res.status(error.getStatus()).send(error.getResponse());
      }
      return res
        .status(ResStatus.InternalServerError)
        .send(
          new ResponseClass(
            ResStatus.InternalServerError,
            CommonMessage.InternalServerError
          ).getResponse()
        );
    }
  }
}

export default DeleteUser;
