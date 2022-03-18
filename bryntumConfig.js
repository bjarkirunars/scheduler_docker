/**
 * Application configuration
 */
import data from "./public/data/data1.json";

// Toolbar

export const getData = async () => {
  let eventsData = [];
  let resourcesData = [];
  let dependencyData = [];
  try {
    // let myHeaders = new Headers();
    // if (true) {
    //   myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjQ1NjUwMDI1LCJpYXQiOjE2NDU2NDI4MjUsImp0aSI6ImY1N2RkZDM3ZWZhMDRhOTM4NTBmYzUzZDI3YzYxMmY4IiwidXNlcl9pZCI6Mn0.QtS_QW2WF6yLOIoWLoTmySG8V306KxYl_oFvMM_qYlE");
    // }
    // let requestOptions = {
    //   headers: myHeaders,
    // };
    // let requestUrl = "http://localhost:8000" + "/api/v1/scheduler/production_orders/"
    // const response = await fetch(`${requestUrl}`, requestOptions);
    // // console.log(response.status, response.statusText, action)
    // if (response.status >= 200 && response.status <= 299) {
    //   response_data = await response.json();
    //   data = response_data['data']
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        let resource_tmp = {
          id: item.workcenter,
          workcenter: item.workcenter,
        };
        resourcesData.push(resource_tmp);
        resource_tmp = null;
        for (let j = 0; j < data[i].lines.length; j++) {
          let tmp_event = {
            id: `${item.workcenter} ${item.lines[j].prodordernoline}  ${item.lines[j].line_no}`,
            resourceId: item.workcenter,
            name: `${item.lines[j].prodordernoline} - ${item.lines[j].itemno} -${item.lines[j].quantityline}${item.lines[j].uomline}`,
            startDate: item.lines[j].startingdatetimeline,
            endDate: item.lines[j].endingdatetimeline,
            eventType: "Meeting",
            iconCls: "b-fa b-fa-exclamation-circle",
          };
          eventsData.push(tmp_event);
          tmp_event = null;
          if (
            item.lines[j].fromworkcenter &&
            item.lines[j].fromSide &&
            item.lines[j].fromlineno
          ) {
            dependencyData.push({
              id: item.workcenter + item.lines[j].prodordernoline + item.lines[j].line_no + item.lines[j].fromlineno,
              fromEvent: `${item.lines[j].fromworkcenter} ${item.lines[j].prodordernoline}  ${item.lines[j].fromlineno}`,
              toEvent: `${item.workcenter} ${item.lines[j].prodordernoline}  ${item.lines[j].line_no}`,
              fromSide: item.lines[j].fromSide,
            });
          }
        }
        item = null;
      }
    // }
    console.log("returning")
    return {
      eventsData: eventsData,
      resourcesData: resourcesData,
      dependencyData: dependencyData,
    };
  } catch (err) {
    return {
      eventsData: eventsData,
      resourcesData: resourcesData,
      dependencyData: dependencyData,
    };
  }
  console.log("resourcesData=", resourcesData);
  console.log("eventsData=", eventsData);
};
