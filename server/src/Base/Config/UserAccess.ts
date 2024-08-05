/**
 * UserAccess Interface
 * @param Id: string
 * @param Session: string
 * @param Token: string
 */
export interface UserAccessInterface {
  Id: string;
  Session: string;
  Token: string;
}


/**
 * UserAccess Class Interface
 * @param UserAccessInterface
 */
export default interface UserAccessClass extends UserAccessInterface {
  setUserAccess(userAccess: UserAccessInterface): void;
  setBlank(): void;
  validate(Id: string, CurSession: string, Token: string): void;
  insert(email: string): void;
  update(email: string): void;
  delete(email: string): void;
  get(): void;
  flush(): void;
}

