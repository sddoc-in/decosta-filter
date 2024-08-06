import { Request, Response } from "express";
import ResponseClass from "../../../Base/Class/Response";
import ResStatus from "../../../Base/Config/response/ResStatus";
import CommonMessage from "../../../Base/Config/response/CommonMessage";
import Results from "../../../Base/Class/Results";
import SearchMessage from "../../../Base/Config/response/Search";




class Delete {

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
    async delete(req: Request, res: Response) {
        try {

            let search = new Results()
            await search.connectDb();
            await search.delete(Number(req.query.RecId as string));
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