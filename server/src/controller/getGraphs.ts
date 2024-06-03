import { Request, Response } from "express";
import { Collection, Db } from "mongodb";
import connectToCluster from "../connection/connect";
import ConnectionRes from "../interface/ConnectionRes";
import { validateSession } from "../functions/hash";
import { validateToken } from "../functions/bearer";

export async function getTopTenMostPointsDiscordUsers(
  req: Request,
  res: Response
) {
  const session = req.query.session as string;
  const access_token = req.query.access_token as string;
  const uid = req.query.uid as string;

  try {
    if (!uid) {
      return res.status(400).json({ message: "Uid is Required" });
    }

    if (!session) {
      return res.status(400).json({ message: "Session is Required" });
    }

    if (!access_token) {
      return res.status(400).json({ message: "Access Token is Required" });
    }

    //check session
    let sessionBool = validateSession(session);
    if (sessionBool) {
      return res
        .status(401)
        .json({ message: "Session invalid. Please Login Again" });
    }

    let tokenErr = validateToken(access_token);
    if (tokenErr !== "") {
      return res.status(401).json({ message: tokenErr });
    }

    // Create connection to the database
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }
    const conn = connect.conn;
    const db: Db = conn.db("discord");
    const usercollection: Collection = db.collection("users");

    const users = await usercollection
      .find(
        {},
        {
          projection: {
            _id: 0,
            userId: {
              $toString: "$userId",
            },
            username: 1,
            total_points: 1,
            last_message_time: 1,
          },
        }
      )
      .sort({ total_points: -1 })
      // .limit(10)
      .toArray();
    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }

    // let barGraphData = users.map((user) => {
    //   return {
    //     total_points: user.total_points,
    //     username: user.username,
    //   };
    // });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function mostUsedPhrase(req: Request, res: Response) {
  const session = req.query.session as string;
  const access_token = req.query.access_token as string;
  const uid = req.query.uid as string;

  try {
    if (!uid) {
      return res.status(400).json({ message: "Uid is Required" });
    }

    if (!session) {
      return res.status(400).json({ message: "Session is Required" });
    }

    if (!access_token) {
      return res.status(400).json({ message: "Access Token is Required" });
    }

    //check session
    let sessionBool = validateSession(session);
    if (sessionBool) {
      return res
        .status(401)
        .json({ message: "Session invalid. Please Login Again" });
    }

    let tokenErr = validateToken(access_token);
    if (tokenErr !== "") {
      return res.status(401).json({ message: tokenErr });
    }

    // Create connection to the database
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }
    const conn = connect.conn;
    const db: Db = conn.db("discord");
    const usercollection: Collection = db.collection("mostusedphrases");

    const users = await usercollection
      .find(
        {},
        {
          projection: {
            _id: 0,
            phrase: 1,
            used_count: 1,
            last_used: 1,
          },
        }
      )
      .sort({ total_points: -1 })
      // .limit(10)
      .toArray();
    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function mostPointedPhrase(req: Request, res: Response) {
  const session = req.query.session as string;
  const access_token = req.query.access_token as string;
  const uid = req.query.uid as string;

  try {
    if (!uid) {
      return res.status(400).json({ message: "Uid is Required" });
    }

    if (!session) {
      return res.status(400).json({ message: "Session is Required" });
    }

    if (!access_token) {
      return res.status(400).json({ message: "Access Token is Required" });
    }

    //check session
    let sessionBool = validateSession(session);
    if (sessionBool) {
      return res
        .status(401)
        .json({ message: "Session invalid. Please Login Again" });
    }

    let tokenErr = validateToken(access_token);
    if (tokenErr !== "") {
      return res.status(401).json({ message: tokenErr });
    }

    // Create connection to the database
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }
    const conn = connect.conn;
    const db: Db = conn.db("discord");
    const usercollection: Collection = db.collection("mostusedphrases");

    const users = await usercollection
      .find(
        {},
        {
          projection: {
            _id: 0,
            phrase: 1,
            last_used: 1,
            total_gained_points: 1,
          },
        }
      )
      .sort({ total_gained_points: -1 })
      // .limit(10)
      .toArray();

    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
