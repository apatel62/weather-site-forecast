import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
//name, lat, lon, country, state
interface Coordinates{
  name: string;
  lat: string;
  lon: string;
  country: string;
}
// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(city: string, date: string, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number){
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }

  toJSON() {
    return{
      city: this.city,
      date: this.date,
      icon: this.icon,
      iconDescription: this.iconDescription,
      tempF: this.tempF,
      windSpeed: this.windSpeed,
      humidity: this.humidity
    };
  }
  
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseURL: string;
  APIKey: string;
  city: string;

  //process.env.API_BASE_URL
  //process.env.API_KEY
  constructor(city: string) {
    this.city = city;
    this.baseURL = process.env.API_BASE_URL || "";
    this.APIKey = process.env.API_KEY || "";  
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    //does an error check for URL & APIKey
    const response = await fetch(query);
    if(!response.ok) {
      throw new Error('Cannot fetch location data!');
    }
    const fetchData = await response.json();
    const coor: Coordinates = {
      name: fetchData.name,
      lat: fetchData.coord.lat,
      lon: fetchData.coord.lon,
      country: fetchData.sys.country,
    };
    return coor; 
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const {name, lat, lon, country} = locationData;
    return {name, lat, lon, country};
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string { 
    //env baseURL = https://api.openweathermap.org
    //baseURL = `https://api.openweathermap.org/data/2.5/`;
    const cityQuery = `/data/2.5/weather?q=${this.city}&appid=${this.APIKey}`;
    return this.baseURL + cityQuery;

  }
  // TODO: Create buildWeatherQuery method for today's weather
   private buildWeatherQuery(coordinates: Coordinates): string {
    //baseURL = `https://api.openweathermap.org/data/2.5/`;
    const coorQuery = `/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.APIKey}`;
    return this.baseURL + coorQuery;
   }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() { //1
    const fetchCoor = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(fetchCoor);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    //error catching for the fetch
    const response = await fetch(this.buildWeatherQuery(coordinates));
    if(!response.ok) {
      throw new Error('Cannot fetch weather data!');
    }
    const fetchWeather = await response.json();
    return await fetchWeather.list;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const utcTime = new Date(response.dt*1000);
    const month = String(utcTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(utcTime.getUTCDate()).padStart(2, '0');
    const year = utcTime.getUTCFullYear();
    const toF = 1.8*(response.main.temp-273.15) + 32;
    const toMPH = response.wind.speed*2.2369;
    const currentWeather = new Weather(this.city, `${month}/${day}/${year}`, response.weather[0].icon, response.weather[0].description, parseFloat(toF.toFixed(2)), parseFloat(toMPH.toFixed(2)), response.main.humidity);
    return currentWeather;
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    //add currentWeather to weatherData list
    const DailyWeather = weatherData.filter((_, index) => index % 8 === 0);
    const forecastArray: Weather[] = [currentWeather];
    for(const day of DailyWeather) {
      forecastArray.push(this.parseCurrentWeather(day));
    }
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  //city: string
  async getWeatherForCity() {
    const weatherAPIList = await this.fetchWeatherData(await this.fetchAndDestructureLocationData()); //grabs the forecast api list
    const currentWeatherResponse = await fetch(this.buildGeocodeQuery()); //grabs today's weather
    if(!currentWeatherResponse.ok) {
      throw new Error(`Cannot fetch current city weather`);
    }
    const currentCityWeather = await currentWeatherResponse.json();
    const weatherList = this.buildForecastArray(this.parseCurrentWeather(currentCityWeather), weatherAPIList);
    return weatherList;
  }
}

export default WeatherService;
