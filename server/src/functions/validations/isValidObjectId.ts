import { ObjectId } from 'mongodb';

export default function isValidObjectId(puid: string): boolean {
    return ObjectId.isValid(puid);
}