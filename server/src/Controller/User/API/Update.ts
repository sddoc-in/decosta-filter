import { Request, Response } from "express";
import ResStatus from "../../../Base/Config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import UserFieldsMessage from "../../../Base/Config/response/User";
import CommonMessage from "../../../Base/Config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import User from "../../../Base/Class/User";
import Collections from "../../../Base/Config/collections";
import Hash from "../../../Base/Class/Hash";

/**
 * Update User
 */
class UpdateUser {

  /**
   * Constructor
   */
  constructor() {
    this.updateUser = this.updateUser.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }


  /**
   * Update User
   * @param req
   * @param res
   */
  async updateUser(req: Request, res: Response) {
    try {
      new UserAccess({ Id: req.body.Id, Session: req.body.Session, Token: req.body.Token }).validate();

      const user = new User(req.body.user);
      if (user.paramPassword() !== "") {
        throw new ResponseClass(
          ResStatus.BadRequest,
          UserFieldsMessage.CannotUpdatePassword
        );
      }

      user.validate();
      user.paramModifiedBy(req.body.Id);
      await user.connectDb();
      await user.checkNotExists();
      await user.update();

      let response = new ResponseClass(
        ResStatus.Success,
        UserFieldsMessage.UserUpdated
      );
      response.setData({ ...user.getUser() });
      user.flush();
      return res.status(ResStatus.Success).send(response.getResponse());
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

  /**
   * Update Password
   * @param req
   * @param res
   */
  async updatePassword(req: Request, res: Response) {
    try {


      let password = req.body.Password as string;
      let RecId = req.body.RecId as string;
      let Email = req.body.Email as string;


      const user = new User();
      user.validatePassword(password);
      user.paramPassword(password);
      await user.connectDb();
      await user.checkNotExists("", Email);
      await user.updateOne(Collections.User, { RecId: RecId, Email: Email }, { Password: new Hash(user.paramPassword()).hash() });
      user.flush();

      return res.status(ResStatus.Success).send(new ResponseClass(
        ResStatus.Success,
        UserFieldsMessage.UserUpdated
      ).getResponse());
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

export default UpdateUser;
