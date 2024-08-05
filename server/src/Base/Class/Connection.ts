import sql, { ConnectionError, Transaction } from "mssql";
import CommonMessage from "../Config/response/CommonMessage";
import ResStatus from "../Config/response/ResStatus";
import ResponseClass from "./Response";
import dotenv from "dotenv";

dotenv.config({ path: "data.env" });

/**
 * Connection class
 */
class Connection {

  private config = {
    server: process.env.DB_SERVER || "",
    authentication: {
      type: 'default',
      options: {
        userName: process.env.DB_USER || "",
        password: process.env.DB_PWD || "",
      },
    },
    options: {
      encrypt: false,
      database: process.env.DB_NAME || "",
    },
  }

  private client: sql.ConnectionPool;
  private transaction: Transaction;






  constructor() {
    this.client = new sql.ConnectionPool(this.config);
    this.transaction = new sql.Transaction(this.client);

  }

  /**
   * Connect to the database
   */
  async connect() {
    try {
      await this.client.connect();
    } catch (error: any) {
      if (
        error instanceof ConnectionError
      ) {
        throw new ResponseClass(
          ResStatus.ConnectionError,
          CommonMessage.ConnectionError
        );
      } else {
        throw new ResponseClass(
          ResStatus.InternalServerError,
          CommonMessage.InternalServerError
        );
      }
    }
  }


  /**
   * Get the connection
   */
  get() {
    return this.client;
  }

  /**
   * Run the query
   * @param query
   */
  async query(query: string) {
    try {
      console.log(query);
      const result = await this.client.query(query);
      return result.recordset;
    } catch (error: any) {
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Close the connection
   */
  async close() {
    await this.client.close();
  }

  /**
   * Set Database Session
   */
  async start() {
    await this.transaction.begin();
  }

  /**
   * Commit Transaction
   */
  async commit() {
    await this.transaction.commit();
  }

  /**
   * Abort Transaction
   */
  async abort() {
    await this.transaction.rollback();
  }
}

export default Connection;
