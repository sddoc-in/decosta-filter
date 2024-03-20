import React from "react";
import { ExcelContext } from "../context/ExcelContext";
import { MainContext } from "../context/Context";
import { BASE_API_URL } from "../constant/data";
import InputCountry from "../components/InputCountry";
export default function FileTaker() {
  const { setHeader, setFileData, fileChoser, fileData } =
    React.useContext(ExcelContext);

  const {
    setLoading,
    setState,
    setCurrentProduct,
    currentProduct,
    currentPage,
    setCurrentPage,
    oppositeObj,
    setCurrentRequest,
    endDate,
    startDate,
    setEndDate,
    setStartDate,
    params,
    setParams,
    selectedCountry,
    setSelectedCountry,
    setDupes,
    dupes,
  } = React.useContext(MainContext);

  const getQueryData = React.useRef(() => {});

  function handleChange(type: string, value: string) {
    setSelectedCountry(value);
  }

  getQueryData.current = async () => {
    let param_Nextforward_cursor = params.Nextforward_cursor;
    let param_Nextbackward_cursor = params.Nextbackward_cursor;
    let param_Nextcollation_token = params.Nextcollation_token;

    let Duplicate = dupes;

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

      let i = 0;
      setLoading(true);
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

        if (data.results.length === 0) {
          alert("No Data Found");
          return;
        }

        param_Nextbackward_cursor = data.pageData.backward_cursor;
        param_Nextforward_cursor = data.pageData.forward_cursor;
        param_Nextcollation_token = data.pageData.collation_token;

        setParams({
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
  };

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

  return (
    <>
      <div className="w-11/12 md:w-10/12 mx-auto flex-col flex justify-center items-center">
        <div className="flex justify-center items-center w-full">
          <InputCountry
            defValue=""
            placeholder="Select Country"
            name="country"
            onChange={handleChange}
            inputClassName={` w-[25%!important] mr-2`}
          />
          <input
            type="text"
            className={`file-input my-3 file-input-bordered file-input-secondary shadow-lg w-full max-w-xs text-white pl-3 ${oppositeObj}`}
            placeholder="Enter Query"
            onChange={(e) => setCurrentProduct(e.target.value)}
          />
        </div>

        <div className="flex justify-center items-center">
          <div className="w-[48%] mx-2">
            <label htmlFor="">Start Date</label>
            <input
              type="date"
              placeholder="Start Date"
              defaultValue={startDate.toISOString().split("T")[0]}
              className={`file-input my-3 file-input-bordered file-input-secondary shadow-lg w-full max-w-xs text-white pl-3 ${oppositeObj}`}
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </div>
          <div className="w-[48%] mx-2">
            <label htmlFor="">End Date</label>
            <input
              type="date"
              placeholder="End Date"
              defaultValue={endDate.toISOString().split("T")[0]}
              className={`file-input my-3 file-input-bordered file-input-secondary shadow-lg w-full max-w-xs text-white pl-3 ${oppositeObj}`}
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
          </div>
        </div>

        <div className="flex justify-center items-center">
          <button
            className="btn btn-primary btn-active-shadow my-1 px-3 py-2 h-[auto] w-[auto] min-h-[auto] min-w-[auto"
            onClick={getQueryData.current}
          >
            Search
          </button>
        </div>

        <div className="divider w-full">OR</div>
        <input
          type="file"
          className={`file-input my-3 file-input-bordered file-input-secondary shadow-lg w-full max-w-xs text-white ${oppositeObj}`}
          onChange={(e) => getFile(e)}
        />
      </div>
    </>
  );
}
