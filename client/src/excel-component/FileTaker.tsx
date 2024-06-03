import React from "react";
import { ExcelContext } from "../context/ExcelContext";
import { AppContext } from "../context/Context";
export default function FileTaker() {
  const { setHeader, setFileData, fileChoser, fileData } =
    React.useContext(ExcelContext);

  const {
    setLoading
  } = React.useContext(AppContext);

  const [numberofAds, setNumberofAds] = React.useState<number>(0);
  const [adsFetched, setAdsFetched] = React.useState<number>(0);

  

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
    <></>
  );
}


// <>
//       <div className="w-11/12 md:w-10/12 mx-auto flex-col flex justify-center items-center">
//         <div className="flex justify-center items-center w-full">
//           <InputSearch
//             defValue=""
//             placeholder="Enter Query"
//             name="querry"
//             inputClassName={` w-[50%!important] mr-2`}
//             onChangeHandler={(e) => {
//               setCurrentProduct(e.target.value);
//               setApiParams((prev: any) => {
//                 return { ...prev, querry: e.target.value };
//               });
//             }}
//             onClickSearch={getNumberofAds}
//           />
//           <InputCountry
//             defValue=""
//             placeholder="Select Country"
//             name="country"
//             onChange={handleChange}
//             inputClassName={` w-[25%!important] mr-2`}
//           />
//           <button
//             className="btn btn-primary btn-active-shadow capitalize px-3 py-3 h-[auto] w-[auto] min-h-[auto] "
//             onClick={getQueryData}
//           >
//             View results
//           </button>
//         </div>
//         <div className="flex justify-center items-center w-full">
//           <InputSelect
//             defValue=""
//             placeholder="Select language"
//             name="content_languages"
//             selectArray={Languages}
//             inputClassName={` w-[30%!important] mr-2`}
//             onChange={handleChange}
//           />
//           {/* <InputSelect
//             defValue=""
//             placeholder="Select Publisher Platforms"
//             name="publisher_platforms"
//             selectArray={PublisherPlatforms}
//             inputClassName={` w-[30%!important] mr-2`}
//             onChange={handleChange}
//           /> */}
//           <InputMultiSelect
//             defValue=""
//             placeholder="Select Media Type"
//             name="media_type"
//             selectArray={MediaType}
//             inputClassName={` w-[30%!important] mr-2`}
//             onChange={handleMultiSelect}
//           />
//           <InputSelect
//             defValue=""
//             placeholder="Select Ad Status"
//             name="ad_status_type"
//             selectArray={AdStatus}
//             inputClassName={` w-[30%!important] mr-2`}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="flex justify-center items-center w-full">
//           {/* <InputMultiSelect
//             defValue=""
//             placeholder="Select Call To Action"
//             name="call_to_action"
//             selectArray={CallToAction}
//             inputClassName={` w-[30%!important] mr-2`}
//             onChange={handleMultiSelect}
//           />
//           <InputName
//             defValue=""
//             placeholder="Reach"
//             name="reach"
//             inputClassName={` w-[30%!important] mr-2`}
//             onChangeHandler={(e) => changeFilterParams("reach", e.target.value)}
//           /> */}
//           {/*
//           <InputName
//             defValue=""
//             placeholder="Select Min/Max Shares"
//             name="minMaxShares"
//             inputClassName={` w-[30%!important] mr-2`}
//             onChangeHandler={(e) =>
//               changeFilterParams("minMaxShares", e.target.value)
//             }
//           />
//           <InputName
//             defValue=""
//             placeholder="Select Min/Max Reach"
//             name="minMaxReach"
//             inputClassName={` w-[30%!important] mr-2`}
//             onChangeHandler={(e) =>
//               changeFilterParams("minMaxReach", e.target.value)
//             }
//           />
//           <InputName
//             defValue=""
//             placeholder="Select Min/Max Comments"
//             name="minMaxComments"
//             inputClassName={` w-[30%!important] mr-2`}
//             onChangeHandler={(e) =>
//               changeFilterParams("minMaxComments", e.target.value)
//             }
//           /> */}
//         </div>

//         <div className="flex justify-center items-center w-full">
//           <InputDate
//             defValue=""
//             placeholder="Start Date"
//             label="Start Date"
//             name="filtterStart_date"
//             inputClassName={` w-[30%!important] mr-2`}
//             onChangeHandler={(e) => {
//               setApiParams((prev: any) => {
//                 return { ...prev, filtterStart_date: new Date(e.target.value) };
//               });
//             }}
//           />
//           <InputDate
//             defValue=""
//             placeholder="End Date"
//             label="End Date"
//             name="filtterEnd_date"
//             inputClassName={` w-[30%!important] mr-2`}
//             onChangeHandler={(e) => {
//               setApiParams((prev: any) => {
//                 return { ...prev, filtterEnd_date: new Date(e.target.value) };
//               });
//             }}
//           />
//           {/* <InputNumber
//             defValue=""
//             placeholder="Enter Page Number"
//             label="Min Days Active"
//             name="query"
//             inputClassName={` w-[30%!important] mr-2`}
//             onChangeHandler={(e) => {
//               setFilterParams((prev: any) => {
//                 return { ...prev, minDaysActive: e.target.value };
//               });
//             }}
//           /> */}
//           <InputName
//             defValue={numberofAds.toString()}
//             disabled={true}
//             label="Results Found"
//             placeholder="Enter Page Size"
//             name="query"
//             inputClassName={` w-[30%!important] mr-2`}
//           />
//         </div>

//         <div className="divider w-full">OR</div>
//         <input
//           type="file"
//           className={`file-input my-3 file-input-bordered file-input-secondary shadow-lg w-full max-w-xs text-white ${oppositeObj}`}
//           onChange={(e) => getFile(e)}
//         />
//       </div>
//       {loading && <Loader adsFetched={adsFetched} />}
//     </>