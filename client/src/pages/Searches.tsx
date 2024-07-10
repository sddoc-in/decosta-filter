import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import SearchHistory from "../components/Search/SearchHistory";
import SearchStatus from "../constants/SearchStatus";
import NewSearch from "../components/Search/NewSearch";
import { AppContext } from "../context/Context";

export default function Searches(props: { user?: any; newCVal?: boolean }) {
  const {show, setShow} = React.useContext(AppContext);
  const [newVal, setNew] = React.useState(true);
  React.useEffect(() => {
    setNew(props.newCVal !== undefined ? props.newCVal : true);
  }, [props.newCVal]);

  return (
    <>
      <Tabs variant="enclosed" align="center">
        <TabList>
          {newVal && <Tab onClick={() => setShow(1)}>New</Tab>}
          <Tab onClick={() => setShow(2)}>Created</Tab>
          <Tab onClick={() => setShow(3)}>In Progress</Tab>
          <Tab onClick={() => setShow(4)}>Stopped</Tab>
          <Tab onClick={() => setShow(5)}>Completed</Tab>
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
                status={SearchStatus.Created}
                recur={false}
              />
            )}
          </TabPanel>
          <TabPanel>
            {show === 3 && (
              <SearchHistory
                user={props.user}
                status={SearchStatus.InProgress}
                recur={false}
              />
            )}
          </TabPanel>
          <TabPanel>
            {show === 4 && (
              <SearchHistory
                user={props.user}
                status={SearchStatus.Stopped}
                recur={false}
              />
            )}
          </TabPanel>
          <TabPanel>
            {show === 5 && (
              <SearchHistory
                user={props.user}
                status={SearchStatus.Completed}
                recur={false}
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
