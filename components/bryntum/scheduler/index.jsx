import {
  BryntumSchedulerPro,
  BryntumDemoHeader,
  BryntumThemeCombo,
  BryntumSplitter,
  BryntumButton,
} from "@bryntum/schedulerpro-react";

import React, { Fragment, useEffect, useRef, useState } from "react";
import { ProjectModel } from "@bryntum/schedulerpro/schedulerpro.umd.js";
import { getData } from "../../../bryntumConfig";
export default function Scheduler() {
  const schedulerRef = useRef();
  const [eventsData, setEventsData] = useState([]);
  const [resourcesData, setResourcesData] = useState([]);
  const [dependencyData, setDependencyData] = useState([]);
  const [showScheduler, setShowScheduler] = useState(false);
  const project = new ProjectModel({
    eventsData: eventsData,
    resourcesData: resourcesData,
    dependenciesData: dependencyData,
  });

  const config = {
    project,
    flex: "1 1 50%",
    startDate: new Date(2022, 1, 20),
    endDate: new Date(2022, 5, 30),
    viewPreset: "dayAndWeek",
    eventStyle: "hollow",
    tickSize: 70,
    subGridsConfigs: {
      locked: {
        width: "30em",
      },
    },
    features: {
      eventDrag: {
        disabled: false,
      },

      scheduleMenu: {
        disabled: true,
        items: {
          addEvent: false,
          deleteEvent: false,
        },
      },
      eventMenu: {
        items: {
          deleteEvent: false,
          addEvent: false,
          unassignEvent: false,
          copyEvent: {
            disabled: true,
          },
          cutEvent: {
            disabled: true,
          },
        },
      },

      eventDragCreate: {
        disabled: true,
      },
    },
    columns: [
      {
        type: "resourceInfo",
        text: "Work Centers",
        field: "workcenter",
        width: "10em",
      },
    ],
  };
  useEffect(() => {
    const getdata = async () => {
      let data = await getData();
      setEventsData(data.eventsData);
      setResourcesData(data.resourcesData);
      setDependencyData(data.dependencyData);
      setShowScheduler(true);
    };
    getdata();
  }, []);
  const onZoom = ({ source }) => {
    const {
      dataset: { action },
    } = source;
    schedulerRef.current.instance[action]();
  };

  const syncData = async (res) => {
    console.log("data=", res.records[0]._data);
    if (res.changes) {
      console.log("changed_date_end=", res.changes.endDate);
      console.log("changed_date_start=", res.changes.startDate);
      let item = res.records[0]._data;
      let tmp_events_data = [];
      await eventsData.map(async (event, index) => {
        if (item.id === event.id) {
          event.startDate = item.startDate;
          event.endDate = item.endDate;
          event.resourceId = item.resourceId;
        }
        await tmp_events_data.push(event);
      });
      await setEventsData(tmp_events_data);
      tmp_events_data = null;
    }
  };
  const saveData = async () => {};

  return (
    <Fragment>
      {showScheduler === true ? (
        <div style={{ height: "100%" }}>
          <div style={{ height: "80%" }}>
            {/* <BryntumDemoHeader href="/">
              <BryntumThemeCombo />
            </BryntumDemoHeader> */}

            <BryntumButton
              dataset={{ action: "zoomIn" }}
              icon="b-icon-search-plus"
              tooltip="Zoom in"
              onAction={onZoom}
            />
            <BryntumButton
              dataset={{ action: "zoomOut" }}
              icon="b-icon-search-minus"
              tooltip="Zoom out"
              onAction={onZoom}
            />
            <BryntumSchedulerPro
              ref={schedulerRef}
              {...config}
              onDataChange={syncData}
            />
            <BryntumSplitter />
          </div>
          <button
            style={{
              backgroundColor: "#2667c8",
              color: "white",
              width: "8em",
              height: "2em",
              marginRight: "1em",
              border: "1px black solid",
              marginTop: "2em",
              fontSize: "2em",
              float: "right",
              borderRadius: "1em"
            }}
            onClick={() => {
              saveData();
            }}
          >
            Submit
          </button>{" "}
        </div>
      ) : null}
    </Fragment>
  );
}
