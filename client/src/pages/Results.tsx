import React from "react";
import { AppContext } from "../context/Context";
import axios from "axios";
import { API_URL } from "../constants/data";
import { ExcelContext } from "../context/ExcelContext";
import ExcelComponent from "../excel-component/ExcelComponent";
import { BsFiletypeCsv } from "react-icons/bs";
import { AiOutlineFileExcel } from "react-icons/ai";
import { useParams } from "react-router-dom";

export default function Results() {
  const { user, setLoading,raiseToast } = React.useContext(AppContext);
  const {
    setFileData,
    header,
    setHeader,
    setColumnsHidden,
    downloadAsCsv,
    downloadAsExcel,
  } = React.useContext(ExcelContext);
  const getAllResults = React.useRef(() => {});

  const { id } = useParams();

  getAllResults.current = async () => {
    setLoading(true);
    setHeader([]);
    setFileData([]);
    try {
      const data = await axios
        .get(
          API_URL +
            "/results/all?" +
            new URLSearchParams({
              session: user.session,
              uid: user.uid,
              access_token: user.access_token,
              searchId: id || "",
            })
        )
        .then((res) => res.data)
        .catch((err) => {
          raiseToast(err.response.data.message, "error")
          setLoading(false);
          return;
        });

      let results = data.results.map((item: any) => {
        return item.results;
      });

      let headerData = Object.keys(results[0]);

      let mainData = results.map((item: any) => {
        return Object.values(item);
      });

      setHeader(headerData);
      setFileData(mainData);
      setColumnsHidden([0, 16, 17]);
    } catch (error) {
      console.error("Error:", error);
      raiseToast("Error occurred while fetching data", "error")
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getAllResults.current();
  }, [user]);

  return (
    <>
      <h2 className="text-xl font-bold mb-4">All Results</h2>
      <div className="absolute right-0 top-2 flex items-center">
        <BsFiletypeCsv
          onClick={downloadAsCsv}
          className="text-[#000] text-[20px] mx-2 cursor-pointer"
        />
        <AiOutlineFileExcel
          onClick={downloadAsExcel}
          className="text-[#000] text-[20px] mx-2 cursor-pointer"
        />
      </div>
      {header.length > 0 ? (
        <ExcelComponent />
      ) : (
        <div className="flex justify-center items-center">
          <p className="text-lg">No data to display</p>
        </div>
      )}
    </>
  );
}
