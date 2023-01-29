import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Trip from "./components/Trip";
import Splash from "./components/Splash";
import "./css/app.css";

const getData = (name) => {
  const res = axios.get(`https://raw.githubusercontent.com/HNU209/electric-car-jeju/main/src/data/${name}.json`);
  const data = res.then((r) => r.data);
  return data;
};

const App = () => {
  const minTime = 480;
  const maxTime = 660;
  const [time, setTime] = useState(minTime);
  const [generalCarTrip, setGeneralCarTrip] = useState([]);
  const [electricCarTrip, setElectricCarTrip] = useState([]);
  const [buildingLoc, setBuildingLoc] = useState([]);
  const [electricCarParkingLotLoc, setElectricCarParkingLotLoc] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getFetchData = async () => {
      const generalCarTrip = await getData("general_car_trip");
      const electricCarTrip = await getData("electric_car_trip");
      const buildingLoc = await getData("building_loc");
      const electricCarParkingLotLoc = await getData("electric_parking_loc");

      if (generalCarTrip && electricCarTrip && buildingLoc && electricCarParkingLotLoc) {
        setGeneralCarTrip((prev) => generalCarTrip);
        setElectricCarTrip((prev) => electricCarTrip);
        setBuildingLoc((prev) => buildingLoc);
        setElectricCarParkingLotLoc((prev) => electricCarParkingLotLoc);
        setLoaded(true);
      }
    };

    getFetchData();
  }, []);

  return (
    <div className="container">
      {loaded ?
        <>
          <Trip
            generalCarTrip={generalCarTrip}
            buildingLoc={buildingLoc}
            minTime={minTime}
            maxTime={maxTime}
            time={time}
            setTime={setTime}
          ></Trip>
          <Trip
            electricCarTrip={electricCarTrip}
            buildingLoc={buildingLoc}
            electricCarParkingLotLoc={electricCarParkingLotLoc}
            minTime={minTime}
            maxTime={maxTime}
            time={time}
            setTime={setTime}
          ></Trip>
        </>
      :
      <Splash></Splash>
      }
    </div>
  );
};

export default App;
