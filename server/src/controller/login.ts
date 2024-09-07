import { Request, Response } from "express";
import connectToCluster from "../connection/connect";
import { Collection, Db } from "mongodb";
import ConnectionRes from "../interface/ConnectionRes";
import { comparePassword, createSession, hash } from "../functions/hash";
import { createBearer } from "../functions/bearer";
import User from "../interface/User";
import { closeConn } from "../connection/closeConn";
import nodemailer from "nodemailer";
import MailTemplate from "../functions/utills/mailTemplate";

export async function login(req: Request, res: Response) {

  let user = req.query.email as string;
  let password = req.query.password as string;

  try {
    if (user === undefined) {
      return res.status(400).json({ message: "Username or email required" });
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

    // check if user exists
    let loggedUser;
    if (user) {
      loggedUser = await collection.findOne({ username: user });
    }
    if (loggedUser === null) {
      loggedUser = await collection.findOne({
        email: user,
      });
    }

    if (!loggedUser) {
      return res.status(400).json({ message: "User not found" });
    }


    // check if password is correct
    if (!comparePassword(password, loggedUser?.password)) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // check user status
    if (loggedUser?.status === "inactive") {
      return res.status(400).json({ message: "User is inactive. Contact Your Supreme Leader" });
    }

    let newUser: User = {
      uid: loggedUser?.uid,
      name: loggedUser?.name,
      username: loggedUser?.username,
      email: loggedUser?.email,
      password: loggedUser?.password,
      access_token: loggedUser?.access_token,
      session: loggedUser?.session,
      role: loggedUser?.role,
      status: loggedUser?.status,

    };

    // check session
    newUser.session = createSession();

    newUser.access_token = createBearer(loggedUser?.email, loggedUser?.uid, newUser.session);

    // insert session
    await sessionCollection.insertOne({
      activity: "login",
      session: newUser.session,
      uid: loggedUser?.uid,
      created: new Date(),
    });

    // update user

    await collection.updateOne(
      {
        uid: loggedUser?.uid,
      },
      {
        $set: {
          session: newUser.session,
          access_token: newUser.access_token,
        },
      }
    );

    const tmpuser = {
      uid: newUser.uid,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      access_token: newUser.access_token,
      session: newUser.session,
      role: newUser.role,
      status: newUser.status,
    };

    closeConn(conn);

    res
      .status(200)
      .json({ user: tmpuser, message: "User logged in successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function sendEmailOTP(req: Request, res: Response) {
  let email = req.query.email as string;
  let otp = Math.floor(100000 + Math.random() * 900000);

  const senderEmail = 'deepakpythonwork@gmail.com';
  const senderPassword = 'uzed ghqu tkxz mjxf';

  try {
    if (email === undefined) {
      return res.status(400).json({ message: "Email required" });
    }

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("Master");
    const OTPCollection: Collection = db.collection("otp");
    const userCollection: Collection = db.collection("users");


    // check if user exists
    let loggedUser = await userCollection.findOne({ email: email });

    if (!loggedUser) {
      return res.status(400).json({ message: "User not found",status:400 });
    }

    // check user status
    if (loggedUser?.status === "inactive") {
      return res.status(400).json({ message: "User is inactive. Contact Your Supreme Leader",status:400 });
    }

    // check otp sent
    let otpSent: any = await OTPCollection.findOne({ email });
    if (otpSent && otpSent.timestamp > new Date().getTime() - 60000) {
      return res.status(400).json({ message: "OTP already sent. Try again after 1 minute",status:400 });
    }

    // send otp
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail,
        pass: senderPassword,
      },
    });

    let mailOptions = {
      from: senderEmail,
      to: email,
      subject: "OTP for password reset",
      html: MailTemplate(loggedUser.name, otp,loggedUser.uid, email),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error",status:500 });
      }
    });

    // insert otp
    await OTPCollection.updateOne(
      {
        email: email,
      },
      {
        $set: {
          email: email,
          otp: otp,
          timestamp: new Date().getTime(),
        },
      },
      {
        upsert: true,
      }
    );

    closeConn(conn);

    res
      .status(200)
      .json({ message: "OTP sent to email successfully",status:200 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error",status:500 });
  }
}

export async function validateOTP(req: Request, res: Response) {
  let email = req.query.email as string;
  let otp = req.query.otp as string;

  try {
    if (email === undefined) {
      return res.status(400).json({ message: "Email required" });
    }
    if (otp === undefined) {
      return res.status(400).json({ message: "OTP required" });
    }

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("Master");
    const OTPCollection: Collection = db.collection("otp");

    // check if otp exists
    let otpSent: any = await OTPCollection.findOne({ email });

    if (!otpSent) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (otpSent.otp !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpSent.timestamp < new Date().getTime() - 600000) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // delete otp
    await OTPCollection.deleteOne({
      email: email,
    });


    closeConn(conn);

    res.status(200).json({ message: "OTP validated successfully",status:200 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function resetPassword(req: Request, res: Response) {
  let email = req.body.email as string;
  let uid = req.body.uid as string;
  let password = req.body.password as string;

  try {
    if (email === undefined) {
      return res.status(400).json({ message: "Email required" });
    }
    if (uid === undefined) {
      return res.status(400).json({ message: "UID required " });
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

    // check if user exists
    let loggedUser = await collection.findOne({ email: email });

    if (!loggedUser) {
      return res.status(400).json({ message: "User not found" });
    }

    // check user status
    if (loggedUser?.status === "inactive") {
      return res.status(400).json({ message: "User is inactive. Contact Your Supreme Leader" });
    }

    // update password
    await collection.updateOne(
      {
        email: email,
      },
      {
        $set: {
          password: hash(password),
        },
      }
    );

    closeConn(conn);

    res.status(200).json({ message: "Password reset successfully",status:200 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}



