import React from "react";
import InputName from "../input/InputName";
import { AppContext } from "../../context/Context";
import InputSearch from "../input/InputSearch";
import { ADS_API_URL, API_URL } from "../../constants/data";
import InputCountry from "../input/InputCountry";
import InputSelect from "../input/InputSelect";
import { Languages } from "../../constants/Languages";
import InputMultiSelect from "../input/InputMultiSelect";
import { AdStatus } from "../../constants/AdStatus";
import InputDate from "../input/InputDate";
import { MediaType } from "../../constants/MediaType";
import axios from "axios";
import { PublisherPlatforms } from "../../constants/PublisherPlatforms";
import { useParams } from "react-router-dom";

export default function NewSearch() {
  const { apiParams, setApiParams, user, setLoading } =
    React.useContext(AppContext);
  const { Id } = useParams();
  const [numberofAds, setNumberofAds] = React.useState<number>(0);
  const [searchId, setSearchId] = React.useState<string>("");

  function handleChange(type: string, value: string) {
    setSearchId("");
    setApiParams((prev: any) => {
      return { ...prev, [type]: value };
    });
  }

  const getDetails = React.useRef(() => {});

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
            alert(err.response.data.message);
            return;
          });

        if (data.message === "Search stored successfully") {
          setSearchId(data.searchId);
          const res = await axios
            .get(ADS_API_URL + "total?SearchID=" + data.searchId)
            .then((response) => response.data)
            .catch((err) => {
              alert(err.response.data.message);
              return;
            });
          setNumberofAds(res.total);
        }
      } else {
        const res = await axios
          .get(ADS_API_URL + "total?SearchID=" + searchId)
          .then((response) => response.data)
          .catch((err) => {
            alert(err.response.data.message);
            return;
          });
        setNumberofAds(res.total);
      }
    } catch (e) {
      console.log(e);
      alert("Something went wrong");
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
          alert(err.response.data.message);
          return;
        });

      if (res.message === "Search started successfully") {
        alert("Search started successfully");
      } else {
        alert("Something went wrong");
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
        <div className="flex justify-center items-center w-full">
          <InputSearch
            defValue={apiParams.querry || ""}
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
          <InputName
            defValue={apiParams.name || ""}
            placeholder="Enter Name"
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
            defValue={apiParams.country || ""}
            placeholder="Select Country"
            name="country"
            onChange={handleChange}
            inputClassName={` w-[49%!important] mr-2`}
          />
          <InputMultiSelect
            defValue={apiParams.content_languages || ""}
            placeholder="Select language"
            name="content_languages"
            selectArray={Languages}
            inputClassName={` w-[49%!important]`}
            onChange={handleMultiSelect}
          />
        </div>
        <div className="flex justify-center items-center w-full">
          <InputMultiSelect
            defValue={apiParams.publisher_platforms || ""}
            placeholder="Select Publisher Platforms"
            name="publisher_platforms"
            selectArray={PublisherPlatforms}
            inputClassName={` w-[32.3%!important] mr-2`}
            onChange={handleMultiSelect}
          />
          <InputMultiSelect
            defValue={apiParams.media_type || ""}
            placeholder="Select Media Type"
            name="media_type"
            selectArray={MediaType}
            inputClassName={` w-[32.3%!important] mr-2`}
            onChange={handleMultiSelect}
          />
          <InputSelect
            defValue={apiParams.ad_status_type || ""}
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
            defValue={apiParams.filtterStart_date || ""}
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
            defValue={apiParams.filtterEnd_date || ""}
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
            defValue={numberofAds}
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
