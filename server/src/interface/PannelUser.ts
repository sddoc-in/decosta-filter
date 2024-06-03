export default interface PannelUser {
    uid: string;
    name: string;
    username: string;
    email: string;
    password: string;
    access_token?: string;
    session?: string;
    provider?: string;
    role: string;
    created?: Date;
    status: string;
}
