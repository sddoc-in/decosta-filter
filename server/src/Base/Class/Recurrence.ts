import Collections from "../Config/collections";
import RecurrenceMessage from "../Config/response/Recurrence";
import ResStatus from "../Config/response/ResStatus";
import SearchMessage from "../Config/response/Search";
import RecurrenceType from "../Config/Search/RecurrenceType";
import SearchStatus from "../Config/Search/SearchStatus";
import RecurrenceClass, { RecurrenceInterface } from "../Interface/Recurrence";
import ResponseClass from "./Response";
import Start from "./Start";



class Recurrence extends Start implements RecurrenceClass {
    Country: string = '';
    ContentLanguages: string = '';
    StartDate: Date = new Date();
    EndDate: Date = new Date();
    Query: string = '';
    AdStatus: string = '';
    AdType: string = '';
    MinReach: number = 0;
    MaxReach: number = 0;
    MediaType: string = '';
    PublisherPlatforms: string = '';
    RecurrenceId: string = '';
    RecurrenceStatus: number = SearchStatus.Created;
    RecurenceStartDateTime: string = '';
    RecurrenceEndDateTime: string = '';
    Progress: number = 0;
    CreatedDateTime?: string = '';
    CreatedBy: string = '';
    ModifiedBy: string = '';
    ModifiedDateTime?: string = '';
    RecId?: number = 0;
    ScheduleDateTime: string = '';
    RecurrenceType: number = RecurrenceType.None;

    constructor(recurrence?: RecurrenceInterface) {
        super();
        if (recurrence) {
            this.setRecurrence(recurrence);
        }
        else {
            this.setBlank();
        }
    }

    setRecurrence(recurrence: RecurrenceInterface): void {
        this.Country = recurrence.Country || '';
        this.ContentLanguages = recurrence.ContentLanguages || '';
        this.StartDate = recurrence.StartDate || new Date();
        this.EndDate = recurrence.EndDate || new Date();
        this.Query = recurrence.Query || '';
        this.AdStatus = recurrence.AdStatus || '';
        this.AdType = recurrence.AdType || '';
        this.MinReach = recurrence.MinReach || 0;
        this.MaxReach = recurrence.MaxReach || 0;
        this.MediaType = recurrence.MediaType || '';
        this.PublisherPlatforms = recurrence.PublisherPlatforms || '';
        this.RecurrenceId = recurrence.RecurrenceId || '';
        this.RecurrenceStatus = recurrence.RecurrenceStatus || SearchStatus.Created;
        this.RecurenceStartDateTime = recurrence.RecurenceStartDateTime || '';
        this.RecurrenceEndDateTime = recurrence.RecurrenceEndDateTime || '';
        this.Progress = recurrence.Progress || 0;
        this.CreatedDateTime = recurrence.CreatedDateTime || '';
        this.CreatedBy = recurrence.CreatedBy || '';
        this.ModifiedBy = recurrence.ModifiedBy || '';
        this.ModifiedDateTime = recurrence.ModifiedDateTime || '';
        this.RecId = recurrence.RecId || 0;
        this.ScheduleDateTime = recurrence.ScheduleDateTime || '';
        this.RecurrenceType = recurrence.RecurrenceType || 0;
    }

    setBlank(): void {
        this.Country = '';
        this.ContentLanguages = '';
        this.StartDate = new Date();
        this.EndDate = new Date();
        this.Query = '';
        this.AdStatus = '';
        this.AdType = '';
        this.MinReach = 0;
        this.MaxReach = 0;
        this.MediaType = '';
        this.PublisherPlatforms = '';
        this.RecurrenceId = '';
        this.RecurrenceStatus = 0;
        this.RecurenceStartDateTime = '';
        this.RecurrenceEndDateTime = '';
        this.Progress = 0;
        this.CreatedBy = '';
        this.ModifiedBy = '';
        this.CreatedDateTime = '';
        this.ScheduleDateTime = '';
        this.RecurrenceType = RecurrenceType.None;
        this.RecId = 0;
    }

    get(): RecurrenceInterface {
        return {
            Country: this.Country,
            ContentLanguages: this.ContentLanguages,
            StartDate: this.StartDate,
            EndDate: this.EndDate,
            Query: this.Query,
            AdStatus: this.AdStatus,
            AdType: this.AdType,
            MinReach: this.MinReach,
            MaxReach: this.MaxReach,
            MediaType: this.MediaType,
            PublisherPlatforms: this.PublisherPlatforms,
            RecurrenceId: this.RecurrenceId,
            RecurrenceStatus: this.RecurrenceStatus,
            RecurenceStartDateTime: this.RecurenceStartDateTime,
            RecurrenceEndDateTime: this.RecurrenceEndDateTime,
            Progress: this.Progress,
            CreatedDateTime: this.CreatedDateTime,
            CreatedBy: this.CreatedBy,
            ModifiedBy: this.ModifiedBy,
            ModifiedDateTime: this.ModifiedDateTime,
            ScheduleDateTime: this.ScheduleDateTime,
            RecurrenceType: this.RecurrenceType
        };
    }

    paramCountry(Country: string = this.Country): string {
        this.Country = Country;
        return this.Country;
    }

    paramContentLanguages(ContentLanguages: string = this.ContentLanguages): string {
        this.ContentLanguages = ContentLanguages;
        return this.ContentLanguages;
    }

    paramStartDate(StartDate: Date = this.StartDate): Date {
        this.StartDate = StartDate;
        return this.StartDate;
    }

    paramEndDate(EndDate: Date = this.EndDate): Date {
        this.EndDate = EndDate;
        return this.EndDate;
    }

    paramQuery(Query: string = this.Query): string {
        this.Query = Query;
        return this.Query;
    }

    paramAdStatus(AdStatus: string = this.AdStatus): string {
        if (this.AdStatus.length == 0) this.AdStatus = AdStatus;
        else if (this.AdStatus.length > 0) this.AdStatus = this.AdStatus + "," + AdStatus;
        return this.AdStatus;
    }

    paramAdType(AdType: string = this.AdType): string {
        if (this.AdType.length == 0) this.AdType = AdType;
        else if (this.AdType.length > 0) this.AdType = this.AdType + "," + AdType;
        return this.AdType;
    }

    paramMinReach(MinReach: number = this.MinReach): number {
        this.MinReach = MinReach;
        return this.MinReach;
    }

    paramMaxReach(MaxReach: number = this.MaxReach): number {
        this.MaxReach = MaxReach;
        return this.MaxReach;
    }

    paramMediaType(MediaType: string = this.MediaType): string {
        if (this.MediaType.length == 0) this.MediaType = MediaType;
        else if (this.MediaType.length > 0) this.MediaType = this.MediaType + "," + MediaType;
        return this.MediaType;
    }

    paramPublisherPlatforms(PublisherPlatforms: string = this.PublisherPlatforms): string {
        if (this.PublisherPlatforms.length == 0) this.PublisherPlatforms = PublisherPlatforms;
        else if (this.PublisherPlatforms.length > 0) this.PublisherPlatforms = this.PublisherPlatforms + "," + PublisherPlatforms;
        return this.PublisherPlatforms;
    }

    paramScheduleDateTime(ScheduleDateTime: string = this.ScheduleDateTime): string {
        this.ScheduleDateTime = ScheduleDateTime;
        return this.ScheduleDateTime;
    }

    paramRecurrenceType(RecurrenceType: number = this.RecurrenceType): number {
        this.RecurrenceType = RecurrenceType;
        return this.RecurrenceType;
    }

    paramCreatedBy(CreatedBy: string = this.CreatedBy): string {
        this.CreatedBy = CreatedBy;
        return this.CreatedBy;
    }

    paramCreatedDateTime(CreatedDateTime: string = this.CreatedDateTime || ""): string {
        this.CreatedDateTime = CreatedDateTime;
        return this.CreatedDateTime;
    }

    paramModifiedBy(ModifiedBy: string = this.ModifiedBy): string {
        this.ModifiedBy = ModifiedBy;
        return this.ModifiedBy;
    }

    paramModifiedDateTime(ModifiedDateTime: string = this.ModifiedDateTime || ""): string {
        this.ModifiedDateTime = ModifiedDateTime;
        return this.ModifiedDateTime;
    }

    paramRecId(RecId: number = this.RecId || 0): number {
        this.RecId = RecId;
        return this.RecId;
    }

    paramRecurrenceId(RecurrenceId: string = this.RecurrenceId): string {
        this.RecurrenceId = RecurrenceId;
        return this.RecurrenceId;
    }

    paramRecurrenceStatus(RecurrenceStatus: number = this.RecurrenceStatus): number {
        this.RecurrenceStatus = RecurrenceStatus;
        return this.RecurrenceStatus;
    }

    paramRecurenceStartDateTime(RecurenceStartDateTime: string = this.RecurenceStartDateTime): string {
        this.RecurenceStartDateTime = RecurenceStartDateTime;
        return this.RecurenceStartDateTime;
    }

    paramRecurrenceEndDateTime(RecurrenceEndDateTime: string = this.RecurrenceEndDateTime): string {
        this.RecurrenceEndDateTime = RecurrenceEndDateTime;
        return this.RecurrenceEndDateTime;
    }

    paramProgress(Progress: number = this.Progress): number {
        this.Progress = Progress;
        return this.Progress;
    }


    validate(): void {
        if (!this.Query) throw new ResponseClass(ResStatus.BadRequest, SearchMessage.QueryEmpty);
        this.validateCountry(this.Country);
        this.validateContentLanguage(this.ContentLanguages);
        if (this.StartDate == null) throw new ResponseClass(ResStatus.BadRequest, SearchMessage.StartDateEmpty);
        if (this.EndDate == null) throw new ResponseClass(ResStatus.BadRequest, SearchMessage.EndDateEmpty);
        if (this.StartDate > this.EndDate) throw new ResponseClass(ResStatus.BadRequest, SearchMessage.StartDateGreaterThanEndDate);
        if (this.RecurrenceType !== RecurrenceType.None) {
            if (this.RecurenceStartDateTime == null) throw new ResponseClass(ResStatus.BadRequest, RecurrenceMessage.RecurrenceStartDateTime);
            if (this.RecurrenceEndDateTime == null) throw new ResponseClass(ResStatus.BadRequest, RecurrenceMessage.RecurrenceEndDateTime);
            if ((new Date(this.RecurenceStartDateTime).getTime()) > (new Date(this.RecurrenceEndDateTime).getTime())) throw new ResponseClass(ResStatus.BadRequest, RecurrenceMessage.StartDateGreaterThanEndDate);
        }
    }

    modified(): void {
        this.validate();
        this.CreatedDateTime = this.getDateTime();
    }

    async getRecurrence(RecurrenceId: string, RecId: number): Promise<RecurrenceInterface> {
        let recurrence = await this.getOne(Collections.Recurrence, { RecurrenceId: RecurrenceId, RecId: RecId });
        if (recurrence && recurrence.RecId) {
            return recurrence;
        }
        throw new ResponseClass(ResStatus.BadRequest, RecurrenceMessage.NotFound);
    }

    async createRecurrence(): Promise<void> {
        this.modified();
        await this.insertOne(Collections.Recurrence, this.get());
    }

    async updateRecurrence(): Promise<void> {
        this.modified();
        await this.updateOne(Collections.Recurrence, { RecurrenceId: this.RecurrenceId, RecId: this.RecId }, this.get());
    }

    async deleteRecurrence(RecurrenceId: string = this.RecurrenceId, RecId: number = this.RecId || 0): Promise<void> {
        await this.deleteOne(Collections.Recurrence, { RecurrenceId: RecurrenceId, RecId: RecId }, "OR");
    }

    flush(): void {
        super.flush();
        this.setBlank();
    }





}

export default Recurrence;