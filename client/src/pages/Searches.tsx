import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import SearchHistory from "../components/Search/SearchHistory";
import SearchStatus from "../constants/SearchStatus";
import NewSearch from "../components/Search/NewSearch";
import { AppContext } from "../context/Context";
import ScheduleTab from "../components/Search/ScheduleTab";

interface SearchesProps {
  user?: any;
  newCVal?: boolean;
  recur?: SearchStatus[];
}

export default function Searches(props: SearchesProps) {
  const { show, setShow } = React.useContext(AppContext);
  const [newVal, setNew] = React.useState(true);

  React.useEffect(() => {
    setNew(props.newCVal !== undefined ? props.newCVal : true);
  }, [props.newCVal]);

  return (
    <>
      <Tabs variant="enclosed" align="center">
        <TabList>
          {newVal && <Tab onClick={() => setShow(1)}>New</Tab>}
          <Tab onClick={() => setShow(2)}>In Progress</Tab>
          <Tab onClick={() => setShow(3)}>History</Tab>
          <Tab onClick={() => setShow(4)}>Scheduled</Tab>
        </TabList>

        <TabPanels>
          {newVal && (
            <TabPanel>
              <NewSearch />
            </TabPanel>
          )}
          <TabPanel>
            {show === 2 && (
              <SearchHistory
                user={props.user}
                status={SearchStatus.InProgress}
                recur={false}
              />
            )}
          </TabPanel>
          <TabPanel>
            {show === 3 && (
              <SearchHistory
                user={props.user}
                status={[SearchStatus.Created, SearchStatus.Completed, SearchStatus.Stopped]}
                recur={false}
              />
            )}
          </TabPanel>
          <TabPanel>
            {show === 4 && (
              <ScheduleTab
                user={props.user}
                status={SearchStatus.recurrence}
                recur={true}
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
