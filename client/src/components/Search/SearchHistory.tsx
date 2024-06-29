import React, { useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/Context";
import { API_URL } from "../../constants/data";
import SearchStatus from "../../constants/SearchStatus";
import TableComponent from "../common/TableComponent";
import { MdDeleteOutline } from "react-icons/md";
import FormTopBarInterface from "../../interface/FormTopBar";
import FormTopBar from "../dashboard/FormTopBar";
import { ExcelContext } from "../../context/ExcelContext";
import { FaPause, FaPlay } from "react-icons/fa";

export default function SearchHistory(props: {
  status: SearchStatus;
  recur: boolean;
  user?: any;
}) {
  const [users, setUsers] = useState<any[]>([]);
  const { user, setLoading, raiseToast } = React.useContext(AppContext);
  const { selected } = React.useContext(ExcelContext);

  const getSearches = React.useRef(() => {});
  const getAfterDetails = React.useRef(() => {});

  getSearches.current = async () => {
    setLoading(true);
    try {
      const data = await axios
        .post(API_URL + "/searches/get", {
          session: user.session,
          uid: props.user === undefined ? user.uid :props.user.uid,
          access_token: user.access_token,
          status: props.status,
        })
        .then((res) => res.data)
        .catch((err) => {
          return err.response.data
        });

      if (data.message === "Searches fetched successfully") {
        setUsers(data.searches);
      } else {
        raiseToast(data.message, "error");
      }
    } catch (err) {
      raiseToast("Internal server error", "error");
    }
    setLoading(false);
  };

  getAfterDetails.current = async () => {
    try {
      const data = await axios
        .post(API_URL + "/searches/get", {
          session: user.session,
          uid: props.user === undefined ? user.uid :props.user.uid,
          access_token: user.access_token,
          status: props.status,
        })
        .then((res) => res.data)
        .catch((err) => {
          return err.response.data
        });

      if (data.message === "Searches fetched successfully") {
        setUsers(data.searches);
      } else {
        raiseToast(data.message, "error");
      }
    } catch (err) {
      raiseToast("Internal server error", "error");
    }
  };

  React.useEffect(() => {
    if (!user.uid && users.length === 0) return;
    const interval = setInterval(() => {
      getAfterDetails.current();
    }, 5000);
    if (props.status !== SearchStatus.InProgress && !props.recur)
      clearInterval(interval);
    return () => clearInterval(interval);
  }, [props.recur, props.status]);

  React.useEffect(() => {
    getSearches.current();
  }, []);

  const Delete = async () => {
    setLoading(true);

    selected.forEach(async (element) => {
      try {
        const searchId = users[element].searchId;
        
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
            return err.response.data
          });

        if (res.message === "Search deleted successfully") {
          const updatedUsers = users.filter(
            (user) => user.searchId !== searchId
          );
          setUsers(updatedUsers);
        } else {
          raiseToast(res.message, "error");
        }
      } catch (err) {
        console.log(err);
        raiseToast("Internal server error", "error");
      }
    });
    setLoading(false);
  };

  const Start = async () => {

    if(selected.length === 0) {
      raiseToast("Please select a search to start", "error");
      return;
    }

    setLoading(true);

    selected.forEach(async (element) => {
      try {
        const searchId = users[element].searchId;
        
        let res = await axios
          .post(
            API_URL +
              "/searches/start" ,
              {
                session: user.session,
                uid: user.uid,
                access_token: user.access_token,
                searchId: searchId,
              }
          )
          .then((res) => res.data)
          .catch((err) => {
            return err.response.data
          });

        if (res.message === "Search started successfully") {
          const updatedUsers = users.filter(
            (user) => user.searchId !== searchId
          );
          setUsers(updatedUsers);
          raiseToast(res.message, "success");
        } else {
          raiseToast(res.message, "error");
        }
      } catch (err) {
        console.log(err);
        raiseToast("Internal server error", "error");
      }
    });
    setLoading(false);
  }

  const Stop = async () => {

    if(selected.length === 0) {
      raiseToast("Please select a search to stop", "error");
      return;
    }

    setLoading(true);

    selected.forEach(async (element) => {
      try {
        const searchId = users[element].searchId;
        
        let res = await axios
          .post(
            API_URL +
              "/searches/stop" ,
              {
                session: user.session,
                uid: user.uid,
                access_token: user.access_token,
                searchId: searchId,
              }
          )
          .then((res) => res.data)
          .catch((err) => {
            return err.response.data
          });

        if (res.message === "Search stopped successfully") {
          const updatedUsers = users.filter(
            (user) => user.searchId !== searchId
          );
          setUsers(updatedUsers);
          raiseToast(res.message, "success");
        } else {
          raiseToast(res.message, "error");
        }
      } catch (err) {
        console.log(err);
        raiseToast("Internal server error", "error");
      }
    });
    setLoading(false);
  }

  const options: FormTopBarInterface[] = [
    {
      name: "Delete",
      Icon: MdDeleteOutline,
      Object() {
        Delete();
      },
    },
    {
      name:"Start",
      Icon:FaPlay,
      Object() {
        Start();
      },
    },
    {
      name:"Stop",
      Icon:FaPause,
      Object() {
        Stop();
      },
    }
  ];

  return (
    <>
      <FormTopBar options={options} refreh={getSearches.current} data={users} />

      <TableComponent
        head={[
          "Name",
          "Country",
          "Content Languages",
          "Query",
          "Start date",
          "End Date",
          "Data fetched",
          "Created Date",
          "View Results"
        ]}
        body={users.map((user) => [
          user.name,
          user.country,
          user.content_languages.join(", "),
          user.querry,
          new Date(user.filtterStart_date).toDateString(),
          new Date(user.filtterEnd_date).toDateString(),
          user.status || 0,
          user.CreatedDate ? new Date(user.CreatedDate).toDateString() : "",
          user.searchId,
          "View Details"
        ])}
        hidden={[8]}
        link={[{
          index: 9,
          form: "results",
          key:8
        }]}
      />
    </>
  );
}
