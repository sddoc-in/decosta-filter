import { Request, Response } from "express";
import UserAccess from "../../../Base/Class/UserAccess";
import Notifications from "../../../Base/Class/Notifications";
import ResponseClass from "../../../Base/Class/Response";
import ResStatus from "../../../config/response/ResStatus";
import CommonMessage from "../../../config/response/CommonMessage";
import NotificationsResponse from "../../../config/response/Notifications";
import Collections from "../../../config/collections";


class Delete{

    /**
     * Constructor
     */
    constructor() {
      this.delete = this.delete.bind(this);
    }

    /**
     * Delete Notification
     * @param req 
     * @param res 
     */
    async delete(req: Request, res: Response) {
      try {
        new UserAccess({ Id: req.body.Id, Session: req.body.Session, Token: req.body.Token }).validate();
  
        let notifications = new Notifications(req.body.notifications);
        notifications.paramModifiedBy(req.body.Id);
        await notifications.connectDb();
        await notifications.delete();
  
        let response = new ResponseClass(
          ResStatus.Success,
          NotificationsResponse.DeletedStatus
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

export default Delete;