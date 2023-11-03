import { NetvisorApiClient } from '..';
import { NetvisorMethod, parseXml, buildXml, forceArray } from './_method';
import {
  AccountList,
  AccountListAccount,
  AccountingLedgerParameters,
  AccountingLedgerVoucher,
  AccountingLedgerVoucherLine,
  AccountingVoucher,
  VoucherType,
  VoucherTypeList
} from '../interfaces/accounting';
import { parse } from 'path';

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
            lineSum: parseFloat(xmlVoucherLine.linesum.replace(',', '.')),
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
              voucherLineTemplate.dimension!.push({
                dimensionName: xmlDimension.dimensionname,
                dimensionItem: xmlDimension.dimensionitem
              });
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

  /**
   * Get account list from Netvisor
   * @example await accountList()
   * @returns {AccountList} Returns default accounts and list of all accounts.
   */
  async accountList(): Promise<AccountList> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('accountlist.nv');
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const accountList: AccountList = {
      companyDefaultAccounts: {
        tradePayables: parseInt(xmlObject.accountlist.companydefaultaccounts.tradepayables),
        purchaseVatReceivable: parseInt(xmlObject.accountlist.companydefaultaccounts.purchasevatreceivable),
        roundingOffDifference: parseInt(xmlObject.accountlist.companydefaultaccounts.roundingoffdifference),
        vatPayable: parseInt(xmlObject.accountlist.companydefaultaccounts.vatpayable),
        taxAccount: parseInt(xmlObject.accountlist.companydefaultaccounts.taxaccount),
        advancePayments: parseInt(xmlObject.accountlist.companydefaultaccounts.advancepayments),
        salesReceivables: parseInt(xmlObject.accountlist.companydefaultaccounts.salesreceivables),
        salesVatDebt: parseInt(xmlObject.accountlist.companydefaultaccounts.salesvatdebt),
        inventory: parseInt(xmlObject.accountlist.companydefaultaccounts.inventory),
        salesDiscount: parseInt(xmlObject.accountlist.companydefaultaccounts.salesdiscount),
        salesExchangeRateDifferences: parseInt(xmlObject.accountlist.companydefaultaccounts.salesexchangeratedifferences),
        collection: parseInt(xmlObject.accountlist.companydefaultaccounts.collection),
        purchaseDiscounts: parseInt(xmlObject.accountlist.companydefaultaccounts.purchasesdiscounts),
        purchasesExchangeRateDifferences: parseInt(xmlObject.accountlist.companydefaultaccounts.purchasesexchangeratedifferences),
        purchaseInvoiceAccrual: parseInt(xmlObject.accountlist.companydefaultaccounts.purchaseinvoiceaccrual),
        salesInvoiceAccrual: parseInt(xmlObject.accountlist.companydefaultaccounts.salesinvoiceaccrual),
        purchaseDomesticDefault: parseInt(xmlObject.accountlist.companydefaultaccounts.purchasedomesticdefault),
        purchaseEUDefault: parseInt(xmlObject.accountlist.companydefaultaccounts.purchaseeudefault),
        purchaseOutsideEuDefault: parseInt(xmlObject.accountlist.companydefaultaccounts.purchaseoutsideeudefault),
        salesDomesticDefault: parseInt(xmlObject.accountlist.companydefaultaccounts.salesdomesticdefault),
        salesEUDefault: parseInt(xmlObject.accountlist.companydefaultaccounts.saleseudefault),
        salesOutsideEUDefault: parseInt(xmlObject.accountlist.companydefaultaccounts.salesoutsideeudefault)
      },
      accounts: {
        account: []
      }
    };
    // Add items to accounts array
    if (xmlObject.accountlist.accounts?.account) {
      forceArray(xmlObject.accountlist.accounts.account).forEach((xmlAccount) => {
        const accountTemplate: AccountListAccount = {
          netvisorKey: parseInt(xmlAccount.netvisorkey),
          number: xmlAccount.number,
          name: xmlAccount.name,
          foreignName: [],
          accountType: xmlAccount.accounttype,
          fatherNetvisorKey: parseInt(xmlAccount.fathernetvisorkey),
          isActive: xmlAccount.isactive === '1' ? true : false,
          isCumulative: xmlAccount.iscumulative === '1' ? true : false,
          sort: parseInt(xmlAccount.sort),
          endSort: parseInt(xmlAccount.endsort),
          isNaturalNegative: xmlAccount.isnaturalnegative === '1' ? true : false
        };

        if (xmlAccount.foreignname) {
          forceArray(xmlAccount.foreignname).forEach((xmlForeignName) => {
            accountTemplate.foreignName!.push(xmlForeignName);
          });
        } else {
          delete accountTemplate.foreignName;
        }

        accountList.accounts.account.push(accountTemplate);
      });
    }
    return accountList;
  }

  /**
   * Get voucher type list from Netvisor
   * @example await voucherTypeList()
   * @returns {VoucherTypeList} Returns default voucher types and list of all voucher types.
   */
  async voucherTypeList(): Promise<VoucherTypeList> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('vouchertypelist.nv');
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const voucherTypeList: VoucherTypeList = {
      defaultVoucherTypes: {
        salesInvoices: {
          netvisorKey: parseInt(xmlObject.vouchertypelist.defaultvouchertypes.salesinvoices.netvisorkey)
        },
        salesInvoicePayments: {
          netvisorKey: parseInt(xmlObject.vouchertypelist.defaultvouchertypes.salesinvoicepayments.netvisorkey)
        },
        purchaseInvoices: {
          netvisorKey: parseInt(xmlObject.vouchertypelist.defaultvouchertypes.purchaseinvoices.netvisorkey)
        },
        purchaseInvoicePayments: {
          netvisorKey: parseInt(xmlObject.vouchertypelist.defaultvouchertypes.purchaseinvoicepayments.netvisorkey)
        },
        otherSystemGeneratedVouchers: {
          netvisorKey: parseInt(xmlObject.vouchertypelist.defaultvouchertypes.othersystemgeneratedvouchers.netvisorkey)
        },
        bankStatementViewVouchers: {
          netvisorKey: parseInt(xmlObject.vouchertypelist.defaultvouchertypes.bankstatementviewvouchers.netvisorkey)
        },
        accruals: {
          netvisorKey: parseInt(xmlObject.vouchertypelist.defaultvouchertypes.accruals.netvisorkey)
        }
      },
      voucherTypes: {
        voucherType: []
      }
    };
    // Add items to voucher types array
    if (xmlObject.vouchertypelist.vouchertypes?.vouchertype) {
      forceArray(xmlObject.vouchertypelist.vouchertypes.vouchertype).forEach((xmlVoucherType) => {
        const voucherTypeTemplate: VoucherType = {
          netvisorKey: parseInt(xmlVoucherType.netvisorkey),
          abbreviation: xmlVoucherType.abbreviation,
          name: xmlVoucherType.name,
          foreignName: []
        };

        if (xmlVoucherType.foreignname) {
          forceArray(xmlVoucherType.foreignname).forEach((xmlForeignName) => {
            voucherTypeTemplate.foreignName!.push(xmlForeignName);
          });
        } else {
          delete voucherTypeTemplate.foreignName;
        }

        voucherTypeList.voucherTypes.voucherType.push(voucherTypeTemplate);
      });
    }
    return voucherTypeList;
  }
}
