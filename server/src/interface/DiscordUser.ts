export default interface DiscordUser {
    userId:string;
    username: string;
    email: string;
    password: string;
    access_token?: string;
    session?: string;
}