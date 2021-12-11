import "./App.css";
import socket from "./utilities/socketConnection";
import React, { useEffect, useState } from "react";
import Widget from "./components/Widget";

function App() {
  const [performanceData, setPerformanceData] = useState({});

  useEffect(() => {
    socket.on("data", (data) => {
      // console.log(data);
      performanceData[data.macA] = data;

      setPerformanceData({ ...performanceData });
    });
    return () => {
      socket.off();
    };
  }, [performanceData]);

  //grab each machine by property
  let widgets = [];
  Object.entries(performanceData).forEach(([key, value]) => {
    // console.log(key);
    // console.log(value);
    widgets.push(<Widget key={key} data={value} />);
  });
  console.log(performanceData);
  return <div className="App">{widgets}</div>;
}

export default App;
