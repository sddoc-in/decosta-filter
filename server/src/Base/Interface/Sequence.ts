
/**
 * Interface for Sequence
 * @readonly
 */
export interface SequenceInterface {
    Name: string;
    Description: string;
    SeqFor:number;
    Prefix: string;
    Suffix: string;
    Curr: number;
    Increment: number;
    MaxDigits: number;
    ModifiedBy: string;
    ModifiedDateTime?: string;
    CreatedBy: string;
    CreatedDateTime?: string;
    RecId?: number;
}


export default interface SequenceClass extends SequenceInterface {
    setSequence(sequence: SequenceInterface): void;
    setBlank(): void;
    validate(): void;
    modified(): void;
    insert(): void;
    update(): void;
    delete(): void;
    get(): void;
    getNext(For:number): void;
    checkExist(For:number): void;
    flush(): void;

    // params
    paramCreatedBy(CreatedBy: string): string;
    paramCreatedDateTime(CreatedDateTime: string): string;
    paramModifiedBy(ModifiedBy: string): string;
    paramModifiedDateTime(ModifiedDateTime: string): string;
    paramName(Name: string): string;
    paramDescription(Description: string): string;
    paramSeqFor(SeqFor:number): number;
    paramPrefix(Prefix: string): string;
    paramSuffix(Suffix: string): string;
    paramCurr(Curr: number): number;
    paramIncrement(Increment: number): number;
    paramMaxDigits(MaxDigits: number): number;
    paramRecId(RecId: number): number;
}


export const EmptySequence: SequenceInterface = {
    Name: '',
    Description: '',
    SeqFor:0,
    Prefix: '',
    Suffix: '',
    Curr: 0,
    Increment: 0,
    MaxDigits: 0,
    ModifiedBy: '',
    ModifiedDateTime: '',
    CreatedBy: '',
    CreatedDateTime: '',
    RecId: 0
}