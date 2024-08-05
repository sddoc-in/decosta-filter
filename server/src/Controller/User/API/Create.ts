import { Request, Response } from "express";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import UserFieldsMessage from "../../../config/response/User";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import User from "../../../Base/Class/User";
import SecurityUserRole from "../../../Base/Class/SecurityUserRole";
import EmailSender from "../../../Base/Class/Email";

/**
 * Create User
 */
class CreateUser {

  /**
   * Constructor
   */
  constructor() {
    this.createUser = this.createUser.bind(this);
    this.addUser = this.addUser.bind(this);
  }

  /**
   * Create User
   * @param req
   * @param res
   */
  async createUser(req: Request, res: Response) {
    try {
      const user = new User(req.body.user);
      user.paramId("Admin")
      user.paramCreatedBy("Admin")
      user.paramModifiedBy("Admin")
      await user.connectDb();
      await user.insert();

      // const securityRole = new SecurityRole({
      //   Name:"System Administator",
      //   Description:"System Administator with full access to the system",
      //   CreatedBy:"Admin",
      //   ModifiedBy:"Admin"
      // });
      // await securityRole.connectDb();
      // await securityRole.insert();

      // let securityUserRole = new SecurityUserRole({
      //   UserId:user.Id,
      //   SecurityRole:securityRole.paramRecId(),
      //   CreatedBy:"Admin",
      //   ModifiedBy:"Admin"
      // });
      // await securityUserRole.connectDb();
      // await securityUserRole.insert();


      let userAccess = new UserAccess();
      userAccess.paramId(user.Id);
      await userAccess.connectDb();
      await userAccess.insert(user.Email);

      let response = new ResponseClass(
        ResStatus.Success,
        UserFieldsMessage.UserSuccessfullyCreated
      );
      response.setData({
        Name: user.paramName(),
        Email: user.paramEmail(),
        ...userAccess.get(),
      });
      user.flush();
      userAccess.flush();
      // securityRole.flush();
      // securityUserRole.flush();

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
   * Add User
   * @param req
   * @param res
   */
  async addUser(req: Request, res: Response) {

    try {
      new UserAccess({ Id: req.body.Id, Session: req.body.Session, Token: req.body.Token }).validate();
      await new SecurityUserRole().checkAdmin(req.body.Id);

      const user = new User(req.body.user);
      user.paramCreatedBy(req.body.Id);
      user.paramModifiedBy(req.body.Id);
      await user.connectDb();
      await user.checkExists();
      await user.insert();

      let emailSender = new EmailSender();
      let To = {
        mailTo: user.paramEmail(),
        name: user.paramName()
      }

      await emailSender.sendEmail(
        [To],
        "User Created",
        emailSender.generateBodyForNewUser(To.name, To.mailTo, req.body.user.Password)
      )

      let response = new ResponseClass(
        ResStatus.Success,
        UserFieldsMessage.UserSuccessfullyCreated
      );
      response.setData({
        Id: user.paramId(),
        Name: user.paramName(),
        Email: user.paramEmail(),
        Enabled: user.paramEnabled(),
        StartPage: user.paramStartPage(),
        Language: user.paramLanguage(),
        CreatedBy: user.paramCreatedBy(),
        CreatedDateTime: user.paramCreatedDateTime(),
        RecId: user.paramRecId(),
      });
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

export default CreateUser;
