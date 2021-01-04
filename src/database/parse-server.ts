import { DatabaseConfig } from "./database-config";

/**
 * ParseServer is a Database implementation that uses the Parse JavaScript SDK.
 * This class is a Singleton and has no public constructor, you must use its `getInstance(...)` method.
 */
export default class ParseServer implements Database {
  private static instance: Database;

  private Parse: any;
  private Event: any;

  /**
   * @param Parse Module from the Parse JavaScript SDK
   * @param AsyncStorage Module from the React Native Async Storage library
   * @returns The same instance of ParseServer that it was first instantiated with
   */
  public static getInstance(Parse: any, AsyncStorage: any): Database {
    if (this.instance == null) {
      this.instance = new ParseServer(Parse, AsyncStorage);
    }

    return this.instance;
  }

  public async getEvents(
    numResults: number,
    pageNumber: number,
    sortBy: string
  ): Promise<any> {
    const query = new this.Parse.Query(this.Event);

    // sort all events in ascending order
    query.ascending(sortBy);
    // skip the results from previous pages
    query.skip(numResults * (pageNumber - 1));
    // limit results to a single page
    query.limit(numResults);

    const results = await query.find();
    return results;
  }

  private constructor(Parse: any, AsyncStorage: any) {
    this.initialize(Parse, AsyncStorage);
  }

  private initialize(Parse: any, AsyncStorage: any): void {
    this.Parse = Parse;
    this.Parse.setAsyncStorage(AsyncStorage);

    // TODO: Set config based on dev or prod environment
    this.Parse.initialize(
      DatabaseConfig.DEV.APP_ID,
      DatabaseConfig.DEV.JAVASCRIPT_KEY
    );
    this.Parse.serverURL = DatabaseConfig.DEV.SERVER_URL;
    this.Event = this.Parse.Object.extend("Event");
  }
}
