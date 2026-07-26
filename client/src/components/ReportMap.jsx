import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function ReportMap({ reports }) {
  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-md">
      <MapContainer
        center={[26.9124, 75.7873]}
        zoom={12}
        className="w-full h-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {reports.map((report) => {
          const latitude = report.location?.latitude;
          const longitude = report.location?.longitude;

          if (latitude == null || longitude == null) {
            return null;
          }

          return (
            <Marker
              key={report._id}
              position={[latitude, longitude]}
            >
              <Popup>
                <div>
                  <strong>{report.title}</strong>

                  <p>{report.location?.address}</p>

                  <p>
                    Severity: <strong>{report.severity}</strong>
                  </p>

                  <p>
                    Status: <strong>{report.status}</strong>
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default ReportMap;