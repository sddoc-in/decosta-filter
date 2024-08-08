import { set } from "mongoose";
import AdStatus from "../Config/Search/AdStatus";
import AdType from "../Config/Search/AdType";
import MediaType from "../Config/Search/MediaType";
import PublisherPlatforms from "../Config/Search/PublisherPlatforms";
import SearchClass, { SearchInterface } from "../Interface/Search";
import Start from "./Start";
import ResponseClass from "./Response";
import ResStatus from "../Config/response/ResStatus";
import SearchMessage from "../Config/response/Search";
import Collections from "../Config/collections";
import SearchStatus from "../Config/Search/SearchStatus";

import axios from "axios";
import dotenv from "dotenv";
dotenv.config({ path: "data.env" });



class Search extends Start implements SearchClass {

    // Filter
    Country: string = "";
    ContentLanguages: string = "";
    StartDate: Date = new Date("2024-01-01");
    EndDate: Date = new Date();
    Query: string = "";
    AdStatus: string = AdStatus.Active.toString();
    AdType: string = AdType.All.toString();
    MinReach: number = 0;
    MaxReach: number = 0;
    MediaType: string = MediaType.All.toString();
    PublisherPlatforms: string = PublisherPlatforms.All.toString();

    // Metadata
    SearchId: string = "";
    SearchStatus: number = 0;
    FoundResults: number = 0;
    Progress: number = 0;
    CreatedDateTime: string = "";
    CreatedBy: string = "";
    ModifiedBy: string  = "";
    ModifiedDateTime: string = "";
    RecId: number = 0;

    // Extra
    Page: number = 0;
    NextForwardCursor: string = "";
    NextBackwardCursor: string = "";
    NextCollationToken: string = "";

    constructor(search?: SearchInterface) {
        super();
        if (search) this.setSearch(search);
        else this.setBlank();

    }

    setSearch(search: SearchInterface): void {
        this.Country = search.Country || "";
        this.ContentLanguages = search.ContentLanguages || "";
        this.StartDate = search.StartDate || new Date("2024-01-01");
        this.EndDate = search.EndDate || new Date();
        this.Query = search.Query || "";
        this.AdStatus = search.AdStatus || AdStatus.Active.toString();
        this.AdType = search.AdType || AdType.All.toString();
        this.MinReach = search.MinReach || 0;
        this.MaxReach = search.MaxReach || 0;
        this.MediaType = search.MediaType || MediaType.All.toString();
        this.PublisherPlatforms = search.PublisherPlatforms || PublisherPlatforms.All.toString();
        this.SearchId = search.SearchId || "";
        this.SearchStatus = search.SearchStatus || SearchStatus.Created;
        this.FoundResults = search.FoundResults || 0;
        this.Progress = search.Progress || 0;
        this.CreatedDateTime = search.CreatedDateTime || new Date().toISOString();
        this.CreatedBy = search.CreatedBy || "";
        this.ModifiedBy = search.ModifiedBy || "";
        this.ModifiedDateTime = search.ModifiedDateTime || "";
        this.RecId = search.RecId || 0;
        this.Page = search.Page || 1;
        this.NextForwardCursor = search.NextForwardCursor || "";
        this.NextBackwardCursor = search.NextBackwardCursor || "";
        this.NextCollationToken = search.NextCollationToken || "";
    }

    setBlank(): void {
        this.Country = "";
        this.ContentLanguages = "";
        this.StartDate = new Date("2024-01-01");
        this.EndDate = new Date();
        this.Query = "";
        this.AdStatus = AdStatus.Active.toString();
        this.AdType = AdType.All.toString();
        this.MinReach = 0;
        this.MaxReach = 0;
        this.MediaType = MediaType.All.toString();
        this.PublisherPlatforms = PublisherPlatforms.All.toString();
        this.SearchId = "";
        this.SearchStatus = 0;
        this.FoundResults = 0;
        this.Progress = 0;
        this.CreatedDateTime = new Date().toISOString();
        this.CreatedBy = "";
        this.ModifiedBy = "";
        this.ModifiedDateTime = "";
        this.RecId = 0;
        this.Page = 0;
        this.NextForwardCursor = "";
        this.NextBackwardCursor = "";
        this.NextCollationToken = "";
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

    paramSearchId(SearchId: string = this.SearchId): string {
        this.SearchId = SearchId;
        return this.SearchId;
    }

    paramSearchStatus(SearchStatus: number = this.SearchStatus): number {
        this.SearchStatus = SearchStatus;
        return this.SearchStatus;
    }


    paramFoundResults(FoundResults: number = this.FoundResults): number {
        this.FoundResults = FoundResults;
        return this.FoundResults;
    }

    paramProgress(Progress: number = this.Progress): number {
        this.Progress = Progress;
        return this.Progress;
    }

    paramCreatedDateTime(CreatedDateTime: string = this.CreatedDateTime): string {
        this.CreatedDateTime = CreatedDateTime;
        return this.CreatedDateTime;
    }

    paramCreatedBy(CreatedBy: string = this.CreatedBy): string {
        this.CreatedBy = CreatedBy;
        return this.CreatedBy;
    }

    paramModifiedBy(ModifiedBy: string = this.ModifiedBy): string {
        this.ModifiedBy = ModifiedBy;
        return this.ModifiedBy;
    }

    paramModifiedDateTime(ModifiedDateTime: string = this.ModifiedDateTime): string {
        this.ModifiedDateTime = ModifiedDateTime;
        return this.ModifiedDateTime;
    }

    paramRecId(RecId: number = this.RecId): number {
        this.RecId = RecId;
        return this.RecId;
    }

    paramPage(Page: number = this.Page): number {
        this.Page = Page;
        return this.Page;
    }

    paramNextForwardCursor(NextForwardCursor: string = this.NextForwardCursor): string {
        this.NextForwardCursor = NextForwardCursor;
        return this.NextForwardCursor;
    }

    paramNextBackwardCursor(NextBackwardCursor: string = this.NextBackwardCursor): string {
        this.NextBackwardCursor = NextBackwardCursor;
        return this.NextBackwardCursor;
    }

    paramNextCollationToken(NextCollationToken: string = this.NextCollationToken): string {
        this.NextCollationToken = NextCollationToken;
        return this.NextCollationToken;
    }

    get(): SearchInterface {
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
            SearchId: this.SearchId,
            SearchStatus: this.SearchStatus,
            FoundResults: this.FoundResults,
            Progress: this.Progress,
            CreatedDateTime: this.CreatedDateTime,
            CreatedBy: this.CreatedBy,
            ModifiedBy: this.ModifiedBy,
            ModifiedDateTime: this.ModifiedDateTime,
            Page: this.Page,
            NextForwardCursor: this.NextForwardCursor,
            NextBackwardCursor: this.NextBackwardCursor,
            NextCollationToken: this.NextCollationToken
        }
    }

    validate(): void {
        if(!this.Query) throw new ResponseClass(ResStatus.BadRequest, SearchMessage.QueryEmpty);
        this.validateCountry(this.Country);
        this.validateContentLanguage(this.ContentLanguages);
        if (this.StartDate == null) throw new ResponseClass(ResStatus.BadRequest, SearchMessage.StartDateEmpty);
        if (this.EndDate == null) throw new ResponseClass(ResStatus.BadRequest, SearchMessage.EndDateEmpty);
        if (this.StartDate > this.EndDate) throw new ResponseClass(ResStatus.BadRequest, SearchMessage.StartDateGreaterThanEndDate);
    }

    modified(): void {
        this.validate();
        this.CreatedDateTime = this.getDateTime();
    }

    /**
     * Check Exists
     * @param SearchId
     * @throws SearchMessage.SearchAlreadyExists
     * @returns void
     */
    async checkExists(SearchId: string = this.SearchId): Promise<void> {
        const search: SearchInterface = await this.getOne(Collections.Search, { SearchId: SearchId });
        if (search !== undefined && search.RecId) throw new ResponseClass(ResStatus.Error, SearchMessage.SearchAlreadyExists);
    }

    /**
     * Check Not Exists
     * @param SearchId 
     */
    async checkNotExists(SearchId: string = this.SearchId): Promise<void> {
        const search: SearchInterface = await this.getOne(Collections.Search, { SearchId: SearchId });
        if (!search.RecId) throw new ResponseClass(ResStatus.Error, SearchMessage.SearchNotFound);
    }

    /**
     * Get Search
     * @param SearchId
     * @returns SearchInterface
     * @throws SearchMessage.SearchNotFound
     */
    async insert(): Promise<void> {
        this.modified();
        this.RecId = (await this.insertOneWithOutput(Collections.Search, this.get(), ["RecId"])).RecId;
    }

    /**
     * Update Search
     * @param SearchId 
     */
    async update(SearchId:string = this.SearchId): Promise<void> {
        this.modified();
        await this.updateOne(Collections.Search, { SearchId: SearchId }, this.get());
    }

    /**
     * Delete Search
     * @param SearchId 
     */
    async delete(SearchId:string = this.SearchId): Promise<void> {
        await this.deleteOne(Collections.Search, { SearchId: SearchId });
        await this.deleteOne(Collections.Results, { SearchId: SearchId });
    }

    /**
     * Start Search
     * @param SearchId
     */
    async start(SearchId: string = this.SearchId): Promise<void> {
        axios.get(process.env.AUTOMATION_URL + "ads?SearchID=" + SearchId)
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
        await this.updateOne(Collections.Search, { SearchId: SearchId }, { SearchStatus: SearchStatus.InProgress });
    }

    /**
     * Stop Search
     * @param SearchId
     */
    async stop(SearchId: string = this.SearchId): Promise<void> {
        await this.updateOne(Collections.Search, { SearchId: SearchId }, { SearchStatus: SearchStatus.Stopped });
    }



    flush(): void {
        super.flush();
        this.setBlank();
    }



}

export default Search;