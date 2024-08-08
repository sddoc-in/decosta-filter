import Sequence from "../../../Base/Class/Sequence";
import ResStatus from "../../../Base/Config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import SequenceFields from "../../../Base/Config/response/Sequence";
import CommonMessage from "../../../Base/Config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import { Request, Response } from "express";
import SecurityUserRole from "../../../Base/Class/SecurityUserRole";


class DeleteSequence{
    /**
     * Constructor
     */
    constructor() {
      this.deleteSequence = this.deleteSequence.bind(this);
    }

    /**
     * Delete Sequence
     * @param req
     * @param res
     * @returns Response
     * @Delete Sequence
     */
    async deleteSequence(req: Request, res: Response) {
      try {
        new UserAccess({ Id: req.query.Id as string, Session: req.query.Session as string, Token: req.query.Token as string }).validate();
        await new SecurityUserRole().checkAdmin(req.query.Id as string);

  
        let seq = new Sequence();
        await seq.connectDb();
        await seq.delete(0,parseInt(req.query.sequence as string));
        seq.flush();
  
        return res
          .status(ResStatus.Success)
          .send(
            new ResponseClass(
              ResStatus.Success,
              SequenceFields.SequenceDeleted
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

export default DeleteSequence