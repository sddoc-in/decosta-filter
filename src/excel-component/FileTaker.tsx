import React from "react";
import { ExcelContext } from "../context/ExcelContext";
import { MainContext } from "../context/Context";
import { BASE_API_URL } from "../constant/data";
import InputCountry from "../components/InputCountry";
import InputName from "../components/InputName";
import InputSearch from "../components/InputSearch";
import InputSelect from "../components/InputSelect";
import { Languages } from "../constant/Languages";
import { CallToAction } from "../constant/CallToAction";
import { AdType } from "../constant/AdType";
import { AdStatus } from "../constant/AdStatus";
import InputNumber from "../components/InputNumber";
import InputDate from "../components/InputDate";
import Loader from "../components/Loader";
import { MediaType } from "../constant/MediaType";
import { PublisherPlatforms } from "../constant/PublisherPlatforms";
import InputMultiSelect from "../components/InputMultiSelect";
export default function FileTaker() {
  const { setHeader, setFileData, fileChoser, fileData } =
    React.useContext(ExcelContext);

  const {
    setLoading,
    loading,
    setState,
    setCurrentProduct,
    currentProduct,
    currentPage,
    setCurrentPage,
    oppositeObj,
    setCurrentRequest,
    setDupes,
    dupes,
    apiParams,
    setApiParams,
    loopBreaker,
    setFilterParams,
  } = React.useContext(MainContext);

  const [numberofAds, setNumberofAds] = React.useState<number>(0);
  const [adsFetched, setAdsFetched] = React.useState<number>(0);

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

  async function getQueryData() {
    let currentAds = 0;

    let param_Nextforward_cursor = apiParams.Nextforward_cursor;
    let param_Nextbackward_cursor = apiParams.Nextbackward_cursor;
    let param_Nextcollation_token = apiParams.Nextcollation_token;

    let Duplicate = dupes;

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
      if (!currentProduct) {
        alert("Enter Query to search");
        return;
      }
      let temp: any = [];
      let header: any = [];
      if (fileData.length > 0) {
        temp = fileData;
      }

      if (numberofAds === 0) {
        alert("No Ads Found");
        return;
      }

      let i = 0;
      setLoading(true);
      // while (i < 1) {
      while (currentAds < numberofAds) {
        if (loopBreaker) {
          console.log("Break");
          break;
        }
        let response = await fetch(
          BASE_API_URL +
            new URLSearchParams({
              country: apiParams.country,
              content_languages: apiParams.content_languages,
              filtterStart_date: param_startDate,
              filtterEnd_date: param_endDate,
              querry: currentProduct,
              ad_status_type: apiParams.ad_status_type,
              ad_type: apiParams.ad_type,
              media_type: apiParams.media_type,
              publisher_platforms: apiParams.publisher_platforms,
              page: (currentPage + i).toString(),
              reach: apiParams.reach,
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
        );
        let data = await response.json();

        if (data.results.length === 0) {
          alert("No Data Found");
          return;
        }

        param_Nextbackward_cursor = data.pageData.backward_cursor;
        param_Nextforward_cursor = data.pageData.forward_cursor;
        param_Nextcollation_token = data.pageData.collation_token;

        setApiParams({
          ...apiParams,
          Nextbackward_cursor: param_Nextbackward_cursor,
          Nextforward_cursor: param_Nextforward_cursor,
          Nextcollation_token: param_Nextcollation_token,
        });

        if (data.length !== 0) {
          if (i === 0) {
            const headerVal = data.results;
            header = Object.keys(headerVal[0]);
            header.push("Duplicate");
          }
          for (let j = 0; j < data.results.length; j++) {
            let tempObj: any = Object.values(data.results[j]);

            if (Duplicate.includes(tempObj[6])) {
              tempObj.push("Yes");
            } else {
              tempObj.push("No");
              Duplicate.push(tempObj[6]);
            }
            temp.push(tempObj);
            setCurrentRequest((prev) => prev + 1);
          }
        }
        currentAds += data.results.length;
        setAdsFetched(currentAds);
        i++;
      }
      setHeader(header);
      setFileData(temp);
      setDupes(Duplicate);
      setCurrentPage(currentPage + 3);
      setState(1);
    } catch (e) {
      console.log(e);
      alert("Something went wrong");
    }
    setLoading(false);
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
      if (!currentProduct) {
        alert("Enter Query to search");
        return;
      }
      setLoading(true);
      let data = await fetch(
        BASE_API_URL +
          new URLSearchParams({
            country: apiParams.country,
            content_languages: apiParams.content_languages,
            filtterStart_date: param_startDate,
            filtterEnd_date: param_endDate,
            querry: currentProduct,
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

  function checkFileTypes(file: string) {
    const types = [
      "application/vnd.ms-excel",
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel.sheet.macroEnabled.12",
      "application/vnd.oasis.opendocument.spreadsheet",
      "application/vnd.oasis.opendocument.spreadsheet-template",
      "application/vnd.ms-excel.template.macroEnabled.12",
      "application/vnd.ms-excel.addin.macroEnabled.12",
      "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
    ];
    if (types.includes(file)) {
      return true;
    }
  }
  function getFile(e: any) {
    const file = e.target.files[0];
    if (!checkFileTypes(file.type)) {
      alert("Only Excel and csv files are allowed");
      return;
    }
    fileChoser(file);
  }

  function changeFilterParams(type: string, value: string) {
    setFilterParams((prev: any) => {
      return { ...prev, [type]: value.split("-") };
    });
  }

  return (
    <>
      <div className="w-11/12 md:w-10/12 mx-auto flex-col flex justify-center items-center">
        <div className="flex justify-center items-center w-full">
          <InputSearch
            defValue=""
            placeholder="Enter Query"
            name="querry"
            inputClassName={` w-[50%!important] mr-2`}
            onChangeHandler={(e) => {
              setCurrentProduct(e.target.value);
              setApiParams((prev: any) => {
                return { ...prev, querry: e.target.value };
              });
            }}
            onClickSearch={getNumberofAds}
          />
          <InputCountry
            defValue=""
            placeholder="Select Country"
            name="country"
            onChange={handleChange}
            inputClassName={` w-[25%!important] mr-2`}
          />
          <button
            className="btn btn-primary btn-active-shadow capitalize px-3 py-3 h-[auto] w-[auto] min-h-[auto] "
            onClick={getQueryData}
          >
            View results
          </button>
        </div>
        <div className="flex justify-center items-center w-full">
          <InputSelect
            defValue=""
            placeholder="Select language"
            name="content_languages"
            selectArray={Languages}
            inputClassName={` w-[30%!important] mr-2`}
            onChange={handleChange}
          />
          <InputSelect
            defValue=""
            placeholder="Select Publisher Platforms"
            name="publisher_platforms"
            selectArray={PublisherPlatforms}
            inputClassName={` w-[30%!important] mr-2`}
            onChange={handleChange}
          />
          <InputMultiSelect
            defValue=""
            placeholder="Select Media Type"
            name="media_type"
            selectArray={MediaType}
            inputClassName={` w-[30%!important] mr-2`}
            onChange={handleMultiSelect}
          />
          <InputSelect
            defValue=""
            placeholder="Select Ad Status"
            name="ad_status_type"
            selectArray={AdStatus}
            inputClassName={` w-[30%!important] mr-2`}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-center items-center w-full">
          <InputMultiSelect
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
            onChangeHandler={(e) =>
              changeFilterParams("reach", e.target.value)
            }
          />
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
            inputClassName={` w-[30%!important] mr-2`}
            onChangeHandler={(e) => {
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
            inputClassName={` w-[30%!important] mr-2`}
            onChangeHandler={(e) => {
              setApiParams((prev: any) => {
                return { ...prev, filtterEnd_date: new Date(e.target.value) };
              });
            }}
          />
          <InputNumber
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
          />
          <InputName
            defValue={numberofAds.toString()}
            disabled={true}
            label="Results Found"
            placeholder="Enter Page Size"
            name="query"
            inputClassName={` w-[30%!important] mr-2`}
          />
        </div>

        <div className="divider w-full">OR</div>
        <input
          type="file"
          className={`file-input my-3 file-input-bordered file-input-secondary shadow-lg w-full max-w-xs text-white ${oppositeObj}`}
          onChange={(e) => getFile(e)}
        />
      </div>
      {loading && <Loader adsFetched={adsFetched} />}
    </>
  );
}
