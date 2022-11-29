import { NetvisorApiClient } from '..';
import * as xml2js from 'xml2js';
import { NetvisorMethod } from './_method';
import * as js2xmlparser from 'js2xmlparser';

export interface INewVoucher {
  calculationmode: string;
  voucherdate: { '@': { format: string }; '#': string };
  description?: string;
  voucherclass: string;
  voucherline: IVoucherLine[];
}

export interface IVoucherLine {
  linesum: { '@': { type: string }; '#': string };
  description?: string;
  accountnumber: string;
  vatpercent: { '@': { vatcode: string }; '#': number | string };
  dimension?: IDimension[];
}

interface IDimension {
  dimensionname: string;
  dimensionitem: string;
}

export class NetvisorAccountingMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);

    this._endpointUri = 'accounting.nv';
  }

  /**
   * Save one voucher as a voucher object
   * @param dataset as INewVoucher
   */
  async saveVoucherByDataSet(dataset: INewVoucher) {
    const xml = js2xmlparser.parse('Root', { voucher: dataset });

    return await this._client.post(this._endpointUri, xml.replace("<?xml version='1.0'?>", ''));
  }

  /**
   * Get vouchers from Netvisor accounting
   * @param startDate mandatory
   * @param endDate mandatory
   */
  async getVouchers(startDate: string, endDate: string): Promise<any> {
    const vouchers = await this._client.get(`accountingledger.nv`, {
      startdate: startDate,
      enddate: endDate
    });
    return vouchers;
  }

  async getDimensions(): Promise<any> {
    // Return dimensionlist from Netvisor
    const dimensionsRaw = await this._client.get('dimensionlist.nv');

    const parser = new xml2js.Parser();

    return await new Promise(async (resolve, reject) => {
      parser.parseString(dimensionsRaw, (error: string, xmlResult: any) => {
        if (error) return reject(error);

        const status: any = xmlResult.Root.ResponseStatus[0].Status;
        const json = xmlResult.Root.DimensionNameList[0].DimensionName;

        if (status[0] === 'OK') {
          resolve(json);
        } else {
          reject(status[1]);
        }
      });
    });
  }

  /**
   * Get account list for budgeting without dimensions
   * @param year mandatory
   * @returns array of budget accounts
   */
  async getBudgetAccountList(year: number): Promise<any> {
    // Return accounting budget account list from Netvisor
    const accountListRaw = await this._client.get('accountingbudgetaccountlist.nv', { year: year });

    const parser = new xml2js.Parser();

    return await new Promise(async (resolve, reject) => {
      parser.parseString(accountListRaw, (error: string, xmlResult: any) => {
        if (error) return reject(error);

        const status: any = xmlResult.Root.ResponseStatus[0].Status;
        const json = xmlResult.Root.AccountingBudgetAccountList[0].Account;

        if (status[0] === 'OK') {
          resolve(json);
        } else {
          reject(status[1]);
        }
      });
    });
  }
}
