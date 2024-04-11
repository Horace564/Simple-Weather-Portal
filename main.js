window.onload = () =>{
    const body = document.body;
    const h1 = document.createElement('h1');
    h1.innerText = 'My Weather Portal';
    const header = document.createElement('div');
    header.id = 'header';
    const titleElement = document.createElement('div');
    titleElement.id = 'title';
    titleElement.innerText = 'Hong Kong';
    const weather = document.createElement('div');
    weather.id = 'weather';
    const UV = document.createElement('div');
    UV.id = 'UV';
    const warnTime = document.createElement('div');
    warnTime.id = 'warn_time';
    const warning = document.createElement('div');
    warning.classList.add('w_t');
    warning.id = 'warning';
    const update = document.createElement('div');
    update.classList.add('w_t');
    update.id = 'update';
    warnTime.appendChild(warning);
    warnTime.appendChild(update);
    header.appendChild(titleElement);
    header.appendChild(weather);
    header.appendChild(UV);
    header.appendChild(warnTime);
    const myData = document.createElement('div');
    myData.id = 'MyData';
    const TRAQ = document.createElement('div');
    TRAQ.id = 'TRAQ';
    const T = document.createElement('div');
    T.id = 'T';
    const R = document.createElement('div');
    R.id = 'R';
    const AQ = document.createElement('div');
    AQ.id = 'AQ';
    TRAQ.appendChild(T);
    TRAQ.appendChild(R);
    TRAQ.appendChild(AQ);
    const forecast = document.createElement('div');
    forecast.id = 'forecast';
    const forecastTitle = document.createElement('div');
    forecastTitle.id="title"
    forecastTitle.innerText = '9-day forecast';
    const nineDays = document.createElement('div');
    nineDays.id = 'nine_days';
    forecast.appendChild(forecastTitle);
    forecast.appendChild(nineDays);
    body.appendChild(h1);
    body.appendChild(header);
    body.appendChild(myData);
    body.appendChild(TRAQ);
    body.appendChild(forecast);

    fetch("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en")
     .then(response =>{
        response.json().then(WR =>{
            let header=document.getElementById('header');
            if (WR.rainfall.data[13].max > 0){
                if (parseInt(WR.updateTime.substr(11,2))>=19 || parseInt(WR.updateTime.substr(11,2))<=6 ){
                    header.style.backgroundImage="url('images/water-drops-glass-night.jpg')";
                    header.style.color="white"
                }
                else{
                    header.style.backgroundImage="url('images/water-drops-glass-day.jpg')";
                }
            }
            else{
                if (parseInt(WR.updateTime.substr(11,2))>=19 || parseInt(WR.updateTime.substr(11,2))<=6 ){
                    header.style.backgroundImage="url('images/night-sky.jpg')";
                    header.style.color="white"
                }
                else{
                    header.style.backgroundImage="url('images/blue-sky.jpg')";
                }
            }

            let inheader="";
            inheader += `<div class="wea"><img src="https://www.hko.gov.hk/images/HKOWxIconOutline/pic${WR.icon[0]}.png" windth="75" height="75"></div>
                        <div class="wea">${WR.temperature.data[1].value}<div id="C_unit">˚C</div></div>
                        <div class="wea">${WR.humidity.data[0].value}
                            <div id="H_unit"><img src="images/drop-64.png" width="30" height="30"><p>%</p></div>
                        </div>
                        <div class="wea">${WR.rainfall.data[13].max}
                            <div id="R_unit"><img src="images/rain-48.png" width="30" height="30"><p>mm</p></div>
                        </div>`;
            let weather=document.getElementById('weather');
            weather.innerHTML=inheader;

            if (WR.uvindex){
                let inUV=""
                inUV += `${WR.uvindex.data[0].value}<img src="images/UVindex-48.png" width="25" height="25">`;
                let UV=document.getElementById('UV');
                UV.innerHTML=inUV;
            }
            if(WR.warningMessage){
                let warn_msg="";
                warn_msg+=` <button id="bttn">Warning</button>`
                warn_msg+=`<div id="msgbox">`
                for (msg of WR.warningMessage){
                    warn_msg += `<p>${msg}</p>`
                }
                warn_msg+=`</div>`
                let warning = document.getElementById('warning');
                warning.innerHTML=warn_msg;
                let msgbox = document.getElementById('msgbox');
                msgbox.style.display = 'none';

                let bttn = document.getElementById('bttn');
                let count=0;
                bttn.addEventListener('click', (evt) =>{
                    let msgbox = document.getElementById('msgbox');
                    count+=1;
                    if (count%2==1){
                        msgbox.style.display = 'block'
                    }
                    else{
                        msgbox.style.display = 'none'
                    }
                });
            }
            let update=document.getElementById('update');
            time=WR.updateTime.substr(11,5)
            update.innerHTML=`Last Update: ${time}`

            let tem=document.getElementById('T');
            let inT="";
            inT+= `<div id="title">Temperature</div>
            <label for="tem" id="tem">Select the location</label><br><br>
            <select name="loc" id="loc"></select>
            <div id="output_T"></div>`
            tem.innerHTML=inT;
            let all_tem = {};
            for(station of WR.temperature.data){
                all_tem[station.place] = station.value;
            }
            let sort_tem_keys = Object.keys(all_tem).sort();
            let sort_tem={};
            for (key of sort_tem_keys){
                sort_tem[key]=all_tem[key];
            }
            let opt_T=`<option value="none"></option>`;
            for (opt of sort_tem_keys){
                opt_T += `<option value="${opt}">${opt}</option>`
            }
            let loc=document.getElementById('loc');
            loc.innerHTML=opt_T;
            let current_t="none"
            loc.addEventListener('change', (evt) =>{
                let select_t=loc.value;
                if (select_t=="none"){
                    output_t=document.getElementById('output_T');
                    output_t.innerHTML="";
                    return;
                }
                if (select_t != current_t){
                    output_t=document.getElementById('output_T');
                    output_t.innerHTML=`<p>${sort_tem[select_t]}</p><p id="C_unit">˚C</p>`
                    current_t=select_t;
                };
            });
            
            let rain=document.getElementById('R');
            let inR="";
            inR+= `<div id="title">Rainfall</div>
            <label for="rain" id="rain">Select the district</label><br><br>
            <select name="dis" id="dis"></select>
            <div id="output_R"></div>`
            rain.innerHTML=inR;
            let all_rain = {};
            for(station of WR.rainfall.data){
                all_rain[station.place] = station.max;
            }
            let sort_rain_keys = Object.keys(all_rain).sort();
            let sort_rain={};
            for (key of sort_rain_keys){
                sort_rain[key]=all_rain[key];
            }
            let opt_R=`<option value="none"></option>`;
            for (opt of sort_rain_keys){
                opt_R += `<option value="${opt}">${opt}</option>`
            }
            let dis=document.getElementById('dis');
            dis.innerHTML=opt_R;
            let current_r="none"
            dis.addEventListener('change', (evt) =>{
                let select_r=dis.value;
                if (select_r=="none"){
                    output_r=document.getElementById('output_R');
                    output_r.innerHTML="";
                    return;
                }
                if (select_r != current_r){
                    output_r=document.getElementById('output_R');
                    output_r.innerHTML=`<p>${sort_rain[select_r]}</p><p id="R_unit">mm</p>`
                    current_r=select_r;
                };
            });
        });
     });

     fetch(" https://dashboard.data.gov.hk/api/aqhi-individual?format=json")
     .then(response =>{
        response.json().then(AQHI =>{
            console.log(AQHI)
            let aq=document.getElementById('AQ');
            let inAQ="";
            inAQ+= `<div id="title">Air Quality</div>
            <label for="aq" id="aq">Select the AQ Station</label><br><br>
            <select name="sta" id="sta"></select>
            <div id="output_AQ"></div>`
            aq.innerHTML=inAQ;
            let all_aq = {};
            let all_risk={};
            for(stations of AQHI){
                all_aq[stations.station] = stations.aqhi;
                all_risk[stations.station] = stations.health_risk;
            }
            let sort_aq_keys = Object.keys(all_aq).sort();
            let sort_aq={};
            for (key of sort_aq_keys){
                sort_aq[key]=all_aq[key];
            }
            let opt_aq=`<option value="none"></option>`;
            for (opt of sort_aq_keys){
                opt_aq += `<option value="${opt}">${opt}</option>`
            }
            let sta=document.getElementById('sta');
            sta.innerHTML=opt_aq;
            let current_aq="none"
            aq.addEventListener('change', (evt) =>{
                let select_aq=sta.value;
                if (select_aq=="none"){
                    output_aq=document.getElementById('output_AQ');
                    output_aq.innerHTML="";
                    return;
                }
                if (select_aq != current_aq){
                    output_aq=document.getElementById('output_AQ');
                    output_aq.innerHTML=`<p>Level: ${sort_aq[select_aq]}</p><p>Risk: ${all_risk[select_aq]}</p>`
                    current_aq=select_aq;
                };
            });
        });
    });

        
    fetch("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en")
        .then(response =>{
        response.json().then(WF =>{
            console.log(WF);
            let In_nine_days="";
            for(day of WF.weatherForecast){
                week=day.week.substr(0,3);
                d_mon=parseInt(day.forecastDate.substr(4,1))*10 + parseInt(day.forecastDate.substr(5,1));
                d_day=parseInt(day.forecastDate.substr(6,1))*10 + parseInt(day.forecastDate.substr(7,1));
                console.log(d_mon)
                In_nine_days+=`<div id="day">
                                <p>${week} ${d_day}/${d_mon}</p>
                                <img src="https://www.hko.gov.hk/images/HKOWxIconOutline/pic${day.ForecastIcon}.png" id="for_icon" width="30" height="30"><br>
                                <img src="images/PSR${day.PSR}.png" id="for_icon" width="30" height="30">
                                <p id="for_p">${day.forecastMintemp.value}-${day.forecastMaxtemp.value}˚C</p>
                                <p id="for_p">${day.forecastMinrh.value}-${day.forecastMaxrh.value}%</p>
                                </div> `
                let nine_days=document.getElementById('nine_days');
                nine_days.innerHTML=In_nine_days;
            }
        });
    });

    Wea_Sta={};
    fetch('https://ogciopsi.blob.core.windows.net/dataset/weather-station/weather-station-info.json')
     .then(response =>{
        response.json().then(WS =>{
            console.log("aaaaaa: ",WS);
            for (sta of WS){
                Wea_Sta[sta.station_name_en]={"lat": sta.latitude, "lon": sta.longitude};
            }
        });
     });

     AQ_Sta={};
     fetch("Data/aqhi-station-info.json")
      .then(response =>{
        response.json().then(AQS =>{
            console.log("AQS:",AQS)
            for (sta of AQS){
                AQ_Sta[sta.station]={"lat": sta.lat, "lon": sta.lng};
            }
        });
      });
      console.log("AQ: ",AQ_Sta);

/**/////////////////////////////////////////**/

    function getCurrentLocation(callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    callback(latitude, longitude); //similar to return (latitude, longitude)
                },
                function(error) {
                    console.log("Error: ", error.code);
                }
            );
        } 
        else {
            console.log("Geolocation is not supported by this browser");
        }
    }
    let my_suburb;
    let my_district;
    getCurrentLocation(function(my_lat, my_lon) {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${my_lat}&lon=${my_lon}&zoom=18&addressdetails=1`)
         .then(response =>{
            response.json().then(Addr =>{
                if (Addr.address.suburb){
                    my_suburb=Addr.address.suburb;
                }
                else if(Addr.address.borough){
                    my_suburb=Addr.address.borough;
                }
                else if (Addr.address.town){
                    my_suburb=Addr.address.town;
                }
                else{
                    my_suburb='Unknown'
                }
                console.log("mysub: ",my_suburb)
                if (Addr.address.city_district){
                    my_district=Addr.address.city_district;
                }
                else{
                    for (key in Addr.address){
                        if ((Addr.address[key].includes('District'))){
                            my_district=Addr.address[key];
                            break
                        }
                        else{
                            my_district='Unknown';
                        }
                    }
                }
            console.log("mysub2: ",my_district);
            let Wea_sta_by;
            let count =0;
            let min;
            for (i in Wea_Sta){
                if (i=="Shek Kong"){
                    continue;
                }
                console.log("i: ",i);
                let cu_lat=(Wea_Sta[i].lat)*Math.PI/180;
                let cu_lon=(Wea_Sta[i].lon)*Math.PI/180;
                let my_lat_r=my_lat*Math.PI/180;
                let my_lon_r=my_lon*Math.PI/180;
                let x = (my_lon_r - cu_lon) * Math.cos((my_lat_r + cu_lat)/2);
                let y = my_lat_r -cu_lat;
                let d = Math.sqrt(x*x + y*y) * 6371
                if (count == 0){
                    min=d;
                    Wea_sta_by=i;
                }
                else{
                    if(d<min){
                        Wea_sta_by=i;
                        min=d;
                    }
                }
                count++;
            }
            console.log("near: ",Wea_sta_by)

            let AQ_sta_by;
            let count2 =0;
            let min2;
            for (i in AQ_Sta){
                console.log("i: ",i);
                let cu_lat=(AQ_Sta[i].lat)*Math.PI/180;
                let cu_lon=(AQ_Sta[i].lon)*Math.PI/180;
                let my_lat_r=my_lat*Math.PI/180;
                let my_lon_r=my_lon*Math.PI/180;
                let x = (my_lon_r - cu_lon) * Math.cos((my_lat_r + cu_lat)/2);
                let y = my_lat_r -cu_lat;
                let d = Math.sqrt(x*x + y*y) * 6371
                if (count2 == 0){
                    min2=d;
                    AQ_sta_by=i;
                }
                else{
                    if(d<min2){
                        AQ_sta_by=i;
                        min2=d;

                    }
                }
                count2++;
            }
            console.log("near: ",AQ_sta_by);

            let in_mydata=`<div id="title">My location</div>
                            <div>${my_suburb}, ${my_district}</div>
                            <div id="my_wea"></div>`
            let mydata=document.getElementById('MyData');
            mydata.innerHTML+=in_mydata;
            fetch("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en")
            .then(response =>{
                response.json().then(WR =>{
                    let in_mydata="";
                    for (i of WR.temperature.data){                      
                        if (i.place == Wea_sta_by){
                            in_mydata+=`<div class="my_wea" id="blk1">${i.value}<div id="C_unit">˚C</div></div>`
                        }
                    }
                    for (i of WR.rainfall.data){
                        console.log("lll",my_district,i.place)
                        if (my_district.includes(i.place)){
                            in_mydata+=`<div class="my_wea" id="blk2">${i.max}
                                <div><img src="images/rain-48.png" width="25" height="25"><p>mm</p></div></div>`
                        }
                    }
                    let mydata=document.getElementById('my_wea');
                    mydata.innerHTML+=in_mydata;
                });

});

            fetch(" https://dashboard.data.gov.hk/api/aqhi-individual?format=json")
            .then(response =>{
                response.json().then(AQHI =>{
                    let in_mydata="";
                    for (i of AQHI){
                        if (i.station == AQ_sta_by){
                             in_mydata += `<div class="my_wea" id="blk3">
                                        <img src="images/aqhi-${i.health_risk.toLowerCase()}.png" width="35" height="60">
                                    <div id="blk3_child"><p>${i.aqhi}</p><p>${i.health_risk}</p></div></div>`
                        }
                    }
                    let mydata=document.getElementById('my_wea');
                    mydata.innerHTML+=in_mydata;
                });
            });





         });
        });
    });




    
        
}