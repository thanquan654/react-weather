import { useEffect, useState } from 'react'
import './App.scss'
import { FaSearchLocation, FaCity } from "react-icons/fa";
import { FiWind } from "react-icons/fi";
import axios from 'axios';
import { IoWaterOutline, IoCloudOutline, IoSunny, IoRainyOutline } from "react-icons/io5";
import { PiThermometerCold } from "react-icons/pi";
import ReactLoading from 'react-loading';

function App() {
  const API_KEY = import.meta.env.VITE_API_KEY
  const [ loading, setLoading ] = useState(true) 
  const [ isError, setIsError ] = useState(false)
  const [ searchInput, setSearchInput ] = useState('Bac Giang')
  const [ weatherData, setWeatherData] = useState({})
  const [ locationData, setLocationData ] = useState({})
  const [ forecastData, setForecastData ] = useState([])
  
  const airConditionalLabel = [
    {
      label: "Tốc độ gió",
      data: "weatherData.wind_kph",
      icon: FiWind,
      measurement: "km/h"
    },
    {
      label: "Độ ẩm", 
      data: "weatherData.humidity",
      icon: IoWaterOutline,
      measurement: "%"
    },
    {
      label: "Cảm giác",
      data: "weatherData.feelslike_c",
      icon: PiThermometerCold,
      measurement: "°"
    },
    {
      label: "Mây",
      data: "weatherData.cloud",
      icon: IoCloudOutline,
      measurement: "%"},
    {
      label: "UV",
      data: "weatherData.uv",
      icon: IoSunny,
      measurement: ""},
    {
      label: "Khả năng mưa", 
      data: "weatherData.daily_chance_of_rain",
      icon: IoRainyOutline,
      measurement: "%"
    }
  ]
  const todayForecastLabel = [
    {
      time: "06:00 AM",
      data: "forecastData[0]?.hour[6]"
    },
    {
      time: "09:00 AM",
      data: "forecastData[0]?.hour[9]"
    },
    {
      time: "12:00 PM",
      data: "forecastData[0]?.hour[12]"
    },
    {
      time: "03:00 PM",
      data: "forecastData[0]?.hour[15]"
    },
    {
      time: "06:00 PM",
      data: "forecastData[0]?.hour[18]"
    },
    {
      time: "09:00 PM",
      data: "forecastData[0]?.hour[21]"
    }
  ]

  function toNonAccentVietnamese(str) {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
  }
  const getWeatherInformation = async () => {
    setIsError(false)
    setLoading(true)
    await axios.get('https://api.weatherapi.com/v1/forecast.json', { 
      params: {
        key: API_KEY,
        q: toNonAccentVietnamese(searchInput),
        aqi: "yes",
        lang: "vi",
        days: 5,
      }
    })
    .then(res => {
      setSearchInput(res.data.location.name)
      setLocationData(res.data.location)
      setWeatherData({
        ...res.data.current,
        daily_chance_of_rain: res.data.forecast.forecastday[0].day.daily_chance_of_rain
      })
      setForecastData(res.data.forecast.forecastday)
      
    })
    .catch(err => setIsError(true))
    .finally(() => {
      setLoading(false)
    })
  }
  const handleSearchWeather = () => {
    getWeatherInformation()
  }

  useEffect(() => {
    getWeatherInformation()
  }, [])



  return (
  <>
    <div className="container">
      <div className="search-bar">
        <FaCity className='search-icon'/>
        <input type="text" spellCheck='false'
          className='search-input'
          placeholder='Tìm kiếm thời tiết tại thành phố ...'
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => {if (e.key == "Enter") {handleSearchWeather()}}}
        />
        <FaSearchLocation className='search-icon clickable'
          onClick={handleSearchWeather}
        />
      </div>

      <div className="weather-information">
        <div className="realtime">
          <div className="realtime-temp">
            <div className="left">
              <div className="city-name">{locationData?.name}, {locationData?.country}</div>
              <div className="temp">{weatherData?.temp_c}°</div>
            </div>
            <div className="right">
              <img src={weatherData?.condition?.icon || "https://source.unsplash.com/random"} alt="Weather icon" width={100} height={100}/>          
              <div className='text'>{weatherData?.condition?.text || `Unknown`}</div>
            </div>
          </div>

          <div className="today-forecast">
            <div className="title">{`Thời tiết hôm nay`}</div>
            <ul className='today-forecast-list'>
              {todayForecastLabel.map(hour => {
                return (
                  <li className='today-forecast-item' key={eval(hour.data)?.time_epoch}>
                    <div className="hour">{hour.time}</div>
                    <img src={eval(hour.data)?.condition.icon} alt="" width={50} height={50}/>
                    <div className="temp">{eval(hour.data)?.temp_c + "°"}</div>
                  </li>
                )
              })}         
            </ul>
          </div>

          <div className="air-conditions">
          <div className="title">{`Chỉ số thời tiết`}</div>
            <ul className='air-conditions-list'>
              {airConditionalLabel.map((condition, index) => {
                return (
                  <li className="air-conditions-item" key={index}>
                    <div className="left"><condition.icon /></div>
                    <div className="right">
                      <div className="item-title">{condition.label}</div>
                      <div className="item-value">{eval(condition.data) + " " + condition.measurement}</div>
                    </div>
                  </li>
                )
              })}            
            </ul>
          </div>
        </div>

        <div className="future-forecast">
          <div className="title">{`Dự báo thời tiết`}</div>
          <ul className="future-forecast-list">
            {forecastData.map((day) => {
              let date = new Date(day?.date)
              let dateStr = `${date.getDate()}-${date.getMonth()+1}`
              return (
                <li className="future-forecast-item" key={day?.date_epoch}>
                  <div className="day">{dateStr}</div>
                  <div className="weather">
                    <img src={day?.day.condition.icon} alt="" width={50} height={50}/>
                    <span>{day?.day.condition.text}</span>
                  </div>
                  <div className="temp">
                    <span className="max">{day?.day.maxtemp_c}</span>  
                    <span className="min">/{day?.day.mintemp_c}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {loading && <div className="loading">
          <ReactLoading type="spinningBubbles" color="#d8dce2" height={100} width={100} />
        </div>}
        {isError && <div className="loading">
          Không tìm thấy thành phố nào!
        </div>}
      </div>  
    </div>
  </>
  )
}

export default App
