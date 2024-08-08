

export interface OTPInterface {
    UserId: string;
    OTP: number;
    CreatedDateTime?: string;
    ModifiedDateTime?: string;
}

export default interface OTPClass extends OTPInterface {
    setOTP(otp: OTPInterface): void;
    setBlank(): void;
    get(): OTPInterface;
    flush(): void;
    validate(): void;

    // params
    paramUserId(UserId: string): string;
    paramOTP(OTP: number): number;
    paramCreatedDateTime(CreatedDateTime: string): string;
    paramModifiedDateTime(ModifiedDateTime: string): string;
}


export const EmptyOTP = {
    UserId: '',
    OTP: 0,
    CreatedDateTime: '',
    ModifiedDateTime: ''
} 