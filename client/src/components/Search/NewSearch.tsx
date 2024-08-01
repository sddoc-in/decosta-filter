import React from "react";
import InputName from "../input/InputName";
import { AppContext } from "../../context/Context";
import InputSearch from "../input/InputSearch";
import { ADS_API_URL, API_URL } from "../../constants/data";
import InputCountry from "../input/InputCountry";
import { Languages } from "../../constants/Languages";
import InputMultiSelect from "../input/InputMultiSelect";
import { AdStatus } from "../../constants/AdStatus";
import { MediaType } from "../../constants/MediaType";
import axios from "axios";
import { useParams } from "react-router-dom";
import Recurrence from "../../constants/Recurrence";
import ScheduleDialog from "./ScheduleDialog";
import APIParams from "../../constants/SearchParams";
import InputSelect from "../input/InputSelect";
import FormInput from "../input/FormInput";

export default function NewSearch() {
  const { apiParams, setApiParams, user, setLoading, raiseToast } =
    React.useContext(AppContext);
  const { Id } = useParams();
  const [numberofAds, setNumberofAds] = React.useState<number>(0);
  const [searchId, setSearchId] = React.useState<string>("");
  const [Schedule, setSchedule] = React.useState<any>({
    open: false,
    date: "",
    time: "",
    recurrence: Recurrence.NONE,
  });

  function handleChange(type: string, value: string) {
    setSearchId("");
    setApiParams((prev: any) => {
      return { ...prev, [type]: value };
    });
  }

  const getDetails = React.useRef(() => { });

  getDetails.current = async () => {
    setLoading(true);
    try {
      let params = new URLSearchParams({
        session: user.session,
        uid: user.uid,
        access_token: user.access_token,
        searchId: Id as string,
      });

      const response = await axios
        .get(API_URL + "/searches?" + params)
        .then((response) => response.data)
        .catch((err) => {
          alert(err.response.data.message);
          return;
        });
      const searchData = response.search;
      if (searchData) {
        setApiParams({
          country: searchData.country,
          content_languages: searchData.content_languages.join(","),
          querry: searchData.querry,
          reach: searchData.reach,
          publisher_platforms: searchData.publisher_platforms.join(","),
          ad_type: searchData.ad_type,
          ad_status_type: searchData.ad_status_type,
          media_type: searchData.media_type.join(","),
          filtterStart_date: searchData.filtterStart_date.slice(0, 10),
          filtterEnd_date: searchData.filtterEnd_date.slice(0, 10),
        });
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (Id) {
      setSearchId(Id);
      getDetails.current();
    }
  }, [Id]);

  function handleMultiSelect(type: string, value: string) {
    setSearchId("");
    setApiParams((prev: any) => {
      return { ...prev, [type]: value };
    });
  }

  async function getNumberofAds() {
    try {
      if (apiParams.querry === "") {
        alert("Please enter a Product");
        return;
      }
      if (apiParams.name === "") {
        alert("Please enter a Name to your search");
        return;
      }
      let data;
      setLoading(true);
      if (!searchId) {
        data = await axios
          .post(API_URL + "/searches/store", {
            ...apiParams,
            publisher_platforms: apiParams.publisher_platforms.split(","),
            content_languages: apiParams.content_languages.split(","),
            media_type: apiParams.media_type.split(","),
            uid: user.uid,
            access_token: user.access_token,
            session: user.session,
          })
          .then((response) => response.data)
          .catch((err) => {
            raiseToast(err.response.data.message, "error");
            return;
          });

        if (data.message === "Search stored successfully") {
          setSearchId(data.searchId);
          const res = await axios
            .get(ADS_API_URL + "total?SearchID=" + data.searchId)
            .then((response) => response.data)
            .catch((err) => {
              raiseToast(err.response.data.message, "error");
              return;
            });
          setNumberofAds(res.total);
        }
      } else {
        const res = await axios
          .get(ADS_API_URL + "total?SearchID=" + searchId)
          .then((response) => response.data)
          .catch((err) => {
            raiseToast(err.response.error, "error")
            return;
          });
        setNumberofAds(res.total);
      }
    } catch (e) {
      console.log(e);
      raiseToast("Something went wrong", "error")
    }
    setLoading(false);
  }

  async function getQueryData() {
    try {
      setLoading(true);
      const res = await axios
        .post(API_URL + "/searches/start", {
          searchId: searchId,
          uid: user.uid,
          access_token: user.access_token,
          session: user.session,
        })
        .then((response) => response.data)
        .catch((err) => {
          raiseToast(err.response.data.message, "error")
          return;
        });

      if (res.message === "Search started successfully") {
        raiseToast("Search started successfully", "success");
        setApiParams(APIParams)
      } else {
        raiseToast("Something went wrong", "error");
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      raiseToast("Something went wrong", "error")
    }
  }

  async function ScheduleSearch() {
    try {
      if (Schedule.date === "" || Schedule.time === "") {
        raiseToast("Please select Date and Time", "error")
        return;
      }

      setLoading(true);
      const res = await axios
        .post(API_URL + "/searches/schedule", {
          ...apiParams,
          publisher_platforms: apiParams.publisher_platforms.split(","),
          content_languages: apiParams.content_languages.split(","),
          media_type: apiParams.media_type.split(","),
          uid: user.uid,
          access_token: user.access_token,
          session: user.session,
          recurrence: Schedule.recurrence,
          time: new Date(Schedule.date + " " + Schedule.time).getTime(),

        })
        .then((response) => response.data)
        .catch((err) => {
          raiseToast(err.response.data.message, "error")
          return;
        });

      if (res.message === "Job scheduled successfully") {
        raiseToast("Search scheduled successfully", "success");
        setSchedule({ ...Schedule, open: false });
      } else {
        raiseToast("Something went wrong", "error");
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      raiseToast("Something went wrong", "error")
    }
  }

  return (
    <>
      <h1 className="text-black font-bold text-[32px] mt-4 mb-5">
        Enter Your Query
      </h1>
      <div className="w-11/12 md:w-10/12 mx-auto flex-col flex justify-center items-center">
        <div className="flex justify-center items-center w-full">
          <InputSearch
            defValue={apiParams.querry || ""}
            placeholder="Search Query"
            name="querry"
            inputClassName={` w-[50%!important] mr-2`}
            onChangeHandler={(e) => {
              setApiParams((prev: any) => {
                return { ...prev, querry: e.target.value };
              });
            }}
            onClick={getNumberofAds}
          />
          <InputName
            defValue={apiParams.name || ""}
            placeholder="Save search as"
            name="name"
            inputClassName={` w-[50%!important] mr-2`}
            onChangeHandler={(e) => {
              setApiParams((prev: any) => {
                return { ...prev, name: e.target.value };
              });
            }}
          />
        </div>
        <div className="flex justify-center items-center w-full">
          <InputCountry
            defaultValue={apiParams.country || ""}
            placeholder="Select Country"
            name="country"
            handleChange={handleChange}
            label="Country"
            className="w-[49%!important] mr-2"
          />
          <InputSelect
            defaultValue={apiParams.content_languages || ""}
            placeholder="Select language"
            name="content_languages"
            selectArray={Languages}
            handleChange={handleChange}
            label="Content Language"
            className="w-[49%!important] mr-2"
          />
        </div>
        <div className="flex justify-center items-center w-full">
          <InputMultiSelect
            defaultValue={apiParams.media_type || ""}
            label="Media Type"
            placeholder="Select Media Type"
            name="media_type"
            selectArray={MediaType}
            className={` w-[49%!important] mr-2`}
            handleChange={handleMultiSelect}
          />
          <InputSelect
            defaultValue={apiParams.ad_status_type || ""}
            placeholder="Select Ad Status"
            label="Ad Status"
            name="ad_status_type"
            selectArray={AdStatus}
            handleChange={handleChange}
            className="w-[49%!important] mr-2"
          />
          <FormInput
            defaultValue={numberofAds.toString()}
            isDisabled={true}
            label="Results Found"
            placeholder="Enter Page Size"
            name="query"
            className={` w-[30%!important] mr-2`}
          />
        </div>


        <div className="flex justify-center items-end w-full">

          <button
            className="btn btn-primary btn-active-shadow capitalize px-3 py-3 h-[auto] w-[auto] min-h-[auto] mb-4 mx-2 my-1"
            onClick={getQueryData}
          >
            Fetch Results
          </button>


          <button
            className="btn btn-primary btn-active-shadow capitalize px-3 py-3 h-[auto] w-[auto] min-h-[auto] mb-4 mx-2 my-1"
            onClick={() => setSchedule({ ...Schedule, open: true })}
          >
            Schedule
          </button>

        </div>
      </div>
      <ScheduleDialog
        open={Schedule.open}
        setOpen={setSchedule}
        date={Schedule.date}
        time={Schedule.time}
        recurrence={Schedule.recurrence}
        onMethod={ScheduleSearch}
      />
    </>
  );
}
