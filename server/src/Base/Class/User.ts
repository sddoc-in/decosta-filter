import Collections from "../Config/collections";
import ResStatus from "../Config/response/ResStatus";
import UserFieldsMessage from "../Config/response/User";
import UserClass, { EmptyUser, UserInterface } from "../Interface/User";
import convertDataForInterface from "../Utills/convertDataForInterface";
import Hash from "./Hash";
import ResponseClass from "./Response";
import Start from "./Start";


class User extends Start implements UserClass {
  Id: string = "";
  Email: string = "";
  Name: string = "";
  Password: string = "";
  Enabled: number = 0;
  Language: string = "en-IN";
  ModifiedBy: string = "";
  ModifiedDateTime?: string = "";
  RecId: number = 0;
  CreatedBy: string = "";
  CreatedDateTime?: string = "";

  /**
   * Constructor for User
   * @param user 
   */
  constructor(user?: UserClass) {
    super();
    if (user) {
      this.setUser(user);
    } else {
      this.setBlank();
    }
  }

  /**
   * Set the values of the User as Blank
   * @returns void
   */
  setBlank(): void {
    this.Id = "";
    this.Email = "";
    this.Name = "";
    this.Password = "";
    this.Enabled = 1;
    this.Language = "en-IN";
    this.ModifiedBy = "";
    this.CreatedBy = "";
  }

  /**
   * Set the values of the User 
   * @param user 
   * @returns void
   */
  setUser(user: UserClass): void {
    this.Id = user.Id || "";
    this.Email = user.Email || "";
    this.Name = user.Name || "";
    this.Password = user.Password || "";
    this.Enabled = user.Enabled || 1;
    this.Language = user.Language || "en-IN";
    this.ModifiedBy = user.ModifiedBy || "";
    this.CreatedBy = user.CreatedBy || "";
  }

  get(): UserInterface {
    return {
      Id: this.Id,
      Email: this.Email,
      Name: this.Name,
      Password: this.Password,
      Enabled: this.Enabled,
      Language: this.Language,
      ModifiedBy: this.ModifiedBy,
      CreatedBy: this.CreatedBy,
      ModifiedDateTime: this.ModifiedDateTime,
      CreatedDateTime: this.CreatedDateTime
    }
  }

  paramId(Id: string = this.Id): string {
    return this.Id = Id;
  }

  paramEmail(Email: string = this.Email): string {
    return this.Email = Email;
  }

  paramName(Name: string = this.Name): string {
    return this.Name = Name;
  }

  paramPassword(Password: string = this.Password): string {
    return this.Password = Password;
  }

  paramEnabled(Enabled: number = this.Enabled): number {
    return this.Enabled = Enabled;
  }

  paramLanguage(Language: string = this.Language): string {
    return this.Language = Language;
  }

  paramModifiedBy(ModifiedBy: string = this.ModifiedBy): string {
    return this.ModifiedBy = ModifiedBy;
  }

  paramModifiedDateTime(ModifiedDateTime: string = this.ModifiedDateTime || ""): string {
    return this.ModifiedDateTime = ModifiedDateTime;
  }

  paramRecId(RecId: number = this.RecId): number {
    return this.RecId = RecId;
  }

  paramCreatedBy(CreatedBy: string = this.CreatedBy): string {
    return this.CreatedBy = CreatedBy;
  }

  paramCreatedDateTime(CreatedDateTime: string = this.CreatedDateTime || ""): string {
    return this.CreatedDateTime = CreatedDateTime;
  }


  validate(): void {
    this.validateEmail(this.Email);
    this.validateName(this.Name);
    this.validatePassword(this.Password);
  }

  async modified(): Promise<void> {
    this.validate()
    this.ModifiedDateTime = this.getDateTime();
    // if (!this.Id) this.Id = await new Sequence().getNext(await new SysTableId().getTableId(Collections.User));
  }

  async checkExists(Id: string = this.Id, Email: string = this.Email): Promise<void> {
    const user: UserInterface = await this.getWithColumns(Collections.User, { Id: Id, Email: Email }, ["RecId"], "OR")
    if (user !== undefined && user.RecId) throw new ResponseClass(ResStatus.Error, UserFieldsMessage.UserAlreadyExists);
  }

  async checkNotExists(Id: string = this.Id, Email: string = this.Email): Promise<void> {
    const user: UserInterface = await this.getWithColumns(Collections.User, { Id: Id, Email: Email }, ["RecId"], "OR")
    if (!user.RecId) throw new ResponseClass(ResStatus.Error, UserFieldsMessage.UserNotFound);
  }

  async getUser(Id: string = this.Id, Email: string = this.Email, RecId: number = this.RecId || 0): Promise<UserInterface> {
    let user: UserInterface = convertDataForInterface(await this.getOne(Collections.User, { Id: Id, Email: Email, RecId: RecId }, "OR"), EmptyUser) as UserInterface;
    if (user.RecId) return user;
    throw new ResponseClass(ResStatus.Error, UserFieldsMessage.UserNotFound);
  }

  async insert(): Promise<void> {
    await this.modified();
    this.CreatedDateTime = this.ModifiedDateTime;
    this.Password = new Hash(this.Password).hash();
    this.RecId = (await this.insertOneWithOutput(Collections.User, this.get(), ["RecId"])).RecId;
  }

  async update(): Promise<void> {
    this.modified();
    await this.updateOne(Collections.User, { RecId: this.RecId }, this.get());
  }

  async delete(): Promise<void> {
    await this.deleteOne(Collections.User, { RecId: this.RecId, Id: this.Id }, "OR");
  }

  flush(): void {
    super.flush();
    this.setBlank();
  }

}

export default User;