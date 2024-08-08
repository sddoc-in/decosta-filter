import Collections from "../Config/collections";
import ResultsInterfaceClass, { ResultsInterface } from "../Interface/Results";
import Start from "./Start";



class Results extends Start implements ResultsInterfaceClass {

    PageName: string = '';
    Description: string = '';
    AdCreativeId: string = '';
    AdArchiveID: string = '';
    PageId: string = '';
    CallToActionButton: string = '';
    LinkUrl: string = '';
    AdUrl: string = '';
    PageProfileUrl: string = '';
    IsActive: number = 0;
    TotalReach: number = 0;
    CurrentPageLike: number = 0;
    Duplicate: number = 0;
    ActiveDays: string = '';
    StartDate: string = '';
    EndDate: string = '';
    SearchId: string = '';
    CreatedDateTime: string = '';
    RecId?: number = 0;

    constructor(results?: ResultsInterface) {
        super();
        if (results) {
            this.setResults(results);
        } else {
            this.setBlank();
        }
    }

    setResults(results: ResultsInterface): void {
        this.PageName = results.PageName;
        this.Description = results.Description;
        this.AdCreativeId = results.AdCreativeId;
        this.AdArchiveID = results.AdArchiveID;
        this.PageId = results.PageId;
        this.CallToActionButton = results.CallToActionButton;
        this.LinkUrl = results.LinkUrl;
        this.AdUrl = results.AdUrl;
        this.PageProfileUrl = results.PageProfileUrl;
        this.IsActive = results.IsActive;
        this.TotalReach = results.TotalReach;
        this.CurrentPageLike = results.CurrentPageLike;
        this.Duplicate = results.Duplicate;
        this.ActiveDays = results.ActiveDays;
        this.StartDate = results.StartDate;
        this.EndDate = results.EndDate;
        this.SearchId = results.SearchId;
        this.CreatedDateTime = results.CreatedDateTime;
    }

    setBlank(): void {
        this.PageName = '';
        this.Description = '';
        this.AdCreativeId = '';
        this.AdArchiveID = '';
        this.PageId = '';
        this.CallToActionButton = '';
        this.LinkUrl = '';
        this.AdUrl = '';
        this.PageProfileUrl = '';
        this.IsActive = 0;
        this.TotalReach = 0;
        this.CurrentPageLike = 0;
        this.Duplicate = 0;
        this.ActiveDays = '';
        this.StartDate = '';
        this.EndDate = '';
        this.SearchId = '';
        this.CreatedDateTime = '';
    }

    get(): ResultsInterface {
        return {
            PageName: this.PageName,
            Description: this.Description,
            AdCreativeId: this.AdCreativeId,
            AdArchiveID: this.AdArchiveID,
            PageId: this.PageId,
            CallToActionButton: this.CallToActionButton,
            LinkUrl: this.LinkUrl,
            AdUrl: this.AdUrl,
            PageProfileUrl: this.PageProfileUrl,
            IsActive: this.IsActive,
            TotalReach: this.TotalReach,
            CurrentPageLike: this.CurrentPageLike,
            Duplicate: this.Duplicate,
            ActiveDays: this.ActiveDays,
            StartDate: this.StartDate,
            EndDate: this.EndDate,
            SearchId: this.SearchId,
            CreatedDateTime: this.CreatedDateTime
        }
    }

    flush(): void {
        super.flush();
        this.setBlank();
    }

    // params
    paramPageName(PageName: string = this.PageName): string {
        this.PageName = PageName;
        return this.PageName;
    }

    paramDescription(Description: string = this.Description): string {
        this.Description = Description;
        return this.Description;
    }

    paramAdCreativeId(AdCreativeId: string = this.AdCreativeId): string {
        this.AdCreativeId = AdCreativeId;
        return this.AdCreativeId;
    }

    paramAdArchiveID(AdArchiveID: string = this.AdArchiveID): string {
        this.AdArchiveID = AdArchiveID;
        return this.AdArchiveID;
    }

    paramPageId(PageId: string = this.PageId): string {
        this.PageId = PageId;
        return this.PageId;
    }

    paramCallToActionButton(CallToActionButton: string = this.CallToActionButton): string {
        this.CallToActionButton = CallToActionButton;
        return this.CallToActionButton;
    }


    paramLinkUrl(LinkUrl: string = this.LinkUrl): string {
        this.LinkUrl = LinkUrl;
        return this.LinkUrl;
    }

    paramAdUrl(AdUrl: string = this.AdUrl): string {
        this.AdUrl = AdUrl;
        return this.AdUrl;
    }

    paramPageProfileUrl(PageProfileUrl: string = this.PageProfileUrl): string {
        this.PageProfileUrl = PageProfileUrl;
        return this.PageProfileUrl;
    }

    paramIsActive(IsActive: number = this.IsActive): number {
        this.IsActive = IsActive;
        return this.IsActive;
    }

    paramTotalReach(TotalReach: number = this.TotalReach): number {
        this.TotalReach = TotalReach;
        return this.TotalReach;
    }

    paramCurrentPageLike(CurrentPageLike: number = this.CurrentPageLike): number {
        this.CurrentPageLike = CurrentPageLike;
        return this.CurrentPageLike;
    }

    paramDuplicate(Duplicate: number = this.Duplicate): number {
        this.Duplicate = Duplicate;
        return this.Duplicate;
    }

    paramActiveDays(ActiveDays: string = this.ActiveDays): string {
        this.ActiveDays = ActiveDays;
        return this.ActiveDays;
    }

    paramStartDate(StartDate: string = this.StartDate): string {
        this.StartDate = StartDate;
        return this.StartDate;
    }

    paramEndDate(EndDate: string = this.EndDate): string {
        this.EndDate = EndDate;
        return this.EndDate;
    }

    paramSearchId(SearchId: string = this.SearchId): string {
        this.SearchId = SearchId;
        return this.SearchId;
    }

    paramCreatedDateTime(CreatedDateTime: string = this.CreatedDateTime): string {
        this.CreatedDateTime = CreatedDateTime;
        return this.CreatedDateTime;
    }

    paramRecId(RecId: number = this.RecId || 0): number {
        this.RecId = RecId;
        return this.RecId;
    }

    async insert(): Promise<void> {
        this.CreatedDateTime = this.getDateTime();
        this.RecId = (await this.insertOneWithOutput(Collections.Results, this.get(), ["RecId"])).RecId;
    }

    async delete(RecId: number = this.RecId || 0): Promise<void> {
        await this.deleteOne(Collections.Results, { RecId: RecId });
    }
}

export default Results;