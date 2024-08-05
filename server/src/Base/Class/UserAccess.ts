import Bearer from "./Bearer";
import Session from "./Session";
import Collections from "../Config/collections";
import ResStatus from "../Config/response/ResStatus";
import ResponseClass from "./Response";
import UserFieldsMessage from "../Config/response/User";
import Start from "./Start";
import CommonFields from "../Config/response/CommonFields";
import CommonMessage from "../Config/response/CommonMessage";
import UserAccessClass, { UserAccessInterface } from "../Interface/UserAccess";

class UserAccess extends Start implements UserAccessClass {

  Id: string = "";
  Session: string = "";
  Token: string = "";

  /**
   * Constructor for UserAccess
   * @param userAccess 
   */
  constructor(userAccess?: UserAccessInterface) {
    super();
    if (userAccess) {
      this.setUserAccess(userAccess);
    } else {
      this.setBlank();
    }
  }

  /**
   * Set the values of the UserAccess as Blank
   * @returns void
   */
  setBlank(): void {
    this.Id = "";
    this.Session = "";
    this.Token = "";
  }

  /**
   * Set the values of the UserAccess 
   * @param userAccess 
   * @returns void
   */
  setUserAccess(userAccess: UserAccessInterface): void {
    this.Id = userAccess.Id;
    this.Session = userAccess.Session;
    this.Token = userAccess.Token;
  }

  /**
   * Get the values of the UserAccess
   * @returns UserAccessInterface
   */
  get(): UserAccessInterface {
    return {
      Id: this.Id,
      Session: this.Session,
      Token: this.Token,
    };
  }

  /**
   * Set Id
   * @param Id
   */
  paramId(Id: string = this.Id) {
    this.Id = Id;
    return this.Id;
  }

  
  /**
   * Set New Access
   * @param Id
   * @param Session
   * @param Token
   */
  setNewAccess(Id: string, Session: string, Token: string) {
    this.Id = Id;
    this.Session = Session;
    this.Token = Token;
  }

  /**
   * Generate New Access
   * @param email
   * @returns void
   * @memberof UserAccess
   */
  generateNewAccess(email: string) {
    this.Session = new Session().createSession();
    this.Token = new Bearer().createBearer(
      email,
      this.Id,
      this.Session
    );
  }

  /**
   * Create New Access
   * @param email
   */
  async insert(email: string) {
    this.generateNewAccess(email);
    await this.insertOne(Collections.UserAccess, this.get());
  }

  /**
   * Update Access
   * @param email
   */
  async update(email: string) {
    this.generateNewAccess(email);
    await this.updateOne(Collections.UserAccess, { Id: this.Id }, this.get());
  }

  /**
   * Remove Access
   * @returns
   */
  async delete() {
    await this.deleteOne(Collections.UserAccess, { Id: this.Id });
  }

  /**
   * Get Access
   * @returns
   */
  async getAccessById(Id: string = this.Id) {
    const collection = (await this.getOne(Collections.UserAccess, {
      Id: Id,
    })) as unknown as UserAccessInterface;
    if (collection === null) {
      throw new ResponseClass(
        ResStatus.NotFound,
        UserFieldsMessage.AccessNotExists
      );
    }
    this.setNewAccess(
      collection.Id,
      collection.Session,
      collection.Token
    );
  }

  /**
    * Check Access
    * @param Id
    * @param Session
    * @param Token
    */
  validate(Id: string = this.Id, CurSession: string = this.Session, Token: string = this.Token) {
    try {
      if (Id === undefined || Id === null || Id === "") {
        throw new ResponseClass(ResStatus.BadRequest, CommonFields.Id);
      }
      new Session(CurSession).validateSession();
      new Bearer().validateToken(Token);
    } catch (error) {
      if (error instanceof ResponseClass) {
        throw error;
      }
      throw new ResponseClass(ResStatus.InternalServerError, CommonMessage.InternalServerError);
    }
  }



  /**
   * Flush
   */
  async flush() {
    super.flush();
    this.setBlank();
  }
}

export default UserAccess;
