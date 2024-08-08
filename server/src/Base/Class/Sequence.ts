import Collections from "../Config/collections";
import ResStatus from "../Config/response/ResStatus";
import SequenceFields from "../Config/response/Sequence";
import SequenceClass, { SequenceInterface } from "../Interface/Sequence";
import ResponseClass from "./Response";
import Start from "./Start";


class Sequence extends Start implements SequenceClass {
  Name: string = "";
  Description: string = "";
  SeqFor: number = 0;
  Prefix: string = "";
  Suffix: string = "";
  Curr: number = 0;
  Increment: number = 0;
  MaxDigits: number = 0;
  ModifiedBy: string = "";
  ModifiedDateTime?: string | undefined;
  CreatedBy: string = "";
  CreatedDateTime?: string | undefined;
  RecId?: number | undefined;

  /**
   * Constructor for Sequence
   * @param sequence 
   */
  constructor(sequence?: SequenceClass) {
    super();
    if (sequence) {
      this.setSequence(sequence);
    } else {
      this.setBlank();
    }
  }

  /**
   * Set the values of the Sequence as Blank
   * @returns void
   */
  setBlank(): void {
    this.Name = "";
    this.Description = "";
    this.Prefix = "";
    this.Suffix = "";
    this.Curr = 0;
    this.Increment = 0;
    this.MaxDigits = 0;
    this.ModifiedBy = "";
    this.CreatedBy = "";
  }

  /**
   * Set the values of the Sequence 
   * @param sequence 
   * @returns void
   */
  setSequence(sequence: SequenceInterface): void {
    this.Name = sequence.Name || "";
    this.Description = sequence.Description || "";
    this.SeqFor = sequence.SeqFor || 0;
    this.Prefix = sequence.Prefix || "";
    this.Suffix = sequence.Suffix || "";
    this.Curr = sequence.Curr || 0;
    this.Increment = sequence.Increment || 0;
    this.MaxDigits = sequence.MaxDigits || 0;
    this.ModifiedBy = sequence.ModifiedBy || "";
    this.CreatedBy = sequence.CreatedBy || "";
    this.RecId = sequence.RecId || 0;
  }

  /**
   * Get Sequence
   * @returns SequenceInterface
   */
  get(): SequenceInterface {
    return {
      Name: this.Name,
      Description: this.Description,
      SeqFor: this.SeqFor,
      Prefix: this.Prefix,
      Suffix: this.Suffix,
      Curr: this.Curr,
      Increment: this.Increment,
      MaxDigits: this.MaxDigits,
      ModifiedBy: this.ModifiedBy,
      CreatedBy: this.CreatedBy
    }
  }

  // params
  paramCreatedBy(CreatedBy: string = this.CreatedBy): string {
    this.CreatedBy = CreatedBy;
    return CreatedBy;
  }

  paramCreatedDateTime(CreatedDateTime: string = this.CreatedDateTime || ""): string {
    this.CreatedDateTime = CreatedDateTime;
    return CreatedDateTime;
  }

  paramModifiedBy(ModifiedBy: string = this.ModifiedBy): string {
    this.ModifiedBy = ModifiedBy;
    return ModifiedBy;
  }

  paramModifiedDateTime(ModifiedDateTime: string = this.ModifiedDateTime || ""): string {
    this.ModifiedDateTime = ModifiedDateTime;
    return ModifiedDateTime;
  }

  paramName(Name: string = this.Name): string {
    this.Name = Name;
    return Name;
  }

  paramDescription(Description: string = this.Description): string {
    this.Description = Description;
    return Description;
  }

  paramSeqFor(SeqFor: number = this.SeqFor): number {
    this.SeqFor = SeqFor;
    return SeqFor;
  }

  paramPrefix(Prefix: string = this.Prefix): string {
    this.Prefix = Prefix;
    return Prefix;
  }

  paramSuffix(Suffix: string = this.Suffix): string {
    this.Suffix = Suffix;
    return Suffix;
  }

  paramCurr(Curr: number = this.Curr): number {
    this.Curr = Curr;
    return Curr;
  }

  paramIncrement(Increment: number = this.Increment): number {
    this.Increment = Increment;
    return Increment;
  }

  paramMaxDigits(MaxDigits: number = this.MaxDigits): number {
    this.MaxDigits = MaxDigits;
    return MaxDigits;
  }

  paramRecId(RecId: number = this.RecId || 0): number {
    this.RecId = RecId;
    return RecId;
  }

  /**
   * Validate the Sequence
   * @returns void
   */
  validate(): void {
    this.validateName(this.Name);
    this.validateDescription(this.Description);
    this.validateSequenceFor(this.SeqFor)
    this.validateCurrent(this.Curr);
    this.validateIncrement(this.Increment);
  }

  /**
   * Modified the Sequence
   * @returns void
   */
  modified(): void {
    this.validate();
    this.ModifiedDateTime = this.getDateTime();
  }

  /**
   * Insert the Sequence
   * @returns void
   */
  async insert(): Promise<void> {
    this.modified();
    this.CreatedDateTime = this.ModifiedDateTime;
    this.RecId = (await this.insertOneWithOutput(Collections.Sequence, this.get(),["RecId"])).RecId
  }

  /**
    * Update the Sequence
    * @returns void
    */
  async update(): Promise<void> {
    this.modified();
    await this.updateOne(Collections.Sequence, { RecId: this.RecId }, this.get());
  }

  /**
   * Delete the Sequence
   * @param RecId
   * @param SeqFor
   * @returns void
   */
  async delete(SeqFor: number = this.SeqFor, RecId: number = this.RecId || 0): Promise<void> {
    await this.deleteOne(Collections.Sequence, { RecId: RecId, SeqFor: SeqFor }, "OR");
  }

  async getNext(SeqFor: number): Promise<string> {
    try {
      await this.connectDb();
      let sequence = (await this.getWithColumns(Collections.Sequence, { SeqFor: SeqFor }, ["Curr", "Increment", "Prefix", "Suffix", "MaxDigits", "RecId"])) as unknown as SequenceInterface;
      if (sequence) {
        const current = sequence.Curr + sequence.Increment;
        await this.updateOne(Collections.Sequence, { RecId: sequence.RecId }, { Curr: current });
        let prefix = sequence.Prefix ? sequence.Prefix + "-" : "";
        let suffix = sequence.Suffix ? "-" + sequence.Suffix : "";
        let midNum = current.toString().padStart(sequence.MaxDigits, "0");
        this.flush();
        return prefix + midNum + suffix;
      } else {
        throw new ResponseClass(ResStatus.NotFound, SequenceFields.SequenceNotFound);
      }
    } catch (e) {
      throw new ResponseClass(ResStatus.NotFound, SequenceFields.SequenceNotFound);
    }
  }

  /**
   * Check if the Sequence already exists
   * @param SeqFor 
   * @returns void
   */
  async checkExist(SeqFor: number = this.SeqFor): Promise<void> {
    let result = (await this.getWithColumns(Collections.Sequence, { SeqFor: SeqFor }, ["RecId"])) as unknown as SequenceInterface;
    if (result !== undefined && result.RecId) throw new ResponseClass(ResStatus.BadRequest, SequenceFields.SequenceAlreadyExists);
  }

  /**
   * Check if the Sequence does not exists
   * @param SeqFor
   * @returns void
   */
  async checkNotExist(SeqFor: number = this.SeqFor): Promise<void> {
    let result = (await this.getWithColumns(Collections.Sequence, { SeqFor: SeqFor }, ["RecId"])) as unknown as SequenceInterface;
    if (result === undefined || !result.RecId) throw new ResponseClass(ResStatus.BadRequest, SequenceFields.SequenceNotFound);
  }

  /**
   * Flush the Sequence
   * @returns void
   */
  flush(): void {
    super.flush();
    this.setBlank();
  }


}

export default Sequence;