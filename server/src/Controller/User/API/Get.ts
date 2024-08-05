import { Request, Response } from "express";
import UserAccess from "../../../Base/Class/UserAccess";
import User from "../../../Base/Class/User";
import Collections from "../../../config/collections";
import ResponseClass from "../../../Base/Class/Response";
import ResStatus from "../../../config/response/ResStatus";
import UserFieldsMessage from "../../../config/response/User";
import CommonMessage from "../../../config/response/CommonMessage";



class Get {

    /**
     * Constructor
     */
    constructor() {
        this.getOne = this.getOne.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getRecId = this.getRecId.bind(this);
    }

    /**
     * Get a single User
     * @param req 
     * @param res 
     */
    async getOne(req: Request, res: Response) {
        try {
            new UserAccess({ Id: req.query.Id as string, Session: req.query.Session as string, Token: req.query.Token as string }).validate();

            const user = new User();
            await user.connectDb();
            let data = await user.getWithColumns(Collections.User, { RecId: req.query.user as string }, ["RecId", "Id", "Name", "Email", "Language", "StartPage", "Enabled", "CreatedBy", "CreatedDateTime"]);
            user.flush();

            let response = new ResponseClass(ResStatus.Success, UserFieldsMessage.UserFound);
            response.setData(data);

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
     * Get All Users
     * @param req 
     * @param res 
     */
    async getAll(req: Request, res: Response) {
        try {
            new UserAccess({ Id: req.query.Id as string, Session: req.query.Session as string, Token: req.query.Token as string }).validate();

            const user = new User();
            await user.connectDb();
            let data = await user.getAllWithColumns(Collections.User, {}, ["RecId", "Id", "Name", "Email", "Language", "StartPage", "Enabled", "CreatedBy", "CreatedDateTime"]);
            user.flush();

            let response = new ResponseClass(ResStatus.Success, UserFieldsMessage.UserFound);
            response.setData(data);
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
     * Get User RecId
     * @param req 
     * @param res 
     */
    async getRecId(req: Request, res: Response) {
        try {
            new UserAccess({ Id: req.query.Id as string, Session: req.query.Session as string, Token: req.query.Token as string }).validate();

            const user = new User();
            await user.connectDb();
            let data = await user.getWithColumns(Collections.User, { Id: req.query.Id as string }, ["RecId"]);
            user.flush();

            let response = new ResponseClass(ResStatus.Success, UserFieldsMessage.UserFound);
            response.setData(data);
            return res.status(ResStatus.Success).send(response.getResponse());
        } catch (error) {
            if (error instanceof ResponseClass) {
                return res.status(error.getStatus()).send(error.getResponse());
            }
            return res.status(ResStatus.InternalServerError).send(new ResponseClass(ResStatus.InternalServerError,CommonMessage.InternalServerError).getResponse());
        }
    }

}


export default Get;