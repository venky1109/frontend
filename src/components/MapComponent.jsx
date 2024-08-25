import React, { useEffect, useRef } from 'react';

const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (error) => reject(error);
    document.head.appendChild(script);
  });
};

const MapComponent = ({ latitude, longitude }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    let map;
    
    const initializeMap = async () => {
      try {
        await loadGoogleMapsScript();

        map = new window.google.maps.Map(mapRef.current, {
          center: { lat: latitude, lng: longitude },
          zoom: 15,
        });

        new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map,
          title: 'Your Location',
        });
      } catch (error) {
        console.error('Google Maps script loading failed:', error);
      }
    };

    if (latitude && longitude) {
      initializeMap();
    }
  }, [latitude, longitude]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '400px' }}
    />
  );
};

export default MapComponent;
