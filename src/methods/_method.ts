import { NetvisorApiClient } from '..';
import * as xml2js from 'xml2js';

export class NetvisorMethod {
  protected _client!: NetvisorApiClient;

  constructor(client: NetvisorApiClient) {
    Object.defineProperty(this, '_client', {
      enumerable: false,
      value: client
    });
  }

  /**
   * Save xml batch to Netvisor (e.g. invoice, voucher)
   * @param resource Integration resource endpoint, e.g. 'getsalesinvoice.nv' or 'getpurchaseinvoice.nv'
   * @param fileContents xml data in string
   * @param options method for adding or editing data, plus other possible options
   */
  async saveByXmlData(resource: string, fileContents: string, options?: {}): Promise<any> {
    if (!options) options = { method: 'add' };
    return await this._client.post(resource, fileContents, options);
  }

  /**
   * Get the raw xml response from Netvisor with given resource.
   * If none of the other methods work for your needs or you need the raw xml, use this.
   * @param resource Integration resource endpoint, e.g. 'getsalesinvoice.nv' or 'getpurchaseinvoice.nv'
   * @param params Parameters supported by the given resource endpoint. Check the supported parameters from Netvisor documentation.
   */
  async getXmlData(resource: string, params?: {}): Promise<string> {
    return await this._client.get(resource, params);
  }
}

// Other functions to share among methods

export function parseXml(xml: string): any {
  const xmlParser = new xml2js.Parser({
    attrkey: 'attr',
    charkey: 'value',
    explicitArray: false,
    normalizeTags: true,
    attrNameProcessors: [(name) => name.toLowerCase()]
  });
  let xmlObject: any;
  xmlParser.parseString(xml, (error: any, result: any) => {
    const responseStatus = result?.root?.responsestatus?.status;
    if (responseStatus === 'OK') {
      xmlObject = result.root;
      delete xmlObject.responsestatus;
    }
  });
  return xmlObject;
}

export function buildXml(obj: Object): string {
  const xmlBuilder = new xml2js.Builder({ attrkey: 'attr', charkey: 'value', headless: true });
  const xmlString: string = xmlBuilder.buildObject(obj);
  return xmlString;
}

export function forceArray<T>(item: Array<T> | T): Array<T> {
  return !Array.isArray(item) ? [item] : item;
}
