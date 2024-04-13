# Simple_Weather_Protal


## Functionality
This simple local application display  
i) Current weather condition of Hong Kong  
ii) Temperature, Rainfall, Air Quality condition of your location  
iii) Temperature, Rainfall, Air Quality of selected districts/locations  
iv) 9-day weather forecast of Hong Kong  


## source code
index.html: empty content, the templete of the web page will be dynamically generated when main.js being executed
main.css: styling file
main.js: 
  generate Document Object Model of the application; 
  fetch open data from several APIs and process the returned data
  implement envent handlers for user's events

  
## APIs: 
i) HKO: https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en  
ii) static weather stations info: https://ogciopsi.blob.core.windows.net/dataset/weather-station/weather-station-info.json  
iii) OGCIO Air Quatity Monitoring Stations: https://dashboard.data.gov.hk/api/aqhi-individual?format=json  
iv) Geolocation:  https://nominatim.openstreetmap.org/reverse?format=json&lat=<value>&lon=<value>&zoom=18&addressdetails=1; need to specifies latitude and longitude
