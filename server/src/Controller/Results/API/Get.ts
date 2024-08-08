import { Request, Response } from "express";
import ResponseClass from "../../../Base/Class/Response";
import ResStatus from "../../../Base/Config/response/ResStatus";
import CommonMessage from "../../../Base/Config/response/CommonMessage";
import Results from "../../../Base/Class/Results";
import ResultsMessage from "../../../Base/Config/response/Results";
import Collections from "../../../Base/Config/collections";
import UserAccess from "../../../Base/Class/UserAccess";


class Get {

    /**
     * Constructor
     */
    constructor() {
        this.getBySearchId = this.getBySearchId.bind(this);
    }

    /**
     * Get By Search Id
     * @param req 
     * @param res 
     */
    async getBySearchId(req: Request, res: Response) {
        try {
            new UserAccess({ Id: req.query.Id as string, Session: req.query.Session as string, Token: req.query.Token as string }).validate();

            let search = new Results()
            await search.connectDb();
            let result = await search.getAll(Collections.Results, { SearchId: req.query.SearchId as string });
            search.flush();

            let response = new ResponseClass(ResStatus.Success, ResultsMessage.ResultFound);
            response.setData(result);
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

export default Get;