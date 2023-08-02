import { NetvisorApiClient } from '..';
import { NetvisorMethod, parseXml, buildXml, forceArray } from './_method';
import {
  AccountingLedgerParameters,
  AccountingLedgerVoucher,
  AccountingLedgerVoucherLine,
  AccountingVoucher
} from '../interfaces/accounting';

export class NetvisorAccountingMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);
  }

  /**
   * Get accounting ledger from Netvisor
   * @example await accountingLedger({ startDate: '2023-07-01', endDate: '2023-07-31' })
   * @returns {AccountingLedgerVoucher[]} If no vouchers were retrieved, empty array will be returned.
   */
  async accountingLedger(params?: AccountingLedgerParameters): Promise<AccountingLedgerVoucher[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('accountingledger.nv', params);
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const voucherList: AccountingLedgerVoucher[] = [];
    // Add items to return array
    if (xmlObject.vouchers.voucher) {
      forceArray(xmlObject.vouchers.voucher).forEach((xmlVoucher) => {
        // Create a template for voucher
        const voucherTemplate: AccountingLedgerVoucher = {
          status: xmlVoucher.attr.status,
          netvisorKey: parseInt(xmlVoucher.netvisorkey),
          voucherDate: xmlVoucher.voucherdate,
          voucherNumber: parseInt(xmlVoucher.vouchernumber),
          voucherDescription: xmlVoucher.voucherdescription,
          voucherClass: xmlVoucher.voucherclass,
          linkedSourceNetvisorKey: {
            value: parseInt(xmlVoucher.linkedsourcenetvisorkey.value),
            attr: { type: xmlVoucher.linkedsourcenetvisorkey.attr.type }
          },
          voucherNetvisorUri: xmlVoucher.vouchernetvisoruri,
          voucherLine: []
        };
        // Add the voucher lines to template
        forceArray(xmlVoucher.voucherline).forEach((xmlVoucherLine) => {
          const voucherLineTemplate: AccountingLedgerVoucherLine = {
            netvisorKey: parseInt(xmlVoucherLine.netvisorkey),
            lineSum: parseFloat(xmlVoucherLine.linesum),
            description: xmlVoucherLine.description,
            accountNumber: parseInt(xmlVoucherLine.accountnumber),
            vatPercent: parseInt(xmlVoucherLine.vatpercent),
            vatCode: xmlVoucherLine.vatcode === '-' ? 'NONE' : xmlVoucherLine.vatcode
          };
          // Add account dimension to template if it exists
          if (xmlVoucherLine.accountdimension) {
            voucherLineTemplate.accountDimension = {
              value: xmlVoucherLine.accountdimension.value,
              attr: { netvisorkey: parseInt(xmlVoucherLine.accountdimension.attr.netvisorkey) }
            };
          }
          // Add dimensions to template if they exist
          if (xmlVoucherLine.dimension) {
            voucherLineTemplate.dimension = [];
            forceArray(xmlVoucherLine.dimension).forEach((xmlDimension) => {
              voucherLineTemplate.dimension!.push(xmlDimension);
            });
          }
          voucherTemplate.voucherLine.push(voucherLineTemplate);
        });

        voucherList.push(voucherTemplate);
      });
    }
    return voucherList;
  }

  /**
   * Save accounting voucher to Netvisor
   * @example await accounting(voucherObject);
   * @returns {string} NetvisorKey of the saved voucher
   */
  async accounting(voucher: AccountingVoucher): Promise<string> {
    const response = await this._client.post('accounting.nv', buildXml({ root: { voucher: voucher } }));
    return parseXml(response).replies.inserteddataidentifier;
  }
}
