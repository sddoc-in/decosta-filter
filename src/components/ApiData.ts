import axios from "axios";

export async function DynamicApidata(params: any) {
    return await axios.get("http://64.23.216.88:8000/ads?page=1&querry=50%%20korting&filtterStart_date=2021-10-11%2012:30:00&filtterEnd_date=2024-02-25%2012:30:00&Nextforward_cursor=&Nextbackward_cursor=&Nextcollation_token=")
}