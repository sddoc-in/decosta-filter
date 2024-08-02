import React, { useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/Context";
import { API_URL } from "../../constants/data";
import TableComponent from "../common/TableComponent";
import { MdCalendarViewWeek, MdDeleteOutline } from "react-icons/md";
import FormTopBarInterface from "../../interface/FormTopBar";
import FormTopBar from "../dashboard/FormTopBar";
import { ExcelContext } from "../../context/ExcelContext";
import { FaPause, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SearchStatus from "../../constants/SearchStatus";

export default function ScheduleTab(props: {
  status: SearchStatus | SearchStatus[];
  recur: boolean;
  user?: any;
}) {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const { user, setLoading, raiseToast } = React.useContext(AppContext);
  const { selected, setSelected, changeFileData, setHeader, setColumnsHidden } = React.useContext(ExcelContext);

  const getSearches = React.useRef(() => {});
  const getAfterDetails = React.useRef(() => {});

  getSearches.current = async () => {
    setLoading(true);
    try {
      const data = await axios
        .post(API_URL + "/recurrence/schedule", {
          session: user.session,
          uid: props.user === undefined ? user.uid : props.user.uid,
          access_token: user.access_token,
          status: props.status,
        })
        .then((res) => res.data)
        .catch((err) => {
          return err.response.data;
        });

      if (data.message === "Recurrences fetched successfully") {
        setUsers(data.recurrences);
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
        .post(API_URL + "/recurrence/schedule", {
          session: user.session,
          uid: props.user === undefined ? user.uid : props.user.uid,
          access_token: user.access_token,
          status: props.status,
        })
        .then((res) => res.data)
        .catch((err) => {
          return err.response.data;
        });

      if (data.message === "Recurrences fetched successfully") {
        setUsers(data.recurrences);
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
    if (props.status !==SearchStatus.recurrence && !props.recur) clearInterval(interval);
    return () => clearInterval(interval);
  }, [props.recur, props.status]);

  React.useEffect(() => {
    getSearches.current();
  }, []);

  const Delete = async () => {
    setLoading(true);

    for (let i = 0; i < selected.length; i++) {
      const searchId = users[selected[i]].searchId;
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
            return err.response.data;
          });

        if (res.message === "Recurrence deleted successfully") {
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
    }
    setSelected([]);
    setLoading(false);
  };

  const Start = async () => {
    if (selected.length === 0) {
      raiseToast("Please select a search to start", "error");
      return;
    }

    setLoading(true);
    selected.forEach(async (element) => {
      try {
        const searchId = users[element].searchId;

        let res = await axios
          .post(API_URL + "/searches/start", {
            session: user.session,
            uid: user.uid,
            access_token: user.access_token,
            searchId: searchId,
          })
          .then((res) => res.data)
          .catch((err) => {
            return err.response.data;
          });

        if (res.message === "Recurrence started successfully") {
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
    setSelected([]);
    setLoading(false);
  };

  const Stop = async () => {
    if (selected.length === 0) {
      raiseToast("Please select a search to stop", "error");
      return;
    }

    setLoading(true);
    selected.forEach(async (element) => {
      try {
        const searchId = users[element].searchId;

        let res = await axios
          .post(API_URL + "/searches/stop", {
            session: user.session,
            uid: user.uid,
            access_token: user.access_token,
            searchId: searchId,
          })
          .then((res) => res.data)
          .catch((err) => {
            return err.response.data;
          });

        if (res.message === "Recurrence stopped successfully") {
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
    setSelected([]);
    setLoading(false);
  };

  async function viewDetails() {
    if (selected.length === 0) {
      raiseToast("Please select a search to view", "error");
      return;
    }

    setLoading(true);
    let headers, data: any[] = [];

    for (let i = 0; i < selected.length; i++) {
      const searchId = users[selected[i]].searchId;
      try {
        let res = await axios
          .get(
            API_URL +
              "/results/all?" +
              new URLSearchParams({
                session: user.session,
                uid: user.uid,
                access_token: user.access_token,
                searchId: searchId,
              })
          )
          .then((res) => res.data)
          .catch((err) => {
            return err.response.data;
          });

        let results = res.results.map((item: any) => {
          return item.results;
        });
        if (i === 0) {
          headers = Object.keys(results[0]);
        }
        let mainData = results.map((item: any) => {
          return Object.values(item);
        });

        data = data.concat(mainData);
      } catch (err) {
        console.log(err);
        raiseToast("Internal server error", "error");
      }
    }
    setLoading(false);
    if (headers) {
      setHeader(headers);
      changeFileData(data);
      setColumnsHidden([0, 16, 17]);
      setSelected(data);
      navigate("/dashboard/results");
    }
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
      name: "Start",
      Icon: FaPlay,
      Object() {
        Start();
      },
    },
    {
      name: "Stop",
      Icon: FaPause,
      Object() {
        Stop();
      },
    },
    {
      name: "View",
      Icon: MdCalendarViewWeek,
      Object() {
        viewDetails();
      },
    },
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
          "Status",
        ]}
        body={users.map((user) => [
          user.name,
          user.country,
          user.content_languages.join(", "),
          user.query,
          new Date(user.filterStartDate).toDateString(),
          new Date(user.filterEndDate).toDateString(),
          user.status || 0,
          user.CreatedDate ? new Date(user.CreatedDate).toDateString() : "",
          user.currentStatus,
        ])}
        hidden={[9]}
        link={[{
          index: 10,
          form: "results",
          key: 9
        }]}
      />
    </>
  );
}
