import Collections from "../Config/collections";
import OTPMessage from "../Config/response/OTP";
import ResStatus from "../Config/response/ResStatus";
import OTPClass, { OTPInterface } from "../Interface/OTP";
import ResponseClass from "./Response";
import Start from "./Start";


class OTPHandler extends Start implements OTPClass {
    UserId: string = '';
    OTP: number = 0;
    CreatedDateTime: string = '';
    ModifiedDateTime: string = '';

    constructor(otp?: OTPInterface) {
        super();
        if (otp) {
            this.setOTP(otp);
        } else {
            this.setBlank();
        }
    }

    setOTP(otp: OTPInterface): void {
        this.UserId = otp.UserId;
        this.OTP = otp.OTP;
        this.CreatedDateTime = otp.CreatedDateTime || '';
        this.ModifiedDateTime = otp.ModifiedDateTime || '';
    }

    setBlank(): void {
        this.UserId = '';
        this.OTP = 0;
        this.CreatedDateTime = '';
        this.ModifiedDateTime = '';
    }

    get(): OTPInterface {
        return {
            UserId: this.UserId,
            OTP: this.OTP,
            CreatedDateTime: this.CreatedDateTime,
            ModifiedDateTime: this.ModifiedDateTime
        }
    }

    flush(): void {
        super.flush();
        this.setBlank();
    }

    validate(): void {
        if (!this.UserId) {
            throw new ResponseClass(ResStatus.BadRequest, OTPMessage.UserIdRequired);
        }
        if (!this.OTP) {
            throw new ResponseClass(ResStatus.BadRequest, OTPMessage.OTPRequired);
        }


    }

    validateLimit(CreatedDateTime: string = this.CreatedDateTime): void {
        const now = new Date();
        const createdDateTime = new Date(CreatedDateTime);
        const diff = (now.getTime() - createdDateTime.getTime()) / 1000;
        if (diff < 60) {
            throw new ResponseClass(ResStatus.BadRequest, OTPMessage.OTP_RESEND_TIME);
        }
    }

    validateExpiry(CreatedDateTime: string = this.CreatedDateTime): void {
        const now = new Date();
        const createdDateTime = new Date(CreatedDateTime);
        const diff = (now.getTime() - createdDateTime.getTime()) / 1000;
        if (diff > 60) {
            throw new ResponseClass(ResStatus.BadRequest, OTPMessage.OTP_EXPIRED);
        }
    }

    paramUserId(UserId: string = this.UserId): string {
        this.UserId = UserId;
        return this.UserId
    }

    paramOTP(OTP: number = this.OTP): number {
        this.OTP = OTP;
        return this.OTP;
    }

    paramCreatedDateTime(CreatedDateTime: string = this.CreatedDateTime): string {
        return this.CreatedDateTime = CreatedDateTime;
    }

    paramModifiedDateTime(ModifiedDateTime: string = this.ModifiedDateTime): string {
        return this.ModifiedDateTime = ModifiedDateTime;
    }

    modified(): void {
        this.validate();
        this.ModifiedDateTime = this.getDateTime();
    }

    async checkExists(UserId: string = this.UserId): Promise<boolean> {
        const otp = (await this.getWithColumns(Collections.OTP, { UserId: UserId }, ["UserId", "CreatedDateTime"])).UserId;
        if (otp.UserId) {
            this.validateLimit(otp.CreatedDateTime);
            return true;
        }
        return false;
    }


    async insert(): Promise<void> {
        this.modified();
        this.CreatedDateTime = this.ModifiedDateTime;
        await this.insertOne(Collections.OTP, this.get());
    }

    async delete(): Promise<void> {
        await this.deleteOne(Collections.OTP, { UserId: this.UserId });
    }

    async getOTP(UserId: string = this.UserId): Promise<OTPClass> {
        let otp = (await this.getOne(Collections.OTP, { UserId: UserId }));
        if (otp.UserId) {
            this.validateExpiry(otp.CreatedDateTime);
            return otp.OTP;
        }
        throw new ResponseClass(ResStatus.Error, OTPMessage.OTP_NOT_SENT);
    }

}

export default OTPHandler;