import React from "react";
import {  PRICE, RATING, TOTAL_REVIEW } from "../constants/data";
import { ExcelContext } from "../context/ExcelContext";
import ExcelComponent from "../excel-component/ExcelComponent";
import { BsFiletypeCsv } from "react-icons/bs";
import { AiOutlineFileExcel } from "react-icons/ai";
import { Stack } from "@chakra-ui/react";
import InputSelect from "../components/input/InputSelect";
import InputNumber from "../components/input/InputNumber";

export default function Results() {
  const {
    header,
    setColumnsHidden,
    columnsHidden,
    fileData,
    clearAll,
    downloadAsCsv,
    downloadAsExcel,
    setReachRange,
    setFileData,
    setLikesRange,
    likesRange,
    reachRange
  } = React.useContext(ExcelContext);

  const [filterIndex, setFilterIndex] = React.useState(0);


  function hideUnhideColumns(index: number) {
    if (header.length === 0) return;
    let columns = [...columnsHidden];
    if (columns.includes(index)) {
      columns = columns.filter((item) => item !== index);
    } else {
      columns.push(index);
    }
    setColumnsHidden(columns);
  }

  function filterData(filterType: string) {
    let newData = [...fileData];
    // sorting array of arrays
    if (filterType === "Ascending") {
      newData.sort(function (a: any, b: any) {
        if (filterIndex === RATING || filterIndex === PRICE || filterIndex === TOTAL_REVIEW) {
          const priceA = parseFloat(a[filterIndex]);
          const priceB = parseFloat(b[filterIndex]);
          return priceA - priceB;
        } else {
          const priceA = a[filterIndex].toLowerCase();
          const priceB = b[filterIndex].toLowerCase();
          return priceA.localeCompare(priceB);
        }
      });
    }
    if (filterType === "Descending") {
      newData.sort(function (a: any, b: any) {
        if (filterIndex === RATING || filterIndex === PRICE || filterIndex === TOTAL_REVIEW) {
          const priceA = parseFloat(a[filterIndex]);
          const priceB = parseFloat(b[filterIndex]);
          return priceB - priceA;
        } else {
          const priceA = a[filterIndex].toLowerCase();
          const priceB = b[filterIndex].toLowerCase();
          return priceB.localeCompare(priceA);
        }
      });
    }
    setFileData(newData);
  }


  return (
    <>
      <h2 className="text-xl font-bold mb-4">Results</h2>
      <div className="absolute right-0 top-2 flex items-center">
        <BsFiletypeCsv
          onClick={(e) => downloadAsCsv()}
          className="text-[#000] text-[20px] mx-2 cursor-pointer"
        />
        <AiOutlineFileExcel
          onClick={(e) => downloadAsExcel()}
          className="text-[#000] text-[20px] mx-2 cursor-pointer"
        />
      </div>

      <div className="flex justify-between items-center flex-wrap">
        <div className=" flex justify-start items-center w-5/12 ">
          <InputSelect
            defValue={filterIndex.toString() }
            name="sort_by"
            inputClassName="w-4/12"
            placeholder="Sort By"
            selectArray={
              header.length > 0
                ? header
                  .filter((item: any, index: number) => !columnsHidden.includes(index))
                  .map((item: any, index: number) => {
                    return { value: item, id: index.toString(), name: item };
                  })
                : []
            }
            onChange={(type: string, value: string) => {
              setFilterIndex(header.indexOf(value));
            }}
          />
          <button className="bg-[#F2F2F2] text-[#000] px-2 py-1 rounded-md mx-2 w-fit"
            onClick={() => filterData("Ascending")}
          >
            Ascending
          </ button>
          <button className="bg-[#F2F2F2] text-[#000] px-2 py-1 rounded-md mx-2 w-fit"
            onClick={() => filterData("Descending")}
          >
            Descending
          </ button>

        </div>

        <div className=" flex justify-start items-center">
          <p className="text-md">
            Likes Range
          </p>
          <InputNumber
            defValue={likesRange[0]}
            name="minlikes"
            placeholder="Min Likes"
            inputClassName="w-20"
            onChangeHandler={(e: React.ChangeEvent<HTMLInputElement>) => {              
              setLikesRange([Number(e.target.value) ,likesRange[1]])}
            }
          />
          <InputNumber
            defValue={likesRange[1]}
            name="maxlikes"
            placeholder="Max Likes"
            inputClassName="w-36"
            onChangeHandler={(e: React.ChangeEvent<HTMLInputElement>) => 
              setLikesRange([likesRange[0],Number(e.target.value)])}
          />
        </div>

        <div className=" flex justify-start items-center">
          <p className="text-md">
            Reach Range
          </p>
          <InputNumber
            defValue={reachRange[0]}
            name="minreach"
            placeholder="Min Reach"
            inputClassName="w-20"
            onChangeHandler={(e: React.ChangeEvent<HTMLInputElement>) => {              
              setReachRange([Number(e.target.value) ,reachRange[1]])}
            }
          />
          <InputNumber
            defValue={reachRange[1]}
            name="maxreach"
            placeholder="Max Reach"
            inputClassName="w-36"
            onChangeHandler={(e: React.ChangeEvent<HTMLInputElement>) => 
              setReachRange([reachRange[0],Number(e.target.value)])}
          />
        </div>
        <button className="bg-[#F2F2F2] text-[#000] px-2 py-1 rounded-md mx-2 w-fit"
        onClick={clearAll}
      >
        Clear All
      </ button>
      </div>




      <div className=" flex justify-between items-center flex-wrap w-11/12 my-3 ">
        {header.map((item: any, index: number) => (
          <Stack
            key={index}
            direction="row"
            spacing={1}
            align="center"
            className="flex items-center justify-start mx-2"
          >
            <input
              type="checkbox"
              checked={!columnsHidden.includes(index)}
              onChange={(e) => hideUnhideColumns(index)}
              className="cursor-pointer w-4 h-4 border border-gray-400 rounded-sm focus:ring-0 focus:outline-none"
            />
            <p className="text-md">{item}</p>
          </Stack>
        ))}
      </div>

      {header.length > 0 ? (
        <ExcelComponent  />
      ) : (
        <div className="flex justify-center items-center">
          <p className="text-lg">No data to display</p>
        </div>
      )}
    </>
  );
}
