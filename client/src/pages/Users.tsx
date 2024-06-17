import React, { useState } from "react";
import UserCard from "../components/Users/UserCard";
import axios from "axios";
import { AppContext } from "../context/Context";
import { API_URL } from "../constants/data";

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const { user, setLoading } = React.useContext(AppContext);

  const getSearches = React.useRef(() => {});

  getSearches.current = async () => {
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
        return;
      }
    } catch (err) {}
  };
  React.useEffect(() => {
    const interval = setInterval(() => {
      getSearches.current();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    getSearches.current();
  }, []);

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
            <UserCard
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
};
export default Users;
