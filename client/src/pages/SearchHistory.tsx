import React, { useState } from "react";
import axios from "axios";
import { AppContext } from "../context/Context";
import { API_URL } from "../constants/data";
import HistoryCard from "../components/history/HistoryCard";

export default function SearchHistory() {
  const [users, setUsers] = useState<any[]>([]);
  const { user, setLoading } = React.useContext(AppContext);

  const getSearches = React.useRef(() => {});
  const getAfterDetails = React.useRef(() => {});

  getSearches.current = async () => {
    try {
      setLoading(true);
      const data = await axios
        .post(API_URL + "/searches/get", {
          session: user.session,
          uid: user.uid,
          access_token: user.access_token,
        })
        .then((res) => res.data)
        .catch((err) => {
          alert(err.response.data.message);
          setLoading(false);
          return;
        });

      if (data.message === "Searches fetched successfully") {
        setUsers(data.searches);
      } else {
        alert(data.message);
      }
      setLoading(false);
    } catch (err) {}
  };

  getAfterDetails.current = async () => {
    try {
      const data = await axios
        .post(API_URL + "/searches/get", {
          session: user.session,
          uid: user.uid,
          access_token: user.access_token,
        })
        .then((res) => res.data)
        .catch((err) => {
          alert(err.response.data.message);
          return;
        });

      if (data.message === "Searches fetched successfully") {
        setUsers(data.searches);
      } else {
        alert(data.message);
      }
    } catch (err) {}
  };

  React.useEffect(() => {
    if (users.length === 0) return;
    const interval = setInterval(() => {
      getAfterDetails.current();
    }, 5000);

    return () => clearInterval(interval);
  }, [users]);

  React.useEffect(() => {
    getSearches.current();
  }, [user.uid]);

  const deleteUser = async (searchId: string) => {
    setLoading(true);
    try {
      let res = await axios
        .delete(
          API_URL +
            "/searches/delete?" +
            new URLSearchParams({
              session: user.session,
              uid: user.uid,
              access_token: user.access_token,
              searchId: searchId,
            })
        )
        .then((res) => res.data)
        .catch((err) => {
          alert(err.response.data.message);
          setLoading(false);
          return;
        });

      if (res.message === "Search deleted successfully") {
        const updatedUsers = users.filter((user) => user.searchId !== searchId);
        setUsers(updatedUsers);
        setLoading(false);
      } else {
        alert(res.message);
        setLoading(false);
        return;
      }
      setLoading(false);
    } catch (err) {
      alert("Internal server error");
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <>
      <h1 className="font-black text-3xl text-start text-black mb-3">
        Recent Searches
      </h1>
      <div className="flex flex-wrap">
        {users.length > 0 ? (
          users.map((user) => (
            <HistoryCard
              key={user.searchId}
              user={user}
              onDeleteUser={deleteUser}
            />
          ))
        ) : (
          <p className="text-center text-gray-600">No Search History found</p>
        )}
      </div>
    </>
  );
}
