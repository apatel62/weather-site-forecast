import { Router, type Request, type Response } from 'express';
const router = Router();


import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const cityString: string = req.body.cityName; //.split(' ').map((charc: string) => charc.charAt(0).toUpperCase() + charc.slice(1).toLowerCase()).join(' ');
  const nWS = new WeatherService(cityString);
  const newCityWeather = await nWS.getWeatherForCity();
  // TODO: save city to search history
  HistoryService.addCity(cityString);
  res.json(newCityWeather);
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  res.send(await HistoryService.getCities());
});

// * BONUS TODO: DELETE city from search history
//router.delete('/history/:id', async (req: Request, res: Response) => {});

export default router;
