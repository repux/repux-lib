export interface DataLocation {
  /**
   * It specifies if data is global (if it is set to true, other fields should be omitted)
   */
  global: boolean;

  /**
   * List of countries
   */
  countries: string[];

  /**
   * List of regions
   */
  regions: string[];

  /**
   * List of cities
   */
  cities: string[];
}
