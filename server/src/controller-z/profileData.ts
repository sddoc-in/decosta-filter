import { Request, Response } from "express";
import { Db, Collection, Document } from "mongodb";
import { validateSession } from "../functions/hash";
import { validateToken } from "../functions/bearer";
import ConnectionRes from "../interface/ConnectionRes";
import connectToCluster from "../connection/connect";

interface UserProfile {
    uid: string;
    name: string;
    username: string;
    email: string;
    password: string;
    role: string;
    status: string;
    created: Date;
}

export async function getUserProfile(req: Request, res: Response) {
    const { uid } = req.body;

    try {
        if (!uid ) {
            return res.status(400).json({ message: "UID is required" });
        }

        const connect: ConnectionRes = await connectToCluster();
        if (typeof connect.conn === "string") {
            return res.status(500).json({ message: "Database connection error", error: connect.conn });
        }

        const conn = connect.conn;
        const db: Db = conn.db("Master");
        const usercollection: Collection<Document> = db.collection("users");

        const userDocument = await usercollection.findOne({ uid: uid as string }, {
            projection: {
                _id: 0,
                uid: 1,
                name: 1,
                username: 1,
                email: 1,
                password: 1,
                role: 1,
                status: 1,
                created: 1
            }
        });

        if (!userDocument) {
            return res.status(404).json({ message: "User not found" });
        }

        const user: UserProfile = {
            uid: userDocument.uid as string,
            name: userDocument.name as string,
            username: userDocument.username as string,
            email: userDocument.email as string,
            password: userDocument.password as string,
            role: userDocument.role as string,
            status: userDocument.status as string,
            created: userDocument.created instanceof Date ? userDocument.created : new Date(),
        };

        conn.close();

        return res.status(200).json({ user, message: "User profile fetched successfully" });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}
