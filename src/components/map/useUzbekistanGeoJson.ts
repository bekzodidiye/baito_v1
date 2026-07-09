import { useState, useEffect } from 'react';
import { shiftGeoJson, LNG_OFFSET, LAT_OFFSET, formatDistrictName } from '../mapUtils';

export interface GeoJsonData {
  geoJsonData: any;
  districtsGeoJsonData: any;
}

export const useUzbekistanGeoJson = (): GeoJsonData => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [districtsGeoJsonData, setDistrictsGeoJsonData] = useState<any>(null);

  useEffect(() => {
    fetch('/uzbekistan_regions_std.geojson')
      .then(res => res.json())
      .then(data => {
        const shiftedData = shiftGeoJson(data, LNG_OFFSET, LAT_OFFSET);
        setGeoJsonData(shiftedData);
      })
      .catch(err => console.error("Error loading GeoJSON:", err));

    fetch('/uzbekistan_districts.geojson')
      .then(res => res.json())
      .then(data => {
        const shiftedData = shiftGeoJson(data, LNG_OFFSET, LAT_OFFSET);
        if (shiftedData && shiftedData.features) {
          shiftedData.features = shiftedData.features.map((f: any) => {
            if (f.properties && f.properties.shapeName) {
              return {
                ...f,
                properties: {
                  ...f.properties,
                  shapeName: formatDistrictName(f.properties.shapeName)
                }
              };
            }
            return f;
          });
        }
        setDistrictsGeoJsonData(shiftedData);
      })
      .catch(err => console.error("Error loading Districts GeoJSON:", err));
  }, []);

  return { geoJsonData, districtsGeoJsonData };
};
