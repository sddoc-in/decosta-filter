import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import SearchHistory from "../components/Search/SearchHistory";
import SearchStatus from "../constants/SearchStatus";
import NewSearch from "../components/Search/NewSearch";

export default function Searches() {
  const [show, setShow] = React.useState(1);
  return (
    <>
      <Tabs variant="enclosed" align="center">
        <TabList>
          <Tab onClick={() => setShow(1)}>New</Tab>
          <Tab onClick={() => setShow(2)}>Created</Tab>
          <Tab onClick={() => setShow(3)}>In Progress</Tab>
          <Tab onClick={() => setShow(4)}>Stopped</Tab>
          <Tab onClick={() => setShow(5)}>Completed</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <NewSearch />
          </TabPanel>
          <TabPanel>
            {show === 2 && (
              <SearchHistory status={SearchStatus.Created} recur={false} />
            )}
          </TabPanel>
          <TabPanel>
            {show === 3 && (
              <SearchHistory status={SearchStatus.InProgress} recur={false} />
            )}
          </TabPanel>
          <TabPanel>
            {show === 4 && (
              <SearchHistory status={SearchStatus.Stopped} recur={false} />
            )}
          </TabPanel>
          <TabPanel>
            {show === 5 && (
              <SearchHistory status={SearchStatus.Completed} recur={false} />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
