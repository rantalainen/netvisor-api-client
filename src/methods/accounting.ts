import { NetvisorApiClient } from "..";
import fs from 'fs';
import path from 'path';
import { NetvisorMethod } from "./_method";


export class NetvisorAccountingMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);

    this._endpointUri = 'accounting.nv';
  }
  

  /**
   * Get vouchers from Netvisor accounting
   * @param startDate mandatory
   * @param endDate mandatory
   */
   async getVouchers(startDate: string, endDate: string) : Promise<any> {

    const vouchers = await this._client.get(`accountingledger.nv`, {
      startdate : startDate,
      enddate : endDate
    });
    return vouchers;
  }

}