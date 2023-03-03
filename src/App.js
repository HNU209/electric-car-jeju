import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import Splash from "./components/Splash";
import Trip from "./components/Trip";
import "./css/app.css";

const fetchData = (name) => {
  const res = axios.get(
    `https://raw.githubusercontent.com/HNU209/electric-car-jeju/main/src/data/${name}.json`
  );
  const data = res.then((r) => r.data);
  return data;
};

const App = () => {
  const [generalCarTrip, setGeneralCarTrip] = useState([]);
  const [electricCarTrip, setElectricCarTrip] = useState([]);
  const [buildingLoc, setBuildingLoc] = useState([]);
  const [electricCarParkingLotLoc, setElectricCarParkingLotLoc] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const getData = useCallback(async () => {
    const generalCarTrip = await fetchData("general_car_trip");
    const electricCarTrip = await fetchData("electric_car_trip");
    const buildingLoc = await fetchData("building_loc");
    const electricCarParkingLotLoc = await fetchData("electric_parking_loc");

    setGeneralCarTrip((prev) => generalCarTrip);
    setElectricCarTrip((prev) => electricCarTrip);
    setBuildingLoc((prev) => buildingLoc);
    setElectricCarParkingLotLoc((prev) => electricCarParkingLotLoc);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="container">
      {!isLoaded && <Splash />}
      {isLoaded && (
        <>
          <Trip
            name={"택시"}
            generalCarTrip={generalCarTrip}
            buildingLoc={buildingLoc}
          ></Trip>
          <Trip
            name={"초소형 전기차"}
            electricCarTrip={electricCarTrip}
            buildingLoc={buildingLoc}
            electricCarParkingLotLoc={electricCarParkingLotLoc}
          ></Trip>
        </>
      )}
    </div>
  );
};

export default App;
