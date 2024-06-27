import React from "react";
import { MdDelete, MdDataArray } from "react-icons/md";
import { AppContext } from "../../context/Context";
import axios from "axios";
import { API_URL } from "../../constants/data";
import { useNavigate } from "react-router-dom";
import { ExcelContext } from "../../context/ExcelContext";
import { AiOutlineFileExcel, AiOutlineStop } from "react-icons/ai";
import { BsFiletypeCsv } from "react-icons/bs";
import { FaRegClone } from "react-icons/fa";
import SearchStatus from "../../constants/SearchStatus";

interface Props {
  user: any;
  onDeleteUser: (userId: string) => void;
}
export default function HistoryCard({ user, onDeleteUser }: Props) {
  const { setLoading: setLoad, user: CurrentUser } =
    React.useContext(AppContext);
  const { downloadAsCsv, downloadAsExcel } = React.useContext(ExcelContext);
  const navigate = useNavigate();

  const handleDelete = () => {
    onDeleteUser(user.searchId);
    setLoad(true);
  };

  const handleError = (message: string) => {
    alert(message);
    setLoad(false);
  };

  function navigateToResults() {
    navigate(`/dashboard/results/${user.searchId}`);
  }

  async function stopSearch() {
    try {
      const data = await axios
        .post(API_URL + "/searches/stop", {
          session: CurrentUser.session,
          uid: CurrentUser.uid,
          access_token: CurrentUser.access_token,
          searchId: user.searchId,
        })
        .then((res) => res.data)
        .catch((err) => {
          alert(err.response.data.messfage);
          setLoad(false);
          return;
        });
      alert(data.message);
    } catch (err: any) {
      handleError(
        err.response?.data?.message || "Error occurred while stopping search"
      );
      console.error("Error:", err);
    }
    setLoad(false);
  }

  // async function startSearch() {
  //   try {

  //     const data = await axios
  //       .post(API_URL + "/searches/start", {
  //         session: CurrentUser.session,
  //         uid: CurrentUser.uid,
  //         access_token: CurrentUser.access_token,
  //         searchId: user.searchId,
  //       })
  //       .then((res) => res.data)
  //       .catch((err) => {
  //         alert(err.response.data.message);
  //         setLoad(false);
  //         return;
  //       });
  //     alert(data.message);
  //   } catch (err: any) {
  //     handleError(
  //       err.response?.data?.message || "Error occurred while starting search"
  //     );
  //   }
  //   setLoad(false);
  // }

  async function download(type: string) {
    setLoad(true);
    try {
      const data = await axios
        .get(
          API_URL +
            "/results/all?" +
            new URLSearchParams({
              session: CurrentUser.session,
              uid: CurrentUser.uid,
              access_token: CurrentUser.access_token,
              searchId: user.searchId || "",
            })
        )
        .then((res) => res.data)
        .catch((err) => {
          alert(err.response.data.message);
          setLoad(false);
          return;
        });

      let results = data.results.map((item: any) => {
        return item.results;
      });

      let headerData = Object.keys(results[0]);

      let mainData = results.map((item: any) => {
        return Object.values(item);
      });

      if (type === "EXCEL") downloadAsExcel(mainData, [0, 16, 17], headerData);
      else downloadAsCsv(mainData, [0, 16, 17], headerData);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoad(false);
  }

  return (
    <>
      <div className="w-[30%] ml-2 h-1/4 p-4 mb-4 bg-white rounded-lg shadow-md text-start">
        <div>
          <p className="text-gray-600">Name: {user.name}</p>
          <p className="text-gray-600">Country: {user.country}</p>
          <p className="text-gray-600">
            Content Languages: {user.content_languages.join(", ")}
          </p>
          <p className="text-gray-600">Query: {user.querry}</p>
          <p className="text-gray-600">
            Start date: {new Date(user.filtterStart_date).toDateString()}
          </p>
          <p className="text-gray-600">
            End Date: {new Date(user.filtterEnd_date).toDateString()}
          </p>
          <p className="text-gray-600">Data fetched: {user.status || 0}</p>
        </div>
        <div className="flex justify-between mt-2 items-center gap-1">
          <FaRegClone
            className="cursor-pointer text-blue-500"
            size={24}
            onClick={() => navigate(`/dashboard/${user.searchId}`)}
          />

          <MdDataArray
            className="cursor-pointer text-blue-500"
            size={24}
            onClick={navigateToResults}
          />

          {user.currentStatus === 1 ? (
            <AiOutlineStop
              className="cursor-pointer text-red-500"
              size={24}
              onClick={stopSearch}
            />
          ) : null}

          <MdDelete
            className="cursor-pointer text-red-500"
            size={24}
            onClick={handleDelete}
          />
          <BsFiletypeCsv
            onClick={() => download("CSV")}
            className="text-[#000] text-[20px] mx-2 cursor-pointer"
          />
          <AiOutlineFileExcel
            onClick={() => download("EXCEL")}
            className="text-[#000] text-[20px] mx-2 cursor-pointer"
          />
        </div>
      </div>
    </>
  );
}
