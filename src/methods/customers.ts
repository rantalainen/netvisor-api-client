import { NetvisorApiClient } from '..';
import { NetvisorMethod } from './_method';
import * as xml2js from 'xml2js';
import * as js2xmlparser from 'js2xmlparser';

export interface ICustomerList {
  netvisorKey: string;
  name: string;
  code: string;
  externalidentifier: string;
  param?: any;
}

export interface ICustomer {
  customer: {
    customerbaseinformation: {
      internalidentifier: string;
      externalidentifier?: string;
      name: string;
      streetaddress: string;
      city: string;
      postnumber: string;
      country: {
        '@': { type: string };
        '#': string;
      };
      emailinvoicingaddress?: string;

      param?: any;
    };

    customerfinvoicedetails?: {
      finvoiceaddress: string;
      finvoiceroutercode: string;
    };

    param?: any;
  };
}

export interface INvCustomer {
  customerBaseInformation: {
    NetvisorKey?: string;
    InternalIdentifier?: string;
    ExternalIdentifier?: string;
    OrganizationUnitNumber?: string;
    Name?: string;
    NameExtension?: string;
    StreetAddress?: string;
    AdditionalStreetAddress?: string;
    City?: string;
    PostNumber?: string;
    Country?: string;
    Email?: string;
    EmailInvoicingAddress?: string;
    IsActive?: string;

    [param: string]: any;
  };

  customerFinvoiceDetails: {
    FinvoiceAddress?: string;
    FinvoiceRouterCode?: string;
  };

  customerAdditionalInformation: {
    Comment?: string;
    PriceGroup?: string;
    InvoicingLanguage?: string;

    [param: string]: any;
  };

  [param: string]: any;
}

export class NetvisorCustomerMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);

    this._endpointUri = 'customer.nv';
  }

  /**
   * Save one customer as customer object
   * @param dataset as ICustomer
   * @param params as parameters with {method: add}
   * if editing customer {method: add/edit, id: netvisorkey}
   */
  async saveCustomerByDataSet(dataset: ICustomer, params: any) {
    const xml = js2xmlparser.parse('Root', dataset);

    return await this._client.post(this._endpointUri, xml.replace("<?xml version='1.0'?>", ''), params);
  }

  /**
   * Get customers from Netvisor
   * @param params to narrow search with keyword or netvisor key
   */
  async getCustomers(params?: any): Promise<ICustomerList[]> {
    const customersRaw = await this._client.get('customerlist.nv', params);

    var parser = new xml2js.Parser();

    const customerList: Array<any> = await new Promise(async (resolve, reject) => {
      parser.parseString(customersRaw, (error: string, xmlResult: any) => {
        if (error) return reject(error);

        const status: any = xmlResult.Root.ResponseStatus[0].Status;

        const json: any = xmlResult.Root.Customerlist[0].Customer;

        if (status[0] === 'OK') {
          resolve(json);
        } else {
          reject(status[1]);
        }
      });
    });

    // customerList returns undefined if no customers in search criteria
    if (!customerList) {
      return [];
    }

    const customers = [];
    for (const item of customerList) {
      const customer = {
        netvisorKey: item.Netvisorkey[0],
        name: item.Name[0],
        code: item.Code[0],
        externalidentifier: item.OrganisationIdentifier[0],
        customerGroupName: item.CustomerGroupName[0]
      };
      customers.push(customer);
    }

    return customers;
  }

  /**
   * Get customer from Netvisor using netvisorKey
   */
  async getCustomerByNetvisorKey(netvisorKey: string): Promise<INvCustomer> {
    const customerRaw = await this._client.get('getcustomer.nv', { id: netvisorKey });

    var parser = new xml2js.Parser();

    const _customer: any = await new Promise(async (resolve, reject) => {
      parser.parseString(customerRaw, (error: string, xmlResult: any) => {
        if (error) return reject(error);

        const status: any = xmlResult.Root.ResponseStatus[0].Status;
        const json: any = xmlResult.Root.Customer[0];

        if (status[0] === 'OK') {
          resolve(json);
        } else {
          reject(status[1]);
        }
      });
    });

    const customerBaseInformation: any = {};
    for (const [key, value] of Object.entries(_customer.CustomerBaseInformation[0])) {
      const newValue: any = value;
      if (typeof newValue[0] === 'object') {
        customerBaseInformation[key] = newValue[0]['_'];
      } else {
        customerBaseInformation[key] = newValue[0];
      }
    }

    const customerFinvoiceDetails: any = {};
    for (const [key, value] of Object.entries(_customer.CustomerFinvoiceDetails[0])) {
      const newValue: any = value;
      customerFinvoiceDetails[key] = newValue[0];
    }

    const customerDeliveryDetails: any = {};
    for (const [key, value] of Object.entries(_customer.CustomerDeliveryDetails[0])) {
      const newValue: any = value;
      if (typeof newValue[0] === 'object') {
        customerDeliveryDetails[key] = newValue[0]['_'];
      } else {
        customerDeliveryDetails[key] = newValue[0];
      }
    }

    const customerContactDetails: any = {};
    for (const [key, value] of Object.entries(_customer.CustomerContactDetails[0])) {
      const newValue: any = value;
      customerContactDetails[key] = newValue[0];
    }

    const customerContactPersons: any = {};
    for (const [key, value] of Object.entries(_customer.CustomerContactPersons[0])) {
      const newValue: any = value;
      customerContactPersons[key] = newValue[0];
    }

    const customerAdditionalInformation: any = {};
    for (const [key, value] of Object.entries(_customer.CustomerAdditionalInformation[0])) {
      const newValue: any = value;
      if (typeof newValue[0] === 'object') {
        customerAdditionalInformation[key] = newValue[0]['_'];
      } else {
        customerAdditionalInformation[key] = newValue[0];
      }
    }

    const customer = {
      customerBaseInformation,
      customerFinvoiceDetails,
      customerDeliveryDetails,
      customerContactDetails,
      customerContactPersons,
      customerAdditionalInformation
    };

    return customer;
  }
}
