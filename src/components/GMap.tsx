import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';


interface googleMapProps {
  lat: number
  lng: number
}

const containerStyle = {
  width: '400px',
  height: '400px'
};

const GMap = (position: googleMapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY
  })

  const center = {
    lat: position.lat,
    lng: position.lng
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}

    >
      <MarkerF position={center} />
    </GoogleMap>
  ) : <></>
}

export default GMap;