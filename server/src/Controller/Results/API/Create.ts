import { Request, Response } from "express";
import ResponseClass from "../../../Base/Class/Response";
import CommonMessage from "../../../Base/Config/response/CommonMessage";
import ResStatus from "../../../Base/Config/response/ResStatus";
import Results from "../../../Base/Class/Results";
import ResultsMessage from "../../../Base/Config/response/Results";


class Create {

    /**
     * Constructor
     */
    constructor() {
        this.create = this.create.bind(this);
    }

    /**
     * Create
     * @param req 
     * @param res 
     */
    async create(req: Request, res: Response) {

        try {

            let results = new Results(req.body.Result);
            await results.connectDb();
            await results.insert();

            let response = new ResponseClass(ResStatus.Success, ResultsMessage.ResultStored);
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

export default Create;