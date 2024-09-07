export default interface Phrases {
    phrase_id: string;
    phrase: string;
    points: number;
    createdBy?: string;
    createdOn?: Date;
    timesUsed?: number;
    modified?: Date;
}