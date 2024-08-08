import { Request, Response } from "express";
import ResStatus from "../../../Base/Config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import CommonMessage from "../../../Base/Config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import Sequence from "../../../Base/Class/Sequence";
import Collections from "../../../Base/Config/collections";
import SequenceFields from "../../../Base/Config/response/Sequence";

class Get {

    /**
     * Constructor
     */
    constructor() {
        this.getOne = this.getOne.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getAllSeqFor = this.getAllSeqFor.bind(this);
    }

    /**
     * Get a single Sequence
     * @param req 
     * @param res 
     */
    async getOne(req: Request, res: Response) {
        try {
            new UserAccess({ Id: req.query.Id as string, Session: req.query.Session as string, Token: req.query.Token as string }).validate();

            let sequence = new Sequence();
            sequence.paramRecId(parseInt(req.query.sequence as string));
            await sequence.connectDb();
            let seq = await sequence.getOne(Collections.SequenceFull, { RecId: sequence.paramRecId() });
            sequence.flush();

            let response = new ResponseClass(
                ResStatus.Success,
                seq.length ? SequenceFields.SequenceFound : SequenceFields.SequenceNotFound
            );
            response.setData(seq);
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
     * Get all Sequence
     * @param req 
     * @param res 
     */
    async getAll(req: Request, res: Response) {
        try {
            new UserAccess({ Id: req.query.Id as string, Session: req.query.Session as string, Token: req.query.Token as string }).validate();

            let sequence = new Sequence();
            await sequence.connectDb();
            let seq = await sequence.getAll(Collections.SequenceFull, {});
            sequence.flush();

            let response = new ResponseClass(
                ResStatus.Success,
                seq.length ? SequenceFields.SequenceFound : SequenceFields.SequenceNotFound
            );
            response.setData(seq);

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
     * Get all Sequence for a specific purpose
     * @param req 
     * @param res 
     */
    async getAllSeqFor(req: Request, res: Response) {
        try {
            new UserAccess({ Id: req.query.Id as string, Session: req.query.Session as string, Token: req.query.Token as string }).validate();

            let sequence = new Sequence();
            await sequence.connectDb();
            let seq = await sequence.getAllWithColumns(Collections.SysTableId, {SeqEnabled:1},["Name","Id","RecId"]);
            sequence.flush();

            let response = new ResponseClass(
                ResStatus.Success,
                seq.length ? SequenceFields.SequenceFound : SequenceFields.SequenceNotFound
            );
            response.setData(seq);

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

export default Get  