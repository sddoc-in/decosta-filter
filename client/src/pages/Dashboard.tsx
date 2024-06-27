import React from "react";
import { AppContext } from "../context/Context";
import { API_URL } from "../constants/data";
import axios from "axios";
import RolesEnum from "../constants/Roles";
import Chart from "chart.js/auto";

export default function Dashboard() {
  const { user, setLoading, raiseToast } = React.useContext(AppContext);

  const [dailysearch, setDailysearch] = React.useState<any>([
    { _id: "", count: 0 },
  ]);
  const [dailyResults, setDailyResults] = React.useState<any>([
    { _id: "", count: 0 },
  ]);
  const [userSearch, setUserSearch] = React.useState<any>([]);

  let myChart: Chart | undefined,
    myChart1: Chart | undefined,
    myChart2: Chart | undefined;

  const getDailySearches = React.useRef(() => {});
  const getUserSearches = React.useRef(() => {});
  const getDailyResults = React.useRef(() => {});

  getDailyResults.current = async () => {
    const param = new URLSearchParams({
      uid: user.uid,
      session: user.session,
      access_token: user.access_token,
    });

    setLoading(true);
    try {
      const response = await axios
        .get(API_URL + "/analytics/results/daily?" + param)
        .then((response) => response.data)
        .catch((error) => {
          raiseToast("Error fetching data", "error");
        });
      if (response.data) {
        setDailyResults(response.data);
      }
    } catch (error) {
      raiseToast("Error fetching data", "error");
    }
    setLoading(false);
  };

  getDailySearches.current = async () => {
    const param = new URLSearchParams({
      uid: user.uid,
      session: user.session,
      access_token: user.access_token,
    });

    setLoading(true);
    try {
      const response = await axios
        .get(API_URL + "/analytics/search/daily?" + param)
        .then((response) => response.data)
        .catch((error) => {
          raiseToast("Error fetching data", "error");
        });
      if (response.data) {
        setDailysearch(response.data);
      }
    } catch (error) {
      raiseToast("Error fetching data", "error");
    }
    setLoading(false);
  };

  getUserSearches.current = async () => {
    const param = new URLSearchParams({
      uid: user.uid,
      session: user.session,
      access_token: user.access_token,
    });

    setLoading(true);
    try {
      const response = await axios
        .get(API_URL + "/analytics/user/searches?" + param)
        .then((response) => response.data)
        .catch((error) => {
          raiseToast("Error fetching data", "error");
        });
      if (response.data) {
        setUserSearch(response.data);
      }
    } catch (error) {
      raiseToast("Error fetching data", "error");
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (user.uid && user.role !== RolesEnum.ADMIN) {
      getDailySearches.current();
      getDailyResults.current();
    } else if (user.uid && user.role === RolesEnum.ADMIN) {
      getUserSearches.current();
    }
  }, [user.uid, user.role]);

  const drawGraph = () => {
    if (myChart !== undefined) {
      myChart.destroy();
    }
    Chart.getChart("myChart")?.destroy();
    const ctx = document.getElementById("myChart") as HTMLCanvasElement;
    myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dailysearch.map((item: any) => item._id),
        datasets: [
          {
            label: dailysearch.length > 0 ? "Daily Searches" : "No Data Found",
            data: dailysearch.map((item: any) => item.count),
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  const drawGraph1 = () => {
    if (myChart1 !== undefined) {
      myChart1.destroy();
    }
    Chart.getChart("myChart1")?.destroy();
    const ctx = document.getElementById("myChart1") as HTMLCanvasElement;
    myChart1 = new Chart(ctx, {
      type: "line",
      data: {
        labels:
          dailyResults.length > 0
            ? dailyResults.map((item: any) => item._id)
            : ["No Data Found"],
        datasets: [
          {
            label: dailyResults.length > 0 ? "Daily Results" : "No Data Found",
            data:
              dailyResults.length > 0
                ? dailyResults.map((item: any) => item.count)
                : [0],
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  const drawGraph2 = () => {
    if (myChart2 !== undefined) {
      myChart2.destroy();
    }
    Chart.getChart("myChart2")?.destroy();
    const ctx = document.getElementById("myChart2") as HTMLCanvasElement;
    myChart2 = new Chart(ctx, {
      type: "line",
      data: {
        labels:
          userSearch.length > 0
            ? userSearch.map((item: any) => item._id)
            : ["No Data Found"],
        datasets: [
          {
            label: userSearch.length > 0 ? "User Searches" : "No Data Found",
            data:
              userSearch.length > 0
                ? userSearch.map((item: any) => item.count)
                : [],
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  React.useEffect(() => {
    if (dailysearch.length > 0 && user.uid && user.role !== RolesEnum.ADMIN) {
      drawGraph();
    }
  }, [dailysearch, user.uid,user.role]);

  React.useEffect(() => {
    if (dailyResults.length > 0 && user.uid && user.role !== RolesEnum.ADMIN) {
      drawGraph1();
    }
  }, [dailyResults, user.uid,user.role]);

  React.useEffect(() => {
    if (userSearch.length > 0 && user.uid && user.role === RolesEnum.ADMIN) {
      drawGraph2();
    }
  }, [userSearch, user.uid,user.role]);

  return (
    <>
      <h1 className=" text-3xl text-start text-black ">Dashboard</h1>
      {user.role === RolesEnum.ADMIN ? (
        <div className="flex flex-col items-center">
          <div className="w-11/12 h-96 bg-white rounded-lg shadow-lg mt-10">
            <canvas id="myChart2"></canvas>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-11/12 h-96 bg-white rounded-lg shadow-lg mt-10">
            <canvas id="myChart"></canvas>
          </div>
          <div className="w-11/12 h-96 bg-white rounded-lg shadow-lg mt-10">
            <canvas id="myChart1"></canvas>
          </div>
        </div>
      )}
    </>
  );
}
