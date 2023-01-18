import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import { TripsLayer } from '@deck.gl/geo-layers';
import { IconLayer } from '@deck.gl/layers';
import Slider from "@mui/material/Slider";
import '../css/trip.css';
import legend from '../img/legend.png';

const ambientLight = new AmbientLight({
    color: [255, 255, 255],
    intensity: 1.0
});
    
const pointLight = new PointLight({
    color: [255, 255, 255],
    intensity: 2.0,
    position: [-74.05, 40.7, 8000]
});
  
const lightingEffect = new LightingEffect({ambientLight, pointLight});
  
const material = {
    ambient: 0.1,
    diffuse: 0.6,
    shininess: 32,
    specularColor: [60, 64, 70]
};
  
const DEFAULT_THEME = {
    buildingColor: [74, 80, 87],
    trailColor0: [253, 128, 93],
    trailColor1: [23, 184, 190],
    material,
    effects: [lightingEffect]
};

const INITIAL_VIEW_STATE = {
    longitude: 126.55,
    latitude: 33.35,
    zoom: 10,
    minZoom: 5,
    maxZoom: 20,
    pitch: 0,
    bearing: 0
};

const mapStyle = 'mapbox://styles/spear5306/ckzcz5m8w002814o2coz02sjc';
const MAPBOX_TOKEN = `pk.eyJ1Ijoic3BlYXI1MzA2IiwiYSI6ImNremN5Z2FrOTI0ZGgycm45Mzh3dDV6OWQifQ.kXGWHPRjnVAEHgVgLzXn2g`; // eslint-disable-line

const ICON_MAPPING = {
    marker: {x: 0, y: 0, width: 128, height: 128, mask: true}
};

const getDestColor = data => {
    if (data.type === '1') {
        return [255, 0, 0];
    } else if (data.type === '2') {
        return [0, 255, 0];
    } else if (data.type === '3') {
        return [0, 0, 255];
    }
};

const Trip = props => {
    const minTime = props.minTime;
    const maxTime = props.maxTime;
    const time = props.time;
    const animationSpeed = 1;

    const carTrip = props.carTrip;
    const electricCarTrip = props.electricCarTrip;
    const tourLoc = props.tourLoc;
    const parkingLotLoc = props.parkingLotLoc;

    const [animationFrame, setAnimationFrame] = useState('');

    const animate = () => {
        props.setTime(time => {
        if (time > maxTime) {
            return minTime;
        } else {
            return time + (0.01) * animationSpeed;
        };
        });
        const af = window.requestAnimationFrame(animate);
        setAnimationFrame(af);
    };

    const layers = [
        new TripsLayer({
            id: 'car-trip',
            data: carTrip,
            getPath: d => d.trip,
            getTimestamps: d => d.timestamp,
            getColor: d => getDestColor(d),
            opacity: 1,
            widthMinPixels: 5,
            trailLength: 1,
            rounded: true,
            currentTime: time,
            shadowEnabled: false,
        }),
        new TripsLayer({
            id: 'electric-car-trip',
            data: electricCarTrip,
            getPath: d => d.trip,
            getTimestamps: d => d.timestamp,
            getColor: d => getDestColor(d),
            opacity: 1,
            widthMinPixels: 5,
            trailLength: 1,
            rounded: true,
            currentTime: time,
            shadowEnabled: false,
        }),
        new IconLayer({
            id: 'tour-point',
            data: tourLoc,
            pickable: false,
            iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
            iconMapping: ICON_MAPPING,
            sizeMinPixels: 12,
            sizeMaxPixels: 12,
            sizeScale: 3,
            getIcon: d => 'marker',
            getPosition: d => d.point,
            getSize: d => 5,
            getColor: d => [255, 0, 0]
        }),
        new IconLayer({
            id: 'parking-lot-point',
            data: parkingLotLoc,
            pickable: false,
            iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
            iconMapping: ICON_MAPPING,
            sizeMinPixels: 12,
            sizeMaxPixels: 12,
            sizeScale: 3,
            getIcon: d => 'marker',
            getPosition: d => d.point,
            getSize: d => 5,
            getColor: d => [255, 255, 0]
        }),
    ];

    useEffect(() => {
        animate();
        return () => window.cancelAnimationFrame(animationFrame);
    }, []);

    const SliderChange = (value) => {
        const time = value.target.value;
        props.setTime(time);
    };

    return (
        <div className='trip-container' style={{position: 'relative'}}>
            <DeckGL
                effects={DEFAULT_THEME.effects}
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                layers={layers}
            >
                <Map
                mapStyle={mapStyle}
                mapboxAccessToken={MAPBOX_TOKEN}
                />
            </DeckGL>
            <h1 className='time'>
                TIME : {(String(parseInt(Math.round(time) / 60) % 24).length === 2) ? parseInt(Math.round(time) / 60) % 24 : '0'+String(parseInt(Math.round(time) / 60) % 24)} : {(String(Math.round(time) % 60).length === 2) ? Math.round(time) % 60 : '0'+String(Math.round(time) % 60)}
            </h1>
            <Slider
                id="slider"
                value={time}
                min={minTime}
                max={maxTime}
                onChange={SliderChange}
                track="inverted"
            />
            <img className='legend' src={legend}></img>
        </div>
    )
}

export default Trip;