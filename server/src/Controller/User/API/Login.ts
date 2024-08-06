
import { Request, Response } from "express";
import ResStatus from "../../../Base/Config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import UserFieldsMessage from "../../../Base/Config/response/User";
import CommonMessage from "../../../Base/Config/response/CommonMessage";
import Hash from "../../../Base/Class/Hash";
import UserAccess from "../../../Base/Class/UserAccess";
import User from "../../../Base/Class/User";
import SecurityUserRole from "../../../Base/Class/SecurityUserRole";
// import SecurityUserRole from "../../../Base/Class/SecurityUserRole";

/**
 * Login User
 */
class LoginUser {

  /**
   * Constructor
   */
  constructor() {
    this.loginUser = this.loginUser.bind(this);
  }

  /**
   * Create User
   * @param req
   * @param res
   */

  async loginUser(req: Request, res: Response) {


    try {

      let email = req.query.email as string;
      let password = req.query.password as string;

      const user = new User();
      user.paramEmail(email);
      user.paramPassword(password);
      user.validatePassword(password);
      await user.connectDb();
      let curUser = await user.getUser()
      let matches = new Hash(password).compareHash(curUser.Password);
      if (!matches) {
        return res
          .status(ResStatus.BadRequest)
          .send(
            new ResponseClass(
              ResStatus.BadRequest,
              CommonMessage.InvalidCredentials
            ).getResponse()
          );
      }
      let userAccess = new UserAccess();
      userAccess.paramId(curUser.Id);
      await userAccess.connectDb();
      await userAccess.update(email);


      let response = new ResponseClass(
        ResStatus.Success,
        UserFieldsMessage.LoginSuccess
      );
      response.setData({
        Name: curUser.Name,
        Email: curUser.Email,
        Enabled: curUser.Enabled,
        ...userAccess.get(),
        Roles:await new SecurityUserRole().getSecurityRole(userAccess.paramId())
      });
      userAccess.flush();
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
}

export default LoginUser;
