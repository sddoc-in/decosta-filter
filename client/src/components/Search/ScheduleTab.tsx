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
import Recurrence from "../../constants/Recurrence";

export default function ScheduleTab(props: {
  status: SearchStatus | SearchStatus[];
  recur: boolean;
  user?: any;
}) {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const { user, setLoading, raiseToast } = React.useContext(AppContext);
  const { selected, setSelected} = React.useContext(ExcelContext);

  const getSearches = React.useRef(() => { });

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

      if (data.status === 200) {
        setUsers(data.searches);
      } else {
        raiseToast(data.message, "error");
      }
    } catch (err) {
      raiseToast("Internal server error", "error");
    }
    setLoading(false);
  };


  React.useEffect(() => {
    getSearches.current();
  }, []);

  const Delete = async () => {
    setLoading(true);

    for (let i = 0; i < selected.length; i++) {
      const searchId = users[selected[i]].scheduleId;
      try {
        let res = await axios
          .delete(
            API_URL +
            "/recurrence/delete?" +
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
            (user) => user.scheduleId !== searchId
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

  const Stop = async () => {
    if (selected.length === 0) {
      raiseToast("Please select a search to stop", "error");
      return;
    }

    setLoading(true);
    selected.forEach(async (element) => {
      try {
        const searchId = users[element].scheduleId;

        let res = await axios
          .post(API_URL + "/recurrence/stop", {
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

  const options: FormTopBarInterface[] = [
    {
      name: "Delete",
      Icon: MdDeleteOutline,
      Object() {
        Delete();
      },
    },
    {
      name: "Stop",
      Icon: FaPause,
      Object() {
        Stop();
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
          "Created Date",
          "Recurrence",
          "Status",
        ]}
        body={
          users.length === 0 ? [] :
            users.map((data) => [
              data.name,
              data.country,
              data.content_languages.join(", "),
              data.query,
              data.time ? new Date(data.time).toDateString() : "",
              Recurrence[data.recurrence as Recurrence],
              SearchStatus[data.status],
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
