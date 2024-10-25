import React, { useEffect, useRef } from 'react';

// Caching the script load promise to avoid reloading
let googleMapsScriptPromise;

const loadGoogleMapsScript = () => {
  if (!googleMapsScriptPromise) {
    googleMapsScriptPromise = new Promise((resolve, reject) => {
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
  }
  
  return googleMapsScriptPromise;
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

    // Cleanup when the component is unmounted
    return () => {
      if (map) {
        // Optionally, you could clean up the map instance if needed
        // Example: map = null;
      }
    };
  }, [latitude, longitude]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '400px' }}
    />
  );
};

export default MapComponent;
