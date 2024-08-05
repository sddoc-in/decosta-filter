import { Request, Response } from "express";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import Notifications from "../../../Base/Class/Notifications";
import { NotificationAction } from "../../../config/Notification";
import Collections from "../../../config/collections";
import convertDataForInterface from "../../../Base/Utills/convertDataForInterface";
import { EmptyNotifications } from "../../../Base/Interface/Notifications";
import SysTableId from "../../../Base/Class/SysTableId";
import ProjStatus from "../../../config/ProjStatus";
import { EmptyProjTable } from "../../../Base/Interface/ProjTable";


class Action {

    /**
     * Constructor
     */
    constructor() {
        this.send = this.send.bind(this);
    }

    /**
     * Send Notification
     * @param req
     * @param res
     * @returns Response
     * @Send Notification
     */
    async send(req: Request, res: Response) {
        try {
            new UserAccess({ Id: req.body.Id as string, Session: req.body.Session as string, Token: req.body.Token as string }).validate();

            let RecId = parseInt(req.body.notifications);
            let action = parseInt(req.body.action);

            if (action === NotificationAction.Clear) {
                let notification = new Notifications();
                notification.paramRecId(RecId);
                notification.paramModifiedBy(req.body.Id);
                await notification.connectDb();
                await notification.updateOne(Collections.Notifications, { RecId: RecId }, { Show: 1,Action: 1 })
                notification.flush();

                return res.status(ResStatus.Success).send(
                    new ResponseClass(
                        ResStatus.Success,
                        CommonMessage.Success
                    ).getResponse()
                );
            }
            if (action === NotificationAction.RejectProjectStatusChange) {
                let notification = new Notifications();
                notification.paramRecId(RecId);
                notification.paramModifiedBy(req.body.Id);
                await notification.connectDb();
                await notification.updateOne(Collections.Notifications, { RecId: RecId }, { Show: 1,Action: 1 })
                let oldNotification = (await notification.getOne(Collections.NotificationDetails, { RecId: RecId }));
                notification.setBlank();
                notification.paramCreatedBy(req.body.Id);
                notification.paramModifiedBy(req.body.Id);
                notification.paramType(1);
                notification.paramTitle("Status Change Rejected");
                notification.paramDescription(`Status Change has been rejected by ${oldNotification.GeneratedForName}`);
                notification.paramShow(0);
                notification.paramGeneratedBy(oldNotification.GeneratedForUserId);
                notification.paramGeneratedFor(Number(oldNotification.GeneratedByRecId));
                await notification.insert();
                notification.flush();

                return res.status(ResStatus.Success).send(
                    new ResponseClass(
                        ResStatus.Success,
                        CommonMessage.Success
                    ).getResponse()
                );
            }
            if(action === NotificationAction.ApproveProjectStatusChange){
                let notification = new Notifications();
                notification.paramRecId(RecId);
                notification.paramModifiedBy(req.body.Id);
                await notification.connectDb();
                await notification.updateOne(Collections.Notifications, { RecId: RecId }, { Show: 1,Action: 1 })
                let oldNotification = (await notification.getOne(Collections.NotificationDetails, { RecId: RecId }));
                notification.setBlank();
                notification.paramCreatedBy(req.body.Id);
                notification.paramModifiedBy(req.body.Id);
                notification.paramType(1);
                notification.paramTitle("Status Change Approved");
                notification.paramDescription(`Status Change has been approved by ${oldNotification.GeneratedForName}`);
                notification.paramShow(0);
                notification.paramGeneratedBy(oldNotification.GeneratedForUserId);
                notification.paramGeneratedFor(Number(oldNotification.GeneratedByRecId));
                await notification.insert();

                let proj =  convertDataForInterface((await notification.getOne(Collections.ProjTable, { RecId: oldNotification.MainRecId })),EmptyProjTable);

                await notification.updateOne(Collections.ProjTable, { RecId: oldNotification.MainRecId }, { Status: oldNotification.Status });

                notification.setBlank();
                notification.paramCreatedBy(req.body.Id);
                notification.paramModifiedBy(req.body.Id);
                notification.paramType(1);
                notification.paramTitle("Project Status Changed");
                notification.paramDescription(`Project Status has been changed to ${ProjStatus[oldNotification.Status]} by ${oldNotification.GeneratedForName}`);
                notification.paramShow(0);
                notification.paramGeneratedBy(oldNotification.GeneratedForUserId);
                notification.paramGeneratedFor(Number(proj.ProjManager));
                await notification.insert();
                
                notification.flush()

                return res.status(ResStatus.Success).send(
                    new ResponseClass(
                        ResStatus.Success,
                        CommonMessage.Success
                    ).getResponse()
                );
            }
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

export default Action;