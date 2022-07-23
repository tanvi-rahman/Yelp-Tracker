import { useState, useMemo, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";
import Places from "./places";
import Distance from "./distance";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

export default function Map() {
  const [office, setOffice] = useState<LatLngLiteral>();
  const [directions, setDirections] = useState<DirectionsResult>();
  const mapRef = useRef<GoogleMap>()
  const center = useMemo<LatLngLiteral>(() => ({ lat: 40.7128, lng: -74.0060}), []);
  const options = useMemo<MapOptions>(() => ({
    disableDefaultUI: true,
    clickableIcons: false,
    mapId: "f40fa072a78a4f7b"
  }), []);
  
  const onLoad = useCallback((map) => (mapRef.current = map), []);
  const houses = useMemo(function(){
    if(office) return generateHouses(office);
  }, [office]);

  //hello

  const fetchDirections = (house: LatLngLiteral) => {
    if (!office) return;
    
    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: office,
        destination: house,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === "OK" && result){
          setDirections(result);
        }
      }
    )
  }

  return <div className="container">
      <div className="controls">
        <h1>Yelp - Tracker</h1>
        <Places setOffice={(position) => {
          setOffice(position);
          mapRef.current?.panTo(position);
        }}/>
        {!office && <p>Find restaurants near you!</p>}
        {directions && <Distance leg={directions.routes[0].legs[0]} />}
      </div>
      <div className="map">
        <GoogleMap 
          zoom={10} 
          center={center} 
          mapContainerClassName="map-container" 
          options={options} 
          onLoad={onLoad}
        >

          {directions && (
          <DirectionsRenderer directions={directions} options={{
            polylineOptions: {
              zIndex: 50,
              strokeColor: "#1976D2",
              strokeWeight: 5,
            }
            }}/>)}
          {office && (
            <>
            <Marker
              position={office} 
            />

            {houses.map((house) => (
              <Marker 
              key ={house.lat} 
              position={house} 
              onClick={() => {
                fetchDirections(house);
              }}/>
            ))}

            <Circle center={office} radius={15000} options={closeOptions}/>
            <Circle center={office} radius={30000} options={middleOptions}/>
            <Circle center={office} radius={45000} options={farOptions}/>
            </>
          )}
        </GoogleMap>
      </div>
    </div>;
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.20,
  strokeColor: "#00FA9A",
  fillColor: "#00FA9A",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.15,
  strokeColor: "#FFD700",
  fillColor: "#FFD700",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.10,
  strokeColor: "#DC143C",
  fillColor: "#DC143C",
};

const generateHouses = (position: LatLngLiteral) => {
  const _houses: Array<LatLngLiteral> = [];
  for (let i = 0; i < 20; i++) {
    const direction = Math.random() < 0.5 ? -2 : 2;
    _houses.push({
      lat: position.lat + Math.random() / direction,
      lng: position.lng + Math.random() / direction,
    });
  }
  return _houses;
};
