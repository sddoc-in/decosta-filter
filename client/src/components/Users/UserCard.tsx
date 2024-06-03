import React, { useState } from "react";
import { FaStop } from "react-icons/fa6";
import { MdDelete, MdOutlineRestartAlt, MdDataArray } from "react-icons/md";
import { AppContext } from "../../context/Context";
import axios from "axios";
import { API_URL } from "../../constants/data";
import { useNavigate } from "react-router-dom";

interface Props {
  user: any;
  onDeleteUser: (userId: string) => void;
}

const UserCard: React.FC<Props> = ({ user, onDeleteUser }) => {
  const { setLoading: setLoad,user:CurrentUser } = React.useContext(AppContext);
  const navigate = useNavigate();

  const handleDelete = () => {
    onDeleteUser(user.searchId);
    setLoad(true);
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
          alert(err.response.data.message);
          setLoad(false);
          return;
        });
      alert(data.message);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoad(false);
  }

  async function startSearch() {
    try {
      const data = await axios
        .post(API_URL + "/searches/start", {
          session: CurrentUser.session,
          uid: CurrentUser.uid,
          access_token: CurrentUser.access_token,
          searchId: user.searchId,
        })
        .then((res) => res.data)
        .catch((err) => {
          alert(err.response.data.message);
          setLoad(false);
          return;
        });
      alert(data.message);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoad(false);
  }

  return (
    <>
      <div className="w-[30%] ml-2 h-1/4 p-4 mb-4 bg-white rounded-lg shadow-md">
        <div>
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
          <p className="text-gray-600">
            Status:{" "}
            {user.status === 1
              ? "Active"
              : user.status === 0
              ? "Inactive"
              : user.status === 2
              ? "Stopped"
              : user.status === 3
              ? "Completed"
              : "Inactive"}
          </p>
        </div>
        <div className="flex justify-between mt-2 items-center gap-1">
          <MdDataArray
            className="cursor-pointer text-blue-500"
            size={24}
            onClick={navigateToResults}
          />

          {user.status === 1 ? (
            <FaStop className="cursor-pointer text-red-500" size={24}
            onClick={stopSearch}
            />
          ) : (
            <MdOutlineRestartAlt
              className="cursor-pointer text-green-500"
              size={24}
              onClick={startSearch}
            />
          )}

          <MdDelete
            className="cursor-pointer text-red-500"
            size={24}
            onClick={handleDelete}
          />
        </div>
      </div>
    </>
  );
};

export default UserCard;
