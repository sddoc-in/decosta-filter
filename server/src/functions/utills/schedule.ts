import axios from "axios";
import SearchStatus from "../../config/SearchStatus";
import { closeConn } from "../../connection/closeConn";
import connectToCluster from "../../connection/connect";
import store from "./store";
import schedule from 'node-schedule';
import { MongoClient } from "mongodb";



export default async function scheduleSearch(rule: any, recurId: string, searchData: any) {
    const job = schedule.scheduleJob(rule, async () => {

        const conn2 = await connectToCluster();
        if (typeof conn2.conn === "string") {
            return;
        }
        const db2 = conn2.conn.db("Master");
        const searchCol2 = db2.collection("search");
        const recurrenceCol2 = db2.collection("recurrence");


        let search = await recurrenceCol2.findOne({ scheduleId: recurId });

        if (!search) {
            return;
        }
        if (search?.currentStatus === SearchStatus.Stopped) {
            return;
        }

        let searchDetails = {
            name: searchData.name,
            country: searchData.country,
            content_languages: searchData.content_languages,
            filtterStart_date: searchData.filtterStart_date,
            filtterEnd_date: new Date(),
            querry: searchData.querry,
            ad_status_type: searchData.ad_status_type,
            reach: searchData.reach,
            ad_type: searchData.ad_type,
            media_type: searchData.media_type,
            publisher_platforms: searchData.publisher_platforms,
            Nextforward_cursor: searchData.Nextforward_cursor,
            Nextbackward_cursor: searchData.Nextbackward_cursor,
            Nextcollation_token: searchData.Nextcollation_token,
            uid: searchData.uid,
            access_token: searchData.access_token,
            session: searchData.session,
            page: searchData.page,
        }
        let res2 = await store(searchDetails);

        console.log(res2);

        if (typeof res2 === "string") {
            return
        }

        // call start search function
        let searchId = res2.searchId;
        await searchCol2.updateOne({
            searchId: searchId
        }, {
            $set: {
                currentStatus: SearchStatus.InProgress
            }
        });
        closeConn(conn2.conn as MongoClient);


        await axios.get(process.env.AUTOMATION_URL + "ads?SearchID=" + searchId)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    });

}