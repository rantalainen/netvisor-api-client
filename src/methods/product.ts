import { NetvisorApiClient } from "..";
import { NetvisorMethod } from "./_method";

export class NetvisorProductMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);
    //https://integration.netvisor.fi/product.nv?method=add
    this._endpointUri = 'product.nv';
  }

  /**
   * Get product list from Netvisor
   * @param keyword to narrow search with name or product code
   */
   async getProducts(keyword?: string) : Promise<any> {

    const products = await this._client.get('productlist.nv', {keyword: keyword});
    return products;
  }

}