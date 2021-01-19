import { NetvisorApiClient } from "..";

export class NetvisorMethods {
  _client!: NetvisorApiClient;
  _endpointUri!: string;

  constructor(client: NetvisorApiClient) {
    Object.defineProperty(this, '_client', {
      enumerable: false,
      value: client
    });
  }

}