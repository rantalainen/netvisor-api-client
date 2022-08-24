import { NetvisorApiClient } from '..';
import { NetvisorMethod } from './_method';
import * as js2xmlparser from 'js2xmlparser';

type CompensationType = ' domesticfull' | 'domestichalf' | 'foreign';
type TravelType =
  | 'car'
  | 'car_with_trailer'
  | 'car_with_caravan'
  | 'car_with_heavy_cargo'
  | 'car_with_big_machinery'
  | 'car_with_dog'
  | 'car_travel_in_rough_terrain'
  | 'motorboat_max_50hp'
  | 'motorboat_over_50hp'
  | 'snowmobile'
  | 'atv'
  | 'motorbike'
  | 'moped'
  | 'other'
  | 'carbenefit';
type Dimensions = {
  dimensionname: string;
  dimensionitem: string;
};

export interface ITripexpense {
  header: string;
  description: string;
  travellines?: ITravelLine[];
  dailycompensationlines?: IDailyCompensationLine[];
  [key: string]: any;
}

export interface ITravelLine {
  travelline: {
    employeeidentifier: { '@': { type: string }; '#': string };
    traveltype: TravelType;
    passengeramount: number;
    kilometeramount: number;
    unitprice?: number;
    linedescription: string;
    traveldate: string;
    routedescription: string;
    dimension?: Dimensions;
    [key: string]: any;
  };
}

export interface IDailyCompensationLine {
  dailycompensationline: {
    employeeidentifier: { '@': { type: string }; '#': string };
    compensationtype: CompensationType;
    amount: number;
    unitprice?: number;
    linedescription: string;
    timeofdeparture: string;
    returntime: string;
    dimension?: Dimensions;
    [key: string]: any;
  };
}

export class NetvisorTripexpenseMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);

    this._endpointUri = 'tripexpense.nv';
  }

  /**
   * Save workday hours per employee
   * @param dataset as ITripexpense
   */
  async saveTripByDataSet(dataset: ITripexpense) {
    const xml = js2xmlparser.parse('Root', { tripexpense: dataset });

    return await this._client.post(this._endpointUri, xml.replace("<?xml version='1.0'?>", ''));
  }
}
