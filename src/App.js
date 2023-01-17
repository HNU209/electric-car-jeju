import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Trip from "./components/Trip";
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
  const [carTrip, setCarTrip] = useState([]);
  const [electricCarTrip, setElectricCarTrip] = useState([]);
  const [tourLoc, setTourLoc] = useState([]);
  const [parkingLotLoc, setParkingLotLoc] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getFetchData = async () => {
      const carTrip = await getData("car_trip");
      const electricCarTrip = await getData("electric_car_trip");
      const tourLoc = await getData("tour_loc");
      const parkingLotLoc = await getData("parking_loc");

      if (carTrip && electricCarTrip && tourLoc && parkingLotLoc) {
        setCarTrip((prev) => carTrip);
        setElectricCarTrip((prev) => electricCarTrip);
        setTourLoc((prev) => tourLoc);
        setParkingLotLoc((prev) => parkingLotLoc);
        setLoaded(true);
      }
    };

    getFetchData();
  }, []);

  return (
    <div className="container">
      {loaded ? (
        <>
          <Trip
            carTrip={carTrip}
            tourLoc={tourLoc}
            parkingLotLoc={parkingLotLoc}
            minTime={minTime}
            maxTime={maxTime}
            time={time}
            setTime={setTime}
          ></Trip>
          <Trip
            electricCarTrip={electricCarTrip}
            tourLoc={tourLoc}
            parkingLotLoc={parkingLotLoc}
            minTime={minTime}
            maxTime={maxTime}
            time={time}
            setTime={setTime}
          ></Trip>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default App;
