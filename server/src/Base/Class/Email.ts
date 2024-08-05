import ResponseClass from "./Response";
import axios from "axios";
import Start from "./Start";
import ResStatus from "../Config/response/ResStatus";
import EMails from "../Interface/Email";
import { createTransport } from "nodemailer";
import EMailType from "../Config/EmailType";
import SysEmailParamsMessage from "../Config/response/SysEmailParams";


/**
 * Email class
 * @class EmailClass
 * @classdesc Used to send emails
 */
class EmailSender extends Start {

  /**
   * Send email Through SendGrid
   * @param {EMails} from
   * @param {EMails[]} To 
   * @param {string} subject
   * @param {string} body
   * @param {string} API_KEY
   * @param {EMails[]} BCC - Optional
   * @param {EMails[]} CC - Optional
   * @returns {Promise<ResponseClass>}
   */
  async sendEmailSendGrid(
    from: EMails,
    To: EMails[],
    subject: string,
    body: string,
    API_KEY: string,
    BCC?: EMails[],
    CC?: EMails[],
  ): Promise<void> {
    const data = {
      personalizations: [
        {
          to: To.map((email) => {
            return {
              email: email.mailTo
            }
          }),
          bcc: BCC ? BCC.map((email) => {
            return {
              email: email.mailTo,
            }
          }) : undefined,
          cc: CC ? CC.map((email) => {
            return {
              email: email.mailTo,
            }
          }) : undefined,
        },
      ],
      from: from,
      subject: subject,
      content: [
        {
          type: "text/html",
          value: body,
        },
      ],
    };
    const response = await axios.post(
      "https://api.sendgrid.com/v3/mail/send",
      data,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
  }

  /**
   * Send email Through Brevo
   * @param {EMails} from
   * @param {EMails[]} To
   * @param {string} subject
   * @param {string} body
   * @param {string} API_KEY
   * @param {EMails[]} BCC - Optional
   * @param {EMails[]} CC - Optional
   * @returns {Promise<ResponseClass>}
   */
  async sendEmailBrevo(
    from: EMails,
    To: EMails[],
    subject: string,
    body: string,
    API_KEY: string,
    BCC?: EMails[],
    CC?: EMails[],
  ): Promise<void> {
    const data = {
      sender: {
        email: from.mailTo,
        name: from.name,
      },
      to: To.map((email) => {
        return {
          email: email.mailTo,
          name: email.name
        }
      }),
      cc: CC ? CC.map((email) => {
        return {
          email: email.mailTo,
          name: email.name
        }
      }) : undefined,
      bcc: BCC ? BCC.map((email) => {
        return {
          email: email.mailTo,
          name: email.name
        }
      }) : undefined,
      subject: subject,
      htmlContent: body,
    }

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": API_KEY,
        },
      }
    );
  }

  /**
   * Send email Through SMTP
   * @param {EMails} from
   * @param {EMails[]} To
   * @param {string} subject
   * @param {string} body
   * @param {string} SMTP_HOST
   * @param {string} SMTP_PORT
   * @param {string} SMTP_USER
   * @param {string} SMTP_PASS
   * @param {EMails[]} BCC - Optional
   * @param {EMails[]} CC - Optional
   * @returns {Promise<ResponseClass>}
   */
  async sendEmailSMTP(
    from: EMails,
    To: EMails[],
    subject: string,
    body: string,
    SMTP_HOST: string,
    SMTP_PORT: string,
    SMTP_USER: string,
    SMTP_PASS: string,
    BCC?: EMails[],
    CC?: EMails[],
  ): Promise<void> {
    const transporter = createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT),
      secure: false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    } as any);

    await transporter.sendMail({
      from: from.mailTo,
      to: To.map((email) => email.mailTo),
      cc: CC ? CC.map((email) => email.mailTo) : undefined,
      bcc: BCC ? BCC.map((email) => email.mailTo) : undefined,
      subject: subject,
      html: body,
    });
  }

  /**
   * Generate Body For New User
   * @description Generate Designed Html Content For New User Joining which contains the email and password
   * @param {string} name
   * @param {string} email
   * @param {string} password
   */
  generateBodyForNewUser(name: string, email: string, password: string): string {
    return `
    <div style="background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: white; padding: 20px; border-radius: 10px;">
        <h1>Welcome ${name}</h1>
        <p>Your account has been created successfully</p>
        <p>Email: ${email}</p>
        <p>Password: ${password}</p>  
        <p>Click <a href="https://dashboard.designelementary.com/">here</a> to login</p>
      </div>
    </div>
    `;
  }

  /**
   * Generate Body For Forget Password
   * @description Generate Designed Html Content For Forget Password which contains the email and password
   * @param {string} name
   * @param {string} email
   * @param {string} RecId
   */
  generateBodyForForgetPassword(name: string, email: string, RecId: string): string {
    return `
    <div style="background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: white; padding: 20px; border-radius: 10px;">
        <h1>Forget Password</h1>
        <p>Reset Password Request has been received from your email</p>
        <p>
          Click <a href="https://dashboard.designelementary.com/password/reset/${RecId}/${name}/${email} ">here</a> to reset your password
        </p>
        <p>If you did not request a password reset, please ignore this email.</p>
      </div>
    </div>
    `;
  }


  /**
   * Send Email
   * @description Send Email to the users
   * @param {EMails[]} To
   * @param {string} subject
   * @param {string} body
   * @param {EMails[]} BCC - Optional
   * @param {EMails[]} CC - Optional
   */
  async sendEmail(
    To: EMails[],
    subject: string,
    body: string,
    BCC?: EMails[],
    CC?: EMails[],
  ): Promise<void> {

    // let emailParams = await new SysEmailParams().getPrimary();
    let emailParams = {
      Type: EMailType.SendGrid,
      FromEmail: "",
      FromName: "",
      SMTPDomain: "",
      SMTPPortNumber: 0,
      SMTPUserName: "",
      SMTPPassword: "",
    }
    let from: EMails = {
      mailTo: emailParams.FromEmail,
      name: emailParams.FromName
    }

    switch (emailParams.Type) {
      // case EMailType.SendGrid:
      //   await this.sendEmailSendGrid(from, To, subject, body, emailParams.SendGridAPIKey, BCC, CC);
      //   break;
      // case EMailType.Brevo:
      //   await this.sendEmailBrevo(from, To, subject, body, emailParams.BrevoAPIKey, BCC, CC);
      //   break;
      case EMailType.SMTP:
        await this.sendEmailSMTP(from, To, subject, body, emailParams.SMTPDomain, emailParams.SMTPPortNumber.toString(), emailParams.SMTPUserName, emailParams.SMTPPassword, BCC, CC);
        break;
      default:
        throw new ResponseClass(ResStatus.BadRequest, SysEmailParamsMessage.SysEmailParamsNotFound);
    }
  }






}

export default EmailSender;
