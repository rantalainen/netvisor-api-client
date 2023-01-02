import { NetvisorApiClient } from '..';
import * as xml2js from 'xml2js';
import { NetvisorMethod } from './_method';
import { IVendor } from '../intefaces/vendors';

export class NetvisorVendorMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);

    this._endpointUri = 'getvendor.nv';
  }

  /**
   * Get vendor(s) from Netvisor
   * See queryparams from Netvisor support page
   */
  async getVendors(params: object): Promise<IVendor[]> {
    const raw = await this._client.get(this._endpointUri, params);

    const parser = new xml2js.Parser();

    const vendorList: Array<any> = await new Promise(async (resolve, reject) => {
      parser.parseString(raw, (error: string, xmlResult: any) => {
        if (error) return reject(error);

        const status: any = xmlResult.Root.ResponseStatus[0].Status;
        const json: any = xmlResult.Root.Vendors ? xmlResult.Root.Vendors[0].Vendor : xmlResult.Root.Vendor;

        if (status[0] === 'OK') {
          resolve(json);
        } else {
          reject(status[1]);
        }
      });
    });

    // productList returns undefined if no products in search criteria
    if (!vendorList) {
      return [];
    }

    const vendors: IVendor[] = [];
    for (const item of vendorList) {
      const domesticBankAccounts = [];
      if (
        !!item.VendorBaseInformation[0].VendorBankAccounts &&
        !!item.VendorBaseInformation[0].VendorBankAccounts[0].VendorDomesticBankAccounts
      ) {
        for (const account of item.VendorBaseInformation[0].VendorBankAccounts[0].VendorDomesticBankAccounts[0].VendorDomesticBankAccount) {
          const accountObj = {
            NetvisorKey: account.NetvisorKey[0],
            IBAN: account.IBAN[0],
            BankName: account.BankName[0],
            IsDefault: account.IsDefault[0]
          };
          domesticBankAccounts.push(accountObj);
        }
      }

      const foreignBankAccounts = [];
      if (
        !!item.VendorBaseInformation[0].VendorBankAccounts &&
        !!item.VendorBaseInformation[0].VendorBankAccounts[0].VendorForeignBankAccounts
      ) {
        for (const account of item.VendorBaseInformation[0].VendorBankAccounts[0].VendorForeignBankAccounts[0].VendorForeignBankAccount) {
          const accountObj = {
            NetvisorKey: account.NetvisorKey[0],
            BBAN: account.BBAN[0],
            BicSwift: account.BicSwift[0],
            BankName: account.BankName[0],
            ClearingCode: account.ClearingCode[0],
            ClearingNumber: account.ClearingNumber[0],
            BankAddress: account.BankAddress[0],
            Country: account.Country[0]._ || '',
            CurrencyCode: account.CurrencyCode[0]._ || '',
            IsDefault: account.IsDefault[0],
            IncludeAddressInForeignPayments: account.IncludeAddressInForeignPayments[0]
          };
          foreignBankAccounts.push(accountObj);
        }
      }

      const vendor: IVendor = {
        NetvisorKey: item.NetvisorKey[0],
        VendorBaseInformation: {
          Code: item.VendorBaseInformation[0].Code[0],
          Name: item.VendorBaseInformation[0].Name[0],
          Address: item.VendorBaseInformation[0].Address[0],
          PostCode: item.VendorBaseInformation[0].PostCode[0],
          City: item.VendorBaseInformation[0].City[0],
          Country: item.VendorBaseInformation[0].Country[0]._ || '',
          OrganizationId: item.VendorBaseInformation[0].OrganizationId[0],
          GroupName: item.VendorBaseInformation[0].GroupName[0],
          VendorBankAccounts: {
            VendorDomesticBankAccounts: domesticBankAccounts,
            VendorForeignBankAccounts: foreignBankAccounts
          }
        },
        VendorContactDetails: {
          PhoneNumber: item.VendorContactDetails[0].PhoneNumber[0],
          Email: item.VendorContactDetails[0].Email[0],
          FaxNumber: item.VendorContactDetails[0].FaxNumber[0],
          ContactPersonName: item.VendorContactDetails[0].ContactPersonName[0],
          ContactPersonPhoneNumber: item.VendorContactDetails[0].ContactPersonPhoneNumber[0],
          ContactPersonEmail: item.VendorContactDetails[0].ContactPersonEmail[0],
          HomePage: item.VendorContactDetails[0].HomePage[0],
          Comment: item.VendorContactDetails[0].Comment[0]
        },
        VendorAdditionalInformation: {
          DefaultVatPercent: item.VendorAdditionalInformation[0].DefaultVatPercent[0],
          IsPartialVatReducePrivileged: item.VendorAdditionalInformation[0].IsPartialVatReducePrivileged[0],
          PaymentTerm: item.VendorAdditionalInformation[0].PaymentTerm[0]
        }
      };

      vendors.push(vendor);
    }
    return vendors;
  }
}
