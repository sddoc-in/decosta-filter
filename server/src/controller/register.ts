import { v4 } from "uuid";
import ConnectionRes from "../interface/ConnectionRes";
import connectToCluster from "../connection/connect";
import { Collection, Db } from "mongodb";
import { Request, Response } from "express";
import registerValidate from "../functions/registerValidate";
import RegisterError from "../interface/RegisterError";
import User from "../interface/User";
import { createSession, hash, validateSession } from "../functions/hash";
import { createBearer, validateToken } from "../functions/bearer";
import { closeConn } from "../connection/closeConn";

export async function register(req: Request, res: Response) {
  const { name, username, email, password, role, access_token, session, uid } =
    req.body;

  try {
    if (name === undefined) {
      return res.status(400).json({ message: "Name required" });
    }
    if (username === undefined) {
      return res.status(400).json({ message: "Username required" });
    }
    if (email === undefined) {
      return res.status(400).json({ message: "Email required" });
    }
    if (password === undefined) {
      return res.status(400).json({ message: "Password required" });
    }

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("Master");
    const collection: Collection = db.collection("users");
    const sessionCollection: Collection = db.collection("sessions");

    // check if already exists
    const filteredDocs = await collection.find({ email: email }).toArray();
    if (filteredDocs.length > 0) {
        return res.status(400).json({
        errors: {
          message: "Email already exists",
        },
        email: email,
      });
    }

    // check for errors
    let errors: RegisterError | undefined = {} as RegisterError;
    errors = registerValidate(username, email, password, name).errors;
    if (errors && Object.keys(errors).length > 0) {
      return res.status(400).json({
        errors: errors,
        message: "Invalid input(s)",
      });
    }

    // check session
    let sessionBool = validateSession(session);
    if (sessionBool) {
      return res.status(400).json({ message: "Invalid session" });
    }

    let tokenErr = validateToken(access_token);
    if (tokenErr !== "") {
      return res.status(400).json({ message: tokenErr });
    }

    // create account if everything is good
    let uidNew = v4();

    // create session
    let sessionNew = createSession();

    await sessionCollection.insertMany([
      {
        activity: "user-register",
        session: session,
        uid: uid,
        created: new Date(),
      },
      {
        activity: "register",
        session: sessionNew,
        uid: uidNew,
        created: new Date(),
      },
    ]);

    // create generate new token
    const token = createBearer(email, uidNew, sessionNew);

    const user: User = {
      uid: uidNew,
      name: name,
      username: username,
      email: email,
      password: hash(password),
      access_token: token,
      session: sessionNew,
      role: role,
      status: "active",
      created: new Date(),
    };

    await collection.insertOne(user);

    closeConn(conn);

    const tmpuser = {
      uid: uidNew,
      name: name,
      access_token: token,
      session: sessionNew,
    };
    res
      .status(201)
      .json({ user: tmpuser, message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function registerAdmin(req: Request, res: Response) {
  const { name, username, email, password, role} =
    req.body;

  try {
    if (name === undefined) {
      return res.status(400).json({ message: "Name required" });
    }
    if (username === undefined) {
      return res.status(400).json({ message: "Username required" });
    }
    if (email === undefined) {
      return res.status(400).json({ message: "Email required" });
    }
    if (password === undefined) {
      return res.status(400).json({ message: "Password required" });
    }

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("Master");
    const collection: Collection = db.collection("users");

    // check if already exists
    const filteredDocs = await collection.find({ email: email }).toArray();
    if (filteredDocs.length > 0) {
        return res.status(400).json({
        errors: {
          message: "Email already exists",
        },
        email: email,
      });
    }

    // check for errors
    let errors: RegisterError | undefined = {} as RegisterError;
    errors = registerValidate(username, email, password, name).errors;
    if (errors && Object.keys(errors).length > 0) {
      return res.status(400).json({
        errors: errors,
        message: "Invalid input(s)",
      });
    }

  

    // create account if everything is good
    let uidNew = v4();

    // create session
    let sessionNew = createSession();


    // create generate new token
    const token = createBearer(email, uidNew, sessionNew);

    const user: User = {
      uid: uidNew,
      name: name,
      username: username,
      email: email,
      password: hash(password),
      access_token: token,
      session: sessionNew,
      role: role,
      status: "active",
      created: new Date(),
    };

    await collection.insertOne(user);

    closeConn(conn);

    const tmpuser = {
      uid: uidNew,
      name: name,
      access_token: token,
      session: sessionNew,
    };
    res
      .status(201)
      .json({ user: tmpuser, message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
