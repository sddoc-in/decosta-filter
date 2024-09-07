import { Request, Response } from "express";
import { Collection, Db } from "mongodb";
import connectToCluster from "../connection/connect";
import ConnectionRes from "../interface/ConnectionRes";
import { validateSession } from "../functions/hash";
import { validateToken } from "../functions/bearer";
import { closeConn } from "../connection/closeConn";

export async function getSearchCountOnDailyBasis(
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
    const db: Db = conn.db("Master");
    const searchCollection: Collection = db.collection("search");
    const users = await searchCollection
      .aggregate([
        {
          $match: {
            uid: uid,
          },
        },
        {
          $group: {
            _id: "$CreatedDate",
            count: { $sum: 1 },
          },
        }, {
          $sort: { _id: 1 },
        }
      ])
      .toArray();

    closeConn(conn);
    return res.status(200).send({
      status:200,
      data:users
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getNumberOfResultsOnDailyBasis(req: Request, res: Response) {
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
    const db: Db = conn.db("Master");
    const resultCollection: Collection = db.collection("results");
    const users = await resultCollection
      .aggregate([
        {
          $lookup: {
            from: "search",
            localField: "SearchUid",
            foreignField: "searchId",
            as: "search",
          },
        },
        {
          $match: {
            "search.uid": uid,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: { $toDate: { $multiply: ["$created_at", 1000] } },
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ])
      .toArray();
    closeConn(conn);
    return res.status(200).send({
      status:200,
      data:users
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getNumberOfSearchesPerUser(req: Request, res: Response) {
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
    const db: Db = conn.db("Master");
    const searchCollection: Collection = db.collection("search");

    // select count(*),name from search
    // inner join users on users.uid = search.uid group by users.name;


    const users = await searchCollection
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "uid",
            foreignField: "uid",
            as: "user",
          },
        },
        {
          $match: {
            "user.uid": uid,
          },
        },
        {
          $unwind: "$user",
        },
        {
          $group: {
            _id: "$user.name",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();
    closeConn(conn);
    return res.status(200).send({
      status:200,
      data:users
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
