import { Request, Response } from "express";
import ResponseClass from "../../../Base/Class/Response";
import ResStatus from "../../../Base/Config/response/ResStatus";
import CommonMessage from "../../../Base/Config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import Search from "../../../Base/Class/Search";
import SearchMessage from "../../../Base/Config/response/Search";
import Collections from "../../../Base/Config/collections";
import { SearchInterface } from "../../../Base/Interface/Search";


class Get {

    /**
     * Constructor
     */
    constructor() {
        this.getByUser = this.getByUser.bind(this);
        this.getByStatus = this.getByStatus.bind(this);
    }

    /**
     * Get By User
     * @param req 
     * @param res 
     */
    async getByUser(req: Request, res: Response) {
        try {
            new UserAccess({ Id: req.query.Id as string, Session: req.query.Session as string, Token: req.query.Token as string }).validate();

            let search = new Search()
            await search.connectDb();
            let searches = await search.getAllWithColumns(Collections.Search, { CreatedBy: req.query.Id as string }, ["RecId", "SearchStatus", "Progress", "Status", "CreatedDateTime", "Country", "ContentLanguages", "Query"]);
            search.flush();

            let response = new ResponseClass(ResStatus.Success, SearchMessage.SearchFound);
            response.setData(searches);
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

    /**
     * Get By Status
     * @param req 
     * @param res 
     */
    async getByStatus(req: Request, res: Response) {
        try {
            new UserAccess({ Id: req.body.Id as string, Session: req.body.Session as string, Token: req.body.Token as string }).validate();

            let search = new Search()
            await search.connectDb();

            let searches: SearchInterface[] = []

            for (let status of req.body.SearchStatus as string) {
                searches = [...searches, ...await search.getAllWithColumns(Collections.Search, { SearchStatus: status,CreatedBy: req.body.Id as string  }, ["RecId", "SearchStatus", "Progress", "Status", "CreatedDateTime", "Country", "ContentLanguages", "Query"])];
            }
            search.flush();

            let response = new ResponseClass(ResStatus.Success, SearchMessage.SearchFound);
            response.setData(searches);
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