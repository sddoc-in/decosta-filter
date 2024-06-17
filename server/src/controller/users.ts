import { Request, Response } from "express";
import connectToCluster from "../connection/connect";
import { Collection, Db } from "mongodb";
import ConnectionRes from "../interface/ConnectionRes";
import { v4 } from "uuid";
//@ts-ignore
import { comparePassword, createSession, createBearer } from "../functions";
import User from "../interface/User";


export async function createUser(req: Request, res: Response) {
  try {
      const sessionCookie = req.cookies.session;
      const userRole = req.cookies.name; 
      
      if (!sessionCookie || userRole !== 'System Administrator') {
          return res.status(403).json({ message: "Unauthorized" });
      }

      const { name, email, username, password, role } = req.body as Pick<User, 'name' | 'email' | 'username' | 'password' | 'role'>;

      // Validation of input fields
      if (!name || !email || !password || !role) {
          return res.status(400).json({ message: "All fields are required" });
      }

      const connect: ConnectionRes = await connectToCluster(); // Assuming connectToCluster is your function to establish DB connection
      if (typeof connect.conn === "string") {
          return res.status(500).json(connect);
      }

      const uid = v4(); // Generate a unique user ID
      const conn = connect.conn;
      const db = conn.db("Master");
      const collection = db.collection("users");

      const newUser: User = {
          uid: uid,
          username,
          name,
          email,
          password,
          role: 'user', // Assuming you want to set a default role for new users
      };

      await collection.insertOne(newUser);
      res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
      console.error("Error in createUser function:", error);
      res.status(500).json({ message: "Internal server error" });
  }
}
  
export async function getUser(req: Request, res: Response) {
  try {
      // const sessionCookie = req.cookies.session;
      // const userRole = req.cookies.name; 
      
      // if (!sessionCookie || !userRole) {
      //     return res.status(403).json({ message: "Unauthorized" });
      // }

      const { uid } = req.params; 

      if (!uid) {
          return res.status(400).json({ message: "User ID (uid) is required" });
      }

      const connect: ConnectionRes = await connectToCluster(); 
      if (typeof connect.conn === "string") {
          return res.status(500).json(connect);
      }

      const conn = connect.conn;
      const db = conn.db("Master");
      const collection = db.collection("users");

      const query = { uid };

      const user = await collection.findOne(query);

      if (user) {
          res.status(200).json({ message: "User found", user });
      } else {
          res.status(404).json({ message: "User not found" });
      }
  } catch (error) {
      console.error("Error in getUser function:", error);
      res.status(500).json({ message: "Internal server error" });
  }
}
