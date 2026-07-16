import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Clinic } from "@/lib/mock-data";

// Fix default marker icons (Leaflet + bundlers)
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function FitBounds({ facilities }: { facilities: Clinic[] }) {
  const map = useMap();
  useEffect(() => {
    if (!facilities.length) return;
    const bounds = L.latLngBounds(facilities.map((f) => [f.lat, f.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 });
  }, [facilities, map]);
  return null;
}

export default function FacilityMap({ facilities }: { facilities: Clinic[] }) {
  const center: [number, number] = facilities[0]
    ? [facilities[0].lat, facilities[0].lng]
    : [-30.7411, 30.4547]; // Port Shepstone

  return (
    <MapContainer center={center} zoom={10} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {facilities.map((f) => (
        <Marker key={f.id} position={[f.lat, f.lng]}>
          <Popup>
            <div className="text-xs">
              <div className="font-semibold">{f.name}</div>
              <div className="text-muted-foreground">{f.address}</div>
              <div className="mt-1">{f.waitMinutes} min wait · {f.hours}</div>
              <a
                className="text-primary underline"
                href={`https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                Directions
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
      <FitBounds facilities={facilities} />
    </MapContainer>
  );
}
