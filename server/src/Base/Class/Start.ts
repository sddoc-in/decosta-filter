import Connection from "./Connection";
import { v4 as uuidv4 } from "uuid";
import Validations from "./Validations";
import ResponseClass from "./Response";
import ResStatus from "../Config/response/ResStatus";
import CommonMessage from "../Config/response/CommonMessage";
import objectToString from "../Utills/objectToString";
import convertToInsertValues from "../Utills/convertToInsertValues";
import convertToInsertOuput from "../Utills/convertToInsertOutput";
import converToUpdate from "../Utills/convertToUpdate";

class Start extends Validations {
  protected connect: Connection = new Connection();

  /**
   * Connect Database
   */
  async connectDb() {
    await this.connect.connect();
  }

  /**
   * Generate Id
   * @returns
   */
  generateId() {
    return uuidv4();
  }

  /**
   * Get Date Time
   */
  getDateTime() {
    return new Date().toISOString().slice(0, 19).replace("T", " ");
  }

  /**
   * Add Days
   * @param date
   * @param days
   * @returns
   */
  addDays(date: string, days: number) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().slice(0, 19).replace("T", " ");
  }

  /**
   * Delete One
   * @description Delete one document from the collection
   * @param collection
   * @param query
   */
  async deleteOne(collection: string, query: any, operator: string = "AND") {
    try {
      await this.connect.start();
      await this.connect.query(`DELETE FROM ${collection} ` + objectToString(query, operator));
      await this.connect.commit();
    } catch (error: any) {
      await this.connect.abort();
      if (error instanceof ResponseClass) {
        throw error;
      }
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Insert One
   * @description Insert one document into the collection
   * @param collection
   * @param query
   */
  async insertOne(collection: string, query: any) {
    try {
      await this.connect.start();
      await this.connect.query(`INSERT INTO ${collection} ` + convertToInsertValues(query));
      await this.connect.commit();
    } catch (error: any) {
      await this.connect.abort();
      if (error instanceof ResponseClass) {
        throw error;
      }
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Insert With Outout Columns
   * @description Insert one document into the collection
   * @param collection
   * @param query
   * @param columns
   */
  async insertOneWithOutput(collection: string, query: any, columns: string[]) {
    try {
      await this.connect.start();
      let val = await this.connect.query(`INSERT INTO ${collection} ` + convertToInsertOuput(query, columns));
      await this.connect.commit();
      return val[0]
    } catch (error: any) {
      console.log(error);
      await this.connect.abort();
      if (error instanceof ResponseClass) {
        throw error;
      }
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Update One
   * @description Update one document in the collection
   * @param collection
   * @param query
   * @param updateQuery
   * @param operator
   */
  async updateOne(collection: string, query: any, updateQuery: any, operator: string = "AND") {
    try {

      await this.connect.start();
      await this.connect.query(`UPDATE ${collection} SET ` + converToUpdate(updateQuery)  + objectToString(query, operator));
      await this.connect.commit();
    } catch (error: any) {
      await this.connect.abort();
      if (error instanceof ResponseClass) {
        throw error;
      }
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Get With Columns
   * @description Get with columns from the collection
   * @param collection
   * @param query
   * @param columns
   */
  async getWithColumns(collection: string, query: any, columns: string[], operator: string = "AND") {
    try {
      let data = await this.connect.query(`SELECT ${columns.join(",")} FROM ${collection} ` + objectToString(query, operator));

      console.log(data);

      if(data.length === 0) {
        return {}
      }
      else {
        return data[0]
      }

      // return (await this.connect.query(`SELECT ${columns.join(",")} FROM ${collection} ` + objectToString(query, operator)))[0]
    } catch (error: any) {
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Get One
   * @description Get one document from the collection
   * @param collection
   * @param query
   */
  async getOne(collection: string, query: any, operator: string = "AND") {
    try {
      return (await this.connect.query(`SELECT * FROM ${collection} ` + objectToString(query, operator)))[0];
    } catch (error: any) {
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Get All
   * @description Get all documents from the collection
   * @param collection
   * @param query
   */
  async getAll(collection: string, query: any, operator: string = "AND") {
    try {
      return await this.connect.query(`SELECT * FROM ${collection} ` + objectToString(query, operator));
    } catch (error: any) {
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Get All With Columns
   * @description Get all documents with columns from the collection
   * @param collection
   * @param query
   * @param columns
   * @param operator
   */
  async getAllWithColumns(collection: string, query: any, columns: string[], operator: string = "AND") {
    try {
      return await this.connect.query(`SELECT ${columns.join(",")} FROM ${collection} ` + objectToString(query, operator));
    } catch (error: any) {
      console.log(error);
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Run Query
   * @description Run query
   * @param query
   * @param operator
   * @param where
   */
  async runQuery(query: string, where: string, operator: string = "AND") {
    try {
      return await this.connect.query(query + objectToString(where, operator));
    } catch (error: any) {
      console.log(error);
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Flush
   */
  flush() {
    this.connect.close();
  }
}

export default Start;
