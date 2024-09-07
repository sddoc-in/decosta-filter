
export default interface User {
    uid: string;
    name: string;
    username: string;
    email: string;
    password: string;
    access_token?: string;
    session?: string;
    provider?: string;
    role: 'admin' | 'user';
    status?: string;
    created?: Date;
}
