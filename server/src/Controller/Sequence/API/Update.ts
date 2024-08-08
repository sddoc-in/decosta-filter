import { Request, Response } from "express";
import Sequence from "../../../Base/Class/Sequence";
import ResStatus from "../../../Base/Config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import SequenceFields from "../../../Base/Config/response/Sequence";
import CommonMessage from "../../../Base/Config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import SecurityUserRole from "../../../Base/Class/SecurityUserRole";
import Collections from "../../../Base/Config/collections";

class UpdateSequence {
  /**
   * Constructor
   */
  constructor() {
    this.updateSequence = this.updateSequence.bind(this);
  }

  /**
   * Update Sequence
   * @param req
   * @param res
   * @returns Response
   * @Update Sequence
   */
  async updateSequence(req: Request, res: Response) {
    try {
      new UserAccess({ Id: req.body.Id as string, Session: req.body.Session as string, Token: req.body.Token as string }).validate();
      await new SecurityUserRole().checkAdmin(req.body.Id);


      let sequence = new Sequence(req.body.sequence);
      sequence.paramModifiedBy(req.body.Id);
      await sequence.connectDb();
      await sequence.checkNotExist();
      await sequence.update();

      let response = new ResponseClass(
        ResStatus.Success,
        SequenceFields.SequenceUpdated
      );
      response.setData(await sequence.getOne(Collections.SequenceFull, { RecId: sequence.paramRecId() }));
      sequence.flush();

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


export default UpdateSequence;