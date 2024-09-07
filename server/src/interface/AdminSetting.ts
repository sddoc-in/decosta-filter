


export default interface AdminSetting {
    DailySearches: number;
    DailyResults: number;
    SearchPerUser: number;
    ResultsPerSearch: number;
}

export const AdminSettingDefault: AdminSetting = {
    DailySearches: 0,
    DailyResults: 0,
    SearchPerUser: 0,
    ResultsPerSearch: 0,
}