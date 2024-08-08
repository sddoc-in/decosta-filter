import { Request, Response } from "express";
import ResponseClass from "../../../Base/Class/Response";
import ResStatus from "../../../Base/Config/response/ResStatus";
import CommonMessage from "../../../Base/Config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import Search from "../../../Base/Class/Search";
import SearchMessage from "../../../Base/Config/response/Search";



class Delete{

    /**
     * Constructor
     */
    constructor() {
        this.delete = this.delete.bind(this);
    }

    /**
     * Delete
     * @param req 
     * @param res 
     */
    async delete(req:Request,res:Response){
        try {
            new UserAccess({ Id: req.query.Id as string, Session: req.query.Session as string, Token: req.query.Token as string }).validate();

            let search = new Search()
            await search.connectDb();
            await search.delete(req.query.SearchId as string);
            search.flush();

            let response = new ResponseClass(ResStatus.Success, SearchMessage.SearchDeleted);
            return res.status(response.getStatus()).send(response.getResponse());

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

export default Delete;