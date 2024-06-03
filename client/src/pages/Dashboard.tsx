import React from "react";
import InputName from "../components/input/InputName";
import { AppContext } from "../context/Context";
import InputSearch from "../components/input/InputSearch";
import { ADS_API_URL, API_URL } from "../constants/data";
import InputCountry from "../components/input/InputCountry";
import InputSelect from "../components/input/InputSelect";
import { Languages } from "../constants/Languages";
import InputMultiSelect from "../components/input/InputMultiSelect";
import { AdStatus } from "../constants/AdStatus";
import InputDate from "../components/input/InputDate";
import { MediaType } from "../constants/MediaType";
import axios from "axios";
import { PublisherPlatforms } from "../constants/PublisherPlatforms";

export default function Dashboard() {

  const { apiParams, setApiParams, user,setLoading } = React.useContext(AppContext);
  const [numberofAds, setNumberofAds] = React.useState<number>(0);

  function handleChange(type: string, value: string) {
    setApiParams((prev: any) => {
      return { ...prev, [type]: value };
    });
  }

  function handleMultiSelect(type: string, value: string) {
    setApiParams((prev: any) => {
      return { ...prev, [type]: value };
    });
  }

  async function getNumberofAds() {
    let param_Nextforward_cursor = apiParams.Nextforward_cursor;
    let param_Nextbackward_cursor = apiParams.Nextbackward_cursor;
    let param_Nextcollation_token = apiParams.Nextcollation_token;

    // conver the date to 2021-10-11 12:30:00 this similar format and removing T and msZ
    let param_startDate = apiParams.filtterStart_date
      .toISOString()
      .split("T")
      .join(" ")
      .split(".")[0];
    let param_endDate = apiParams.filtterEnd_date
      .toISOString()
      .split("T")
      .join(" ")
      .split(".")[0];

    try {
      if (apiParams.querry === "") {
        alert("Please enter a Product");
        return;
      }
      setLoading(true);
      let data = await fetch(
        ADS_API_URL +
          new URLSearchParams({
            country: apiParams.country,
            content_languages: apiParams.content_languages,
            filtterStart_date: param_startDate,
            filtterEnd_date: param_endDate,
            querry: apiParams.querry,
            ad_status_type: apiParams.ad_status_type,
            ad_type: apiParams.ad_type,
            media_type: apiParams.media_type,
            publisher_platforms: apiParams.publisher_platforms,
            reach: apiParams.reach,
            page: "1",
            Nextforward_cursor: param_Nextforward_cursor,
            Nextbackward_cursor: param_Nextbackward_cursor,
            Nextcollation_token: param_Nextcollation_token,
          }),
        {
          method: "GET",
          headers: {
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
          },
        }
      ).then((response) => response.json());

      setNumberofAds(data.pageData.totalAdcount);
    } catch (e) {
      console.log(e);
      alert("Something went wrong");
    }
    setLoading(false);
  }

  async function getQueryData() {
    try {
      setLoading(true);
      let data = await axios
        .post(API_URL + "/searches/store", {
          ...apiParams,
          publisher_platforms: apiParams.publisher_platforms.split(","),
          media_type: apiParams.media_type.split(","),
          content_languages: apiParams.content_languages.split(","),
          uid: user.uid,
          access_token: user.access_token,
          session: user.session,
        })
        .then((response) => response.data)
        .catch((err) => {
          alert(err.response.data.message);
          return;
        });
      if (data.message === "Search stored successfully") {
        const res = await axios
          .post(API_URL + "/searches/start", {
            searchId: data.searchId,
            uid: user.uid,
            access_token: user.access_token,
            session: user.session,
          })
          .then((response) => response.data)
          .catch((err) => {
            alert(err.response.data.message);
            return;
          });

        if (res.message === "Search started successfully") {
          alert("Search started successfully");
        } else {
          alert("Something went wrong");
        }
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      alert("Something went wrong");
    }
  }

  return (
    <>
      <h1 className="text-black font-bold text-[32px] mt-4 mb-5">
        Enter Your Query
      </h1>
      <div className="w-11/12 md:w-10/12 mx-auto flex-col flex justify-center items-center">
        <InputSearch
          defValue=""
          placeholder="Enter Query"
          name="querry"
          inputClassName={` w-[50%!important] mr-2`}
          onChangeHandler={(e) => {
            setApiParams((prev: any) => {
              return { ...prev, querry: e.target.value };
            });
          }}
          onClick={getNumberofAds}
        />
        <div className="flex justify-center items-center w-full">
          <InputCountry
            defValue=""
            placeholder="Select Country"
            name="country"
            onChange={handleChange}
            inputClassName={` w-[49%!important] mr-2`}
          />
          <InputMultiSelect
            defValue=""
            placeholder="Select language"
            name="content_languages"
            selectArray={Languages}
            inputClassName={` w-[49%!important]`}
            onChange={handleMultiSelect}
          />
        </div>
        <div className="flex justify-center items-center w-full">
          <InputMultiSelect
            defValue=""
            placeholder="Select Publisher Platforms"
            name="publisher_platforms"
            selectArray={PublisherPlatforms}
            inputClassName={` w-[32.3%!important] mr-2`}
            onChange={handleMultiSelect}
          />
          <InputMultiSelect
            defValue=""
            placeholder="Select Media Type"
            name="media_type"
            selectArray={MediaType}
            inputClassName={` w-[32.3%!important] mr-2`}
            onChange={handleMultiSelect}
          />
          <InputSelect
            defValue=""
            placeholder="Select Ad Status"
            name="ad_status_type"
            selectArray={AdStatus}
            inputClassName={` w-[32.3%!important]`}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-center items-center w-full">
          {/* <InputMultiSelect
            defValue=""
            placeholder="Select Call To Action"
            name="call_to_action"
            selectArray={CallToAction}
            inputClassName={` w-[30%!important] mr-2`}
            onChange={handleMultiSelect}
          />
          <InputName
            defValue=""
            placeholder="Reach"
            name="reach"
            inputClassName={` w-[30%!important] mr-2`}
            onChangeHandler={(e) => changeFilterParams("reach", e.target.value)}
          /> */}
          {/*
          <InputName
            defValue=""
            placeholder="Select Min/Max Shares"
            name="minMaxShares"
            inputClassName={` w-[30%!important] mr-2`}
            onChangeHandler={(e) =>
              changeFilterParams("minMaxShares", e.target.value)
            }
          />
          <InputName
            defValue=""
            placeholder="Select Min/Max Reach"
            name="minMaxReach"
            inputClassName={` w-[30%!important] mr-2`}
            onChangeHandler={(e) =>
              changeFilterParams("minMaxReach", e.target.value)
            }
          />
          <InputName
            defValue=""
            placeholder="Select Min/Max Comments"
            name="minMaxComments"
            inputClassName={` w-[30%!important] mr-2`}
            onChangeHandler={(e) =>
              changeFilterParams("minMaxComments", e.target.value)
            }
          /> */}
        </div>

        <div className="flex justify-center items-center w-full">
          <InputDate
            defValue=""
            placeholder="Start Date"
            label="Start Date"
            name="filtterStart_date"
            inputClassName={` w-[49%!important] mr-2`}
            onChangeHandler={(e: any) => {
              setApiParams((prev: any) => {
                return { ...prev, filtterStart_date: new Date(e.target.value) };
              });
            }}
          />
          <InputDate
            defValue=""
            placeholder="End Date"
            label="End Date"
            name="filtterEnd_date"
            inputClassName={` w-[49%!important]`}
            onChangeHandler={(e: any) => {
              setApiParams((prev: any) => {
                return { ...prev, filtterEnd_date: new Date(e.target.value) };
              });
            }}
          />
          {/* <InputNumber
            defValue=""
            placeholder="Enter Page Number"
            label="Min Days Active"
            name="query"
            inputClassName={` w-[30%!important] mr-2`}
            onChangeHandler={(e) => {
              setFilterParams((prev: any) => {
                return { ...prev, minDaysActive: e.target.value };
              });
            }}
          /> */}
        </div>
        <div className="flex justify-center items-end w-full">
          <InputName
            defValue={numberofAds.toString()}
            disabled={true}
            label="Results Found"
            placeholder="Enter Page Size"
            name="query"
            inputClassName={` w-[30%!important] mr-2`}
          />
          <button
            className="btn btn-primary btn-active-shadow capitalize px-3 py-3 h-[auto] w-[auto] min-h-[auto] mb-4"
            onClick={getQueryData}
          >
            Find results
          </button>
        </div>
      </div>
    </>
  );
}
