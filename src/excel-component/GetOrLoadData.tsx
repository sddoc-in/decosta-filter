import React from "react";
import { MainContext } from "../context/Context";
import { ExcelContext } from "../context/ExcelContext";

import { BASE_API_URL } from "../constant/data";

export default function GetOrLoadData() {
  const {
    selectedCountry,
    currentPage,
    setCurrentPage,
    setLoading,
    currentProduct,
    setCurrentRequest,
    endDate,
    startDate,
    params,
    setParams,
    dupes,
    setDupes,
  } = React.useContext(MainContext);
  const { fileData, setFileData } = React.useContext(ExcelContext);

  async function loadMoreData() {
    let param_Nextforward_cursor = params.Nextforward_cursor;
    let param_Nextbackward_cursor = params.Nextbackward_cursor;
    let param_Nextcollation_token = params.Nextcollation_token;

    // conver the date to 2021-10-11 12:30:00 this similar format and removing T and msZ
    let param_startDate = startDate
      .toISOString()
      .split("T")
      .join(" ")
      .split(".")[0];
    let param_endDate = endDate
      .toISOString()
      .split("T")
      .join(" ")
      .split(".")[0];

    let Duplicate = dupes;

    let temp: any = [];
    if (fileData.length > 0) {
      temp = fileData;
    }

    let i = 0;
    // setMaxState(27);
    setLoading(true);
    try {
      for (i = 0; i < 3; i++) {
        let response = await fetch(
          BASE_API_URL +
            new URLSearchParams({
              country: selectedCountry,
              page: (currentPage + i).toString(),
              querry: currentProduct,
              filtterStart_date: param_startDate,
              filtterEnd_date: param_endDate,
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
        param_Nextbackward_cursor = data.pageData.backward_cursor;
        param_Nextforward_cursor = data.pageData.forward_cursor;
        param_Nextcollation_token = data.pageData.collation_token;

        setParams({
          Nextbackward_cursor: param_Nextbackward_cursor,
          Nextforward_cursor: param_Nextforward_cursor,
          Nextcollation_token: param_Nextcollation_token,
        });

        if (data.length !== 0) {
          for (let j = 0; j < data.results.length; j++) {
            let tempObj: any = Object.values(data.results[j]);

            if (Duplicate.includes(tempObj[6])) {
              tempObj.push("Yes");
            }
            else {
              Duplicate.push(tempObj[6]);
              tempObj.push("No");
            }
            temp.push(tempObj);
            setCurrentRequest((prev) => prev + 1);
          }
        }
      }

      setFileData(temp);
      setDupes(Duplicate);
      setCurrentPage(currentPage + 3);
    } catch (e) {
      console.log(e);
      alert("Something went wrong");
    }
    setLoading(false);
  }

  return (
    <div className="flex justify-center items-center flex-col my-4">
      <div className="flex justify-center items-center">
        <button
          className="btn btn-primary btn-active-shadow my-1 px-3 py-2 h-[auto] w-[auto] min-h-[auto] min-w-[auto"
          onClick={loadMoreData}
        >
          Load More Pages
        </button>
      </div>
    </div>
  );
}
