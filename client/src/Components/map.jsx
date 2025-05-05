import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const MapWithDirectionButton = ({ lat, lng }) => {
  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  return (
    <div className="relative w-full h-[400px]">
      <MapContainer center={[lat, lng]} zoom={13} className="w-full h-full">
        {/* Satellite View */}
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        <Marker position={[lat, lng]}>
          <Popup>
            <button
              onClick={openGoogleMaps}
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              Get Directions
            </button>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapWithDirectionButton;
