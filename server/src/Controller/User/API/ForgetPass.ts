import { Request, Response } from "express";
import User from "../../../Base/Class/User";
import UserAccess from "../../../Base/Class/UserAccess";
import ResponseClass from "../../../Base/Class/Response";
import ResStatus from "../../../config/response/ResStatus";
import UserFieldsMessage from "../../../config/response/User";
import EmailSender from "../../../Base/Class/Email";
import CommonMessage from "../../../config/response/CommonMessage";


class ForgetPass {

    /**
     * Constructor
     */
    constructor() {
        this.forgetPass = this.forgetPass.bind(this);
    }

    /**
     * Forget Password
     * @param req 
     * @param res 
     */
    async forgetPass(req: Request, res: Response) {
        try {

            const user = new User(req.body.user);
            await user.connectDb();
            let userDetails = await user.getUser("", req.body.email);
            user.flush();

            let emailSender = new EmailSender();
            let To = {
                mailTo: userDetails.Email,
                name: userDetails.Name
            }

            await emailSender.sendEmail(
                [To],
                "Password Reset",
                emailSender.generateBodyForForgetPassword(To.name, To.mailTo, (userDetails.RecId || 0).toString())
            )

            let response = new ResponseClass(ResStatus.Success, UserFieldsMessage.EMailSentForgetPassword);
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

export default ForgetPass;