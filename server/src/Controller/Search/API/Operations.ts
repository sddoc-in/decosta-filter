import { Request, Response } from "express";
import ResponseClass from "../../../Base/Class/Response";
import ResStatus from "../../../Base/Config/response/ResStatus";
import CommonMessage from "../../../Base/Config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import Search from "../../../Base/Class/Search";
import SearchMessage from "../../../Base/Config/response/Search";
import Collections from "../../../Base/Config/collections";



class Operations{

    /**
     * Constructor
     */
    constructor() {
        this.create = this.create.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
    }

    /**
     * Create
     * @param req 
     * @param res 
     */
    async create(req:Request,res:Response){
        try {
            new UserAccess({ Id: req.body.Id as string, Session: req.body.Session as string, Token: req.body.Token as string }).validate();

            let search = new Search(req.body.Search)
            search.paramCreatedBy(req.body.Id);
            await search.connectDb();
            await search.insert();

            let response = new ResponseClass(ResStatus.Success, SearchMessage.SearchCreated);
            response.setData({
                ...search.get(),
                RecId: search.paramRecId()
            });
            search.flush();
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
     * Start
     * @param req 
     * @param res 
     */
    async start(req:Request,res:Response){
        try {
            new UserAccess({ Id: req.body.Id as string, Session: req.body.Session as string, Token: req.body.Token as string }).validate();

            let search = new Search();
            await search.connectDb();
            await search.checkExists(req.body.SearchId);
            await search.updateOne(Collections.Search, { SearchId: req.body.SearchId }, { FoundResults: req.body.FoundResults });
            await search.start();
            search.flush();

            let response = new ResponseClass(ResStatus.Success, SearchMessage.SearchStarted);
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
     * Stop
     * @param req 
     * @param res 
     */
    async stop(req:Request,res:Response){
        try {
            new UserAccess({ Id: req.body.Id as string, Session: req.body.Session as string, Token: req.body.Token as string }).validate();

            let search = new Search();
            await search.connectDb();
            await search.checkExists(req.body.SearchId);
            await search.stop();
            search.flush();

            let response = new ResponseClass(ResStatus.Success, SearchMessage.SearchStopped);
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

export default Operations;