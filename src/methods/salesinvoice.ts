import { NetvisorApiClient } from "..";
import { NetvisorMethod } from "./_method";

export class NetvisorSalesMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);
    
    this._endpointUri = 'salesinvoice.nv';
  }

}