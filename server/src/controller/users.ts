import { Request, Response } from "express";
import connectToCluster from "../connection/connect";
import { Collection, Db } from "mongodb";
import ConnectionRes from "../interface/ConnectionRes";
import { validateSession } from "../functions/hash";
import { validateToken } from "../functions/bearer";
import { closeConn } from "../connection/closeConn";
import RolesEnum from "../config/Roles";

export async function getAllUsers(req: Request, res: Response) {
  const session = req.query.session as string;
  const uid = req.query.uid as string;
  const token = req.query.token as string;

  try {
    if (session === undefined) {
      return res.status(400).json({ message: "Session required" });
    }
    if (uid === undefined) {
      return res.status(400).json({ message: "Uid required" });
    }
    if (token === undefined) {
      return res.status(400).json({ message: "Token required" });
    }

    // check session
    let sessionBool = validateSession(session);
    if (sessionBool) {
      return res.status(400).json({ message: "Invalid session" });
    }

    let tokenErr = validateToken(token);
    if (tokenErr !== "") {
      return res.status(400).json({ message: tokenErr });
    }

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("Master");
    const usersCollection: Collection = db.collection("users");
    const sessionCollection: Collection = db.collection("sessions");

    // insert session
    await sessionCollection.insertOne({
      activity: "get-all-users",
      session: session,
      uid: uid,
      created: new Date(),
    });

    // get all users
    let users = await usersCollection
      .find(
        { role: RolesEnum.USER },
        {
          projection: {
            username: 1,
            email: 1,
            name: 1,
            lawyer_id: 1,
            role: 1,
            status: 1,
          },
        }
      )
      .toArray();

    closeConn(conn);
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unknown error" });
  }
}

export async function getAllAdmins(req: Request, res: Response) {
  const session = req.query.session as string;
  const uid = req.query.uid as string;
  const token = req.query.token as string;

  try {
    if (session === undefined) {
      return res.status(400).json({ message: "Session required" });
    }
    if (uid === undefined) {
      return res.status(400).json({ message: "Uid required" });
    }
    if (token === undefined) {
      return res.status(400).json({ message: "Token required" });
    }

    // check session
    let sessionBool = validateSession(session);
    if (sessionBool) {
      return res.status(400).json({ message: "Invalid session" });
    }

    let tokenErr = validateToken(token);
    if (tokenErr !== "") {
      return res.status(400).json({ message: tokenErr });
    }

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("Master");
    const usersCollection: Collection = db.collection("users");
    const sessionCollection: Collection = db.collection("sessions");

    // insert session
    await sessionCollection.insertOne({
      activity: "get-all-users",
      session: session,
      uid: uid,
      created: new Date(),
    });

    // get all users
    let users = await usersCollection
      .find(
        { role: RolesEnum.ADMIN },
        {
          projection: {
            username: 1,
            email: 1,
            name: 1,
            lawyer_id: 1,
            role: 1,
            status: 1,
          },
        }
      )
      .toArray();

    closeConn(conn);
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unknown error" });
  }
}


export async function updateUser(req: Request, res: Response) {
  const session = req.query.session as string;
  const uid = req.query.uid as string;
  const token = req.query.access_token as string;

  const { user_id, name, username, email, role, status } = req.body;

  try {
    if (session === undefined) {
      return res.status(400).json({ message: "Session required" });
    }
    if (uid === undefined) {
      return res.status(400).json({ message: "Uid required" });
    }
    if (user_id === undefined) {
      return res.status(400).json({ message: "User id required" });
    }
    if (token === undefined) {
      return res.status(400).json({ message: "Token required" });
    }
    if (name === undefined) {
      return res.status(400).json({ message: "Name required" });
    }
    if (username === undefined) {
      return res.status(400).json({ message: "Username required" });
    }
    if (email === undefined) {
      return res.status(400).json({ message: "Email required" });
    }
    if (role === undefined) {
      return res.status(400).json({ message: "Role required" });
    }
    if (status === undefined) {
      return res.status(400).json({ message: "Status required" });
    }

    // check session
    let sessionBool = validateSession(session);
    if (sessionBool) {
      return res.status(400).json({ message: "Invalid session" });
    }

    let tokenErr = validateToken(token);
    if (tokenErr !== "") {
      return res.status(400).json({ message: tokenErr });
    }

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("Master");
    const usersCollection: Collection = db.collection("users");
    const sessionCollection: Collection = db.collection("sessions");

    let user = await usersCollection.findOne({ uid: uid });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.role !== RolesEnum.ADMIN && user.uid !== uid) {
      return res
        .status(400)
        .json({ message: "You are not allowed to update this panel user" });
    }

    let tempUser = await usersCollection.findOne({ uid: user_id });
    if (!tempUser) {
      return res.status(400).json({ message: "User not found" });
    }

    tempUser = await usersCollection.findOne(
      { username: username },
      { projection: { username: 1, uid: 1 } }
    );
    if (
      tempUser !== null &&
      tempUser!.username === username &&
      tempUser.uid !== uid
    ) {
      return res.status(400).json({ message: "Username already taken" });
    }

    tempUser = await usersCollection.findOne(
      { email: email },
      { projection: { email: 1, uid: 1 } }
    );
    if (
      tempUser !== null &&
      tempUser.email === email &&
      tempUser.uid !== uid
    ) {
      return res.status(400).json({ message: "Email already taken" });
    }

    // insert session
    await sessionCollection.insertOne({
      activity: "update-user",
      session: session,
      uid: uid,
      created: new Date(),
    });

    await usersCollection.updateOne(
      { uid: user_id },
      {
        $set: {
          name: name,
          username: username,
          email: email,
          role: role,
          status: status,
        },
      }
    );
    closeConn(conn);

    return res.status(200).json({ message: "User updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unknown error" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const session = req.query.session as string;
  const uid = req.query.uid as string;
  const user_id = req.query.user_id as string;
  const token = req.query.access_token as string;

  try {
    if (session === undefined) {
      return res.status(400).json({ message: "Session required" });
    }
    if (uid === undefined) {
      return res.status(400).json({ message: "User required" });
    }
    if (user_id === undefined) {
      return res.status(400).json({ message: "Lawyer is required" });
    }
    if (token === undefined) {
      return res.status(400).json({ message: "Token required" });
    }

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("Master");
    const usersCollection: Collection = db.collection("users");
    const sessionCollection: Collection = db.collection("sessions");

    // check session
    let sessionBool = validateSession(session);
    if (sessionBool) {
      return res.status(400).json({ message: "Invalid session" });
    }

    let tokenErr = validateToken(token);
    if (tokenErr !== "") {
      return res.status(400).json({ message: tokenErr });
    }

    // insert session
    await sessionCollection.insertOne({
      activity: "delete-user",
      session: session,
      uid: uid,
      created: new Date(),
    });

    let user = await usersCollection.findOne({ uid: user_id });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    await usersCollection.deleteOne({ uid: user_id });
    closeConn(conn);

    return res.status(200).json({ message: "Lawyer deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unknown error" });
  }
}
