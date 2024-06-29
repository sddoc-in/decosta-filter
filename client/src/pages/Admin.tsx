import React from "react";
import AdminSetting, { AdminSettingDefault } from "../interface/AdminSetting";
import InputNumber from "../components/input/InputNumber";
import { Button, Stack } from "@chakra-ui/react";
import { AppContext } from "../context/Context";
import axios from "axios";
import { API_URL } from "../constants/data";

export default function Admin() {
  const { user, setLoading, raiseToast } = React.useContext(AppContext);

  const [adminSettings, setAdminSettings] =
    React.useState<AdminSetting>(AdminSettingDefault);

  const getAdminSettings = React.useRef(() => {});

  getAdminSettings.current = async () => {
    try {
      setLoading(true);
      const data = await axios
        .get(
          API_URL +
            "/admin/settings?" +
            new URLSearchParams({
              session: user.session,
              uid: user.uid,
              access_token: user.access_token,
            })
        )
        .then((res) => res.data)
        .catch((err) => {
            return err.response.data;
        });

      if (data.message === "Admin settings fetched successfully") {
        setAdminSettings(data.settings);
      } else {
        raiseToast(data.message, "error");
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      raiseToast("Something went Wrong", "warning");
    }
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAdminSettings({
      ...adminSettings,
      [e.target.name]: parseInt(e.target.value),
    });
  }

  async function saveAdminSettings() {
    try {
      setLoading(true);
      const data = await axios
        .put(
          API_URL + "/admin/settings",
          {
            ...adminSettings,
            session: user.session,
            uid: user.uid,
            access_token: user.access_token,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => res.data)
        .catch((err) => {
         return err.response.data
        });

      if (data.message === "Settings updated successfully") {
        raiseToast(data.message, "success");
      } else {
        raiseToast(data.message, "error");
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      raiseToast("Internal server error", "error");
    }
  }

  React.useEffect(() => {
    getAdminSettings.current();
  }, []);

  return (
    <>
      <h1 className=" text-3xl text-start text-black ">Admin Settings</h1>

      <Stack direction={"row"} gap={2} className="w-full justify-between">
        <InputNumber
          label="Daily Searches"
          inputClassName="w-full"
          defValue={adminSettings.DailySearches.toString()}
          onChangeHandler={handleChange}
          name="DailySearches"
        />

        <InputNumber
          label="Daily Results"
          inputClassName="w-full"
          defValue={adminSettings.DailyResults.toString()}
          onChangeHandler={handleChange}
          name="DailyResults"
        />
      </Stack>

      <Stack direction={"row"} gap={2} className="w-full justify-between">
        <InputNumber
          label="Search Per User"
          inputClassName="w-full"
          defValue={adminSettings.SearchPerUser.toString()}
          onChangeHandler={handleChange}
          name="SearchPerUser"
        />

        <InputNumber
          label="Results Per Search"
          inputClassName="w-full"
          defValue={adminSettings.ResultsPerSearch.toString()}
          onChangeHandler={handleChange}
          name="ResultsPerSearch"
        />
      </Stack>

      <Button colorScheme="blue" onClick={saveAdminSettings}>
        Save
      </Button>
    </>
  );
}
