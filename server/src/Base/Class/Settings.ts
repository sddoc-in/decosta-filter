import Collections from "../Config/collections";
import ResStatus from "../Config/response/ResStatus";
import SettingsMessages from "../Config/response/Settings";
import SettingsClassInterface, { SettingsInterface } from "../Interface/Settings";
import ResponseClass from "./Response";
import Start from "./Start";


class Settings extends Start implements SettingsClassInterface {
    MaxExtractionPerDay: number = 0;
    MaxExtractionPerMonth: number = 0;
    MaxSearchPerDay: number = 0;
    MaxSearchPerMonth: number = 0;
    HiddenResultsColumns: string = '';
    RecId: number = 0;
    UserId: string = '';
    CreatedBy: string = '';
    CreatedDateTime?: string = '';
    ModifiedBy: string = '';
    ModifiedDateTime?: string = '';

    constructor(settings?: SettingsInterface) {
        super();
        if (settings) {
            this.setSettings(settings);
        }
        else {
            this.setBlankSettings();
        }

    }

    setSettings(settings: SettingsInterface): void {
        this.MaxExtractionPerDay = settings.MaxExtractionPerDay || 0;
        this.MaxExtractionPerMonth = settings.MaxExtractionPerMonth || 0;
        this.MaxSearchPerDay = settings.MaxSearchPerDay || 0;
        this.MaxSearchPerMonth = settings.MaxSearchPerMonth || 0;
        this.HiddenResultsColumns = settings.HiddenResultsColumns || '';
        this.RecId = settings.RecId || 0;
        this.UserId = settings.UserId || "";
        this.CreatedBy = settings.CreatedBy || "";
        this.CreatedDateTime = settings.CreatedDateTime || '';
        this.ModifiedBy = settings.ModifiedBy || "";
        this.ModifiedDateTime = settings.ModifiedDateTime || '';
    }

    setBlankSettings(): void {
        this.MaxExtractionPerDay = 0;
        this.MaxExtractionPerMonth = 0;
        this.MaxSearchPerDay = 0;
        this.MaxSearchPerMonth = 0;
        this.HiddenResultsColumns = '';
        this.RecId = 0;
        this.UserId = "";
        this.CreatedBy = "";
        this.ModifiedBy = "";
    }

    get(): SettingsInterface {
        return {
            MaxExtractionPerDay: this.MaxExtractionPerDay,
            MaxExtractionPerMonth: this.MaxExtractionPerMonth,
            MaxSearchPerDay: this.MaxSearchPerDay,
            MaxSearchPerMonth: this.MaxSearchPerMonth,
            HiddenResultsColumns: this.HiddenResultsColumns,
            UserId: this.UserId,
            CreatedBy: this.CreatedBy,
            CreatedDateTime: this.CreatedDateTime,
            ModifiedBy: this.ModifiedBy,
            ModifiedDateTime: this.ModifiedDateTime
        }
    }

    paramMaxExtractionPerDay(MaxExtractionPerDay: number = this.MaxExtractionPerDay): number {
        return this.MaxExtractionPerDay = MaxExtractionPerDay;
    }

    paramMaxExtractionPerMonth(MaxExtractionPerMonth: number = this.MaxExtractionPerMonth): number {
        return this.MaxExtractionPerMonth = MaxExtractionPerMonth;
    }

    paramMaxSearchPerDay(MaxSearchPerDay: number = this.MaxSearchPerDay): number {
        return this.MaxSearchPerDay = MaxSearchPerDay;
    }

    paramMaxSearchPerMonth(MaxSearchPerMonth: number = this.MaxSearchPerMonth): number {
        return this.MaxSearchPerMonth = MaxSearchPerMonth;
    }

    paramHiddenResultsColumns(HiddenResultsColumns: string = this.HiddenResultsColumns): string {
        return this.HiddenResultsColumns = HiddenResultsColumns;
    }

    paramRecId(RecId: number = this.RecId): number {
        return this.RecId = RecId;
    }

    paramUserId(UserId: string = this.UserId): string {
        return this.UserId = UserId;
    }

    paramCreatedBy(CreatedBy: string = this.CreatedBy): string {
        return this.CreatedBy = CreatedBy;
    }

    paramCreatedDateTime(CreatedDateTime: string = this.CreatedDateTime || ""): string {
        return this.CreatedDateTime = CreatedDateTime;
    }

    paramModifiedBy(ModifiedBy: string = this.ModifiedBy): string {
        return this.ModifiedBy = ModifiedBy;
    }

    paramModifiedDateTime(ModifiedDateTime: string = this.ModifiedDateTime || ""): string {
        return this.ModifiedDateTime = ModifiedDateTime;
    }

    modified() {
        this.ModifiedDateTime = this.getDateTime();
    }

    async getSettings(UserId: string = this.UserId, RecId: number = this.RecId): Promise<SettingsInterface> {
        let settings = await this.getOne(Collections.Settings, { UserId: UserId, RecId: RecId }, "OR");
        if (settings && settings.RecId) {
            return settings;
        }
        throw new ResponseClass(ResStatus.BadRequest, SettingsMessages.SettingsNotFound);
    }

    async checkExists(UserId: string = this.UserId, RecId: number = this.RecId): Promise<void> {
        let settings = await this.getOne(Collections.Settings, { UserId: UserId, RecId: RecId }, "OR");
        if (settings && settings.RecId) {
            return;
        }
        throw new ResponseClass(ResStatus.BadRequest, SettingsMessages.SettingsNotFound);
    }

    async checkNotExists(UserId: string = this.UserId, RecId: number = this.RecId): Promise<void> {
        let settings = await this.getOne(Collections.Settings, { UserId: UserId, RecId: RecId }, "OR");
        if (settings && settings.RecId) {
            throw new ResponseClass(ResStatus.BadRequest, SettingsMessages.SettingsAlreadyExist);
        }
        return;
    }

    async createSettings(): Promise<void> {
        this.modified();
        this.CreatedDateTime = this.ModifiedDateTime
        this.RecId = (await this.insertOneWithOutput(Collections.Settings, this.get(), ["RecId"])).RecId;
    }

    async updateSettings(): Promise<void> {
        this.modified();
        await this.updateOne(Collections.Settings, this.get(), { RecId: this.RecId });
    }

    async deleteSettings(UserId: string = this.UserId, RecId: number = this.RecId): Promise<void> {
        await this.deleteOne(Collections.Settings, { UserId: UserId, RecId: RecId }, "OR");
    }


    flush(): void {
        super.flush();
        this.setBlankSettings();
    }
}

export default Settings;