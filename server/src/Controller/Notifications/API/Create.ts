import { Request, Response } from "express";
import ResponseClass from "../../../Base/Class/Response";
import ResStatus from "../../../config/response/ResStatus";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import Notifications from "../../../Base/Class/Notifications";
import Collections from "../../../config/collections";
import NotificationsResponse from "../../../config/response/Notifications";
import SysTableId from "../../../Base/Class/SysTableId";
import ProjTable from "../../../Base/Class/ProjTable";


class Create {

  /**
   * Constructor
   */
  constructor() {
    this.create = this.create.bind(this);
  }

  /**
   * Create Notification
   * @param req 
   * @param res 
   */
  async create(req: Request, res: Response) {
    try {
      new UserAccess({ Id: req.body.Id, Session: req.body.Session, Token: req.body.Token }).validate();


      if(req.body.Ref.Table === Collections.ProjTable) {
        await new ProjTable().statusChange(Number(req.body.Ref.RecId), Number(req.body.notifications.Status));
      }

      let notifications = new Notifications(req.body.notifications);
      notifications.paramRefRecId(req.body.Ref.RecId);
      notifications.paramRefTableId(await new SysTableId().getTableId(req.body.Ref.Table)); 
      notifications.paramCreatedBy(req.body.Id);
      notifications.paramModifiedBy(req.body.Id);
      await notifications.connectDb();
      await notifications.insert();

      let response = new ResponseClass(
        ResStatus.Success,
        NotificationsResponse.CreatedStatus
      );
      response.setData(
        await notifications.getOne(Collections.Notifications, { RecId: notifications.paramRecId() })
      );
      notifications.flush();
      return res.status(ResStatus.Success).send(response.getResponse());
    } catch (error) {
      if (error instanceof ResponseClass) {
        return res.status(error.getStatus()).send(error.getResponse());
      }
      return res.status(ResStatus.InternalServerError)
        .send(
          new ResponseClass(
            ResStatus.InternalServerError,
            CommonMessage.InternalServerError
          ).getResponse()
        );
    }
  }
}
export default Create;