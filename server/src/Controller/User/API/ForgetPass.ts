import { Request, Response } from "express";
import User from "../../../Base/Class/User";
import UserAccess from "../../../Base/Class/UserAccess";
import ResponseClass from "../../../Base/Class/Response";
import ResStatus from "../../../Base/Config/response/ResStatus";
import UserFieldsMessage from "../../../Base/Config/response/User";
import EmailSender from "../../../Base/Class/Email";
import CommonMessage from "../../../Base/Config/response/CommonMessage";
import OTPHandler from "../../../Base/Class/OTPHandler";
import OTPMessage from "../../../Base/Config/response/OTP";


class ForgetPass {

    /**
     * Constructor
     */
    constructor() {
        this.forgetPass = this.forgetPass.bind(this);
        this.validateOTP = this.validateOTP.bind(this);
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

            let OTP = Math.floor(100000 + Math.random() * 900000)

            let emailSender = new EmailSender();
            let To = {
                mailTo: userDetails.Email,
                name: userDetails.Name,
            }

            let OTPClass = new OTPHandler({
                UserId: userDetails.Id,
                OTP: OTP
            });

            await OTPClass.connectDb();
            if (await OTPClass.checkExists()) {
                await OTPClass.delete();
            }
            await OTPClass.insert();
            OTPClass.flush();


            await emailSender.sendEmail(
                [To],
                "Password Reset",
                emailSender.generateBodyForForgetPassword(To.name, OTP, userDetails.Id, To.mailTo)
            );


            user.flush();

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

    /**
     * Validate OTP
     * @param req 
     * @param res 
     */
    async validateOTP(req: Request, res: Response) {
        try {
            const OTP = req.body.OTP as string;
            const UserId = req.body.UserId as string;

            let OTPClass = new OTPHandler();
            OTPClass.paramUserId(UserId);

            await OTPClass.connectDb();
            if (!(await OTPClass.checkExists())) {
                OTPClass.flush();
                return res.status(ResStatus.Success).send(new ResponseClass(ResStatus.Success, OTPMessage.OTP_INVALID).getResponse());
            } else {

                let OTP = await OTPClass.getOTP();
                if (OTP == req.body.OTP) {
                    OTPClass.flush();
                    return res.status(ResStatus.Success).send(new ResponseClass(ResStatus.Success, OTPMessage.OTP_VERIFIED).getResponse());
                }
            }
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