import { readFileSync } from 'node:fs';
import { writeFileSync } from 'node:fs';
import { v4 as uuidv4 } from 'uuid';

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    //const cities: City[] = await JSON.parse(readFileSync('../../db/searchHistory.json', 'utf8'));
    try {
      return await JSON.parse(readFileSync('db/searchHistory.json', 'utf8'));
    } catch(err) {
      console.error('Error reading or parsing JSON file', err);
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    try{
      return await writeFileSync('db/searchHistory.json', JSON.stringify(cities), 'utf8');
    } catch(err) {
      console.error('Error writing to JSON file', err);
    }
    
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const readCity = await this.read();
    return await readCity.map((item:any) => new City(item.name, item.id));
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {  
    const allCities: City[] = await this.getCities();
    const newId: string = uuidv4();
    const newCity: City = new City(city, newId);
    allCities.push(newCity)
    return await this.write(allCities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();
