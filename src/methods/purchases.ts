import { NetvisorApiClient } from '..';
import { GetVendorParameters, GetVendor, PurchaseInvoice } from '../interfaces/purchases';
import { NetvisorMethod, parseXml, buildXml, forceArray } from './_method';

export class NetvisorPurchasesMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);
  }

  /**
   * Get vendor(s) from Netvisor
   * @example await getVendor({ netvisorKey: 67 })
   * @returns {GetVendor[]} If no vendors were retrieved, empty array will be returned.
   */
  async getVendor(params?: GetVendorParameters): Promise<GetVendor[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('getvendor.nv', params);
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const vendorList: GetVendor[] = [];

    // Get vendors from the xml to an array
    let xmlVendors: any[] = [];
    if (xmlObject.vendors) {
      xmlVendors = forceArray(xmlObject.vendors.vendor);
    } else if (xmlObject.vendor) {
      xmlVendors = forceArray(xmlObject.vendor);
    }

    xmlVendors.forEach((xmlVendor: any) => {
      // Add mandatory fields to the return object
      const vendor: GetVendor = {
        netvisorKey: parseInt(xmlVendor.netvisorkey),
        vendorBaseInformation: {
          name: xmlVendor.vendorbaseinformation.name,
          address: xmlVendor.vendorbaseinformation.address,
          postCode: xmlVendor.vendorbaseinformation.postcode,
          city: xmlVendor.vendorbaseinformation.city,
          country: xmlVendor.vendorbaseinformation.country,
          organizationId: xmlVendor.vendorbaseinformation.organizationid
        },
        vendorAdditionalInformation: {
          defaultVatPercent: parseFloat(xmlVendor.vendoradditionalinformation.defaultvatpercent),
          isPartialVatReducedPrivileged: xmlVendor.vendoradditionalinformation.ispartialvatreducedprivileged === '1' ? true : false
        }
      };
      // Add optional fields
      if (xmlVendor.vendorbaseinformation.code) vendor.vendorBaseInformation.code = xmlVendor.vendorbaseinformation.code;
      if (xmlVendor.vendorbaseinformation.groupname) vendor.vendorBaseInformation.groupName = xmlVendor.vendorbaseinformation.groupname;
      if (xmlVendor.vendoradditionalinformation.paymentterm)
        vendor.vendorAdditionalInformation.paymentTerm = parseInt(xmlVendor.vendoradditionalinformation.paymentterm);
      if (xmlVendor.vendoradditionalinformation.vendordimensions) {
        vendor.vendorAdditionalInformation.vendorDimensions = { dimension: [] };
        forceArray(xmlVendor.vendoradditionalinformation.vendordimensions.dimension).forEach((xmlDimension: any) => {
          vendor.vendorAdditionalInformation.vendorDimensions!.dimension.push({
            dimensionName: xmlDimension.dimensionname,
            dimensionItem: xmlDimension.dimensionitem
          });
        });
      }
      if (xmlVendor.vendoradditionalinformation.vendoraccountingaccounts) {
        vendor.vendorAdditionalInformation.vendorAccountingAccounts = { vendorAccountingAccount: [] };
        forceArray(xmlVendor.vendoradditionalinformation.vendoraccountingaccounts.vendoraccountingaccount).forEach(
          (xmlAccountingAccount: any) => {
            vendor.vendorAdditionalInformation.vendorAccountingAccounts!.vendorAccountingAccount.push({
              accountNumber: xmlAccountingAccount.accountnumber,
              accountName: xmlAccountingAccount.accountname,
              isDefault: xmlAccountingAccount.isdefault === 'True' ? true : false
            });
          }
        );
      }
      if (xmlVendor.vendoradditionalinformation.vendoracceptancedetails) {
        vendor.vendorAdditionalInformation.vendorAcceptanceDetails = { vendorAcceptanceDetail: [] };
        forceArray(xmlVendor.vendoradditionalinformation.vendoracceptancedetails.vendoracceptancedetail).forEach(
          (xmlAcceptanceDetail: any) => {
            vendor.vendorAdditionalInformation.vendorAcceptanceDetails!.vendorAcceptanceDetail.push({
              acceptanceName: xmlAcceptanceDetail.acceptancename || '',
              isDefault: xmlAcceptanceDetail.isdefault === 'True' ? true : false,
              isForced: xmlAcceptanceDetail.isforced === 'True' ? true : false
            });
          }
        );
      }

      // Add bank accounts
      if (xmlVendor.vendorbaseinformation.vendorbankaccounts) {
        vendor.vendorBaseInformation.vendorBankAccounts = {};
        // Add domestic bank accounts
        if (xmlVendor.vendorbaseinformation.vendorbankaccounts.vendordomesticbankaccounts) {
          vendor.vendorBaseInformation.vendorBankAccounts.vendorDomesticBankAccounts = { vendorDomesticBankAccount: [] };
          forceArray(xmlVendor.vendorbaseinformation.vendorbankaccounts.vendordomesticbankaccounts.vendordomesticbankaccount).forEach(
            (xmlBankAccount: any) => {
              vendor.vendorBaseInformation.vendorBankAccounts!.vendorDomesticBankAccounts!.vendorDomesticBankAccount.push({
                netvisorKey: parseInt(xmlBankAccount.netvisorkey),
                iban: xmlBankAccount.iban,
                bankName: xmlBankAccount.bankname,
                isDefault: xmlBankAccount.isdefault === '1' ? true : false
              });
            }
          );
        }
        // Add foreign bank accounts
        if (xmlVendor.vendorbaseinformation.vendorbankaccounts.vendorforeignbankaccounts) {
          vendor.vendorBaseInformation.vendorBankAccounts.vendorForeignBankAccounts = { vendorForeignBankAccount: [] };
          forceArray(xmlVendor.vendorbaseinformation.vendorbankaccounts.vendorforeignbankaccounts.vendorforeignbankaccount).forEach(
            (xmlBankAccount: any) => {
              vendor.vendorBaseInformation.vendorBankAccounts!.vendorForeignBankAccounts!.vendorForeignBankAccount.push({
                netvisorKey: parseInt(xmlBankAccount.netvisorkey),
                bban: xmlBankAccount.bban,
                bicSwift: xmlBankAccount.bicswift,
                bankName: xmlBankAccount.bankname,
                clearingCode: xmlBankAccount.clearingcode || '',
                clearingNumber: xmlBankAccount.clearingnumber || '',
                bankAddress: xmlBankAccount.bankaddress || '',
                country: xmlBankAccount.country,
                currencyCode: xmlBankAccount.currencycode,
                isDefault: xmlBankAccount.isdefault === '1' ? true : false,
                includeAddresssInForeignPayments: xmlBankAccount.includeaddresssinforeignpayments === '1' ? true : false
              });
            }
          );
        }
      }

      // Add vendor contact details
      if (xmlVendor.vendorcontactdetails) {
        vendor.vendorContactDetails = {};
        if (xmlVendor.vendorcontactdetails.phonenumber)
          vendor.vendorContactDetails.phoneNumber = xmlVendor.vendorcontactdetails.phonenumber;
        if (xmlVendor.vendorcontactdetails.email) vendor.vendorContactDetails.phoneNumber = xmlVendor.vendorcontactdetails.email;
        if (xmlVendor.vendorcontactdetails.faxnumber) vendor.vendorContactDetails.faxNumber = xmlVendor.vendorcontactdetails.faxnumber;
        if (xmlVendor.vendorcontactdetails.contactpersonname)
          vendor.vendorContactDetails.contactPersonName = xmlVendor.vendorcontactdetails.contactpersonname;
        if (xmlVendor.vendorcontactdetails.contactpersonphonenumber)
          vendor.vendorContactDetails.contactPersonPhoneNumber = xmlVendor.vendorcontactdetails.contactpersonphonenumber;
        if (xmlVendor.vendorcontactdetails.contactpersonemail)
          vendor.vendorContactDetails.contactPersonEmail = xmlVendor.vendorcontactdetails.contactpersonemail;
        if (xmlVendor.vendorcontactdetails.homepage) vendor.vendorContactDetails.homePage = xmlVendor.vendorcontactdetails.homepage;
        if (xmlVendor.vendorcontactdetails.comment) vendor.vendorContactDetails.comment = xmlVendor.vendorcontactdetails.comment;
        if (Object.keys(vendor.vendorContactDetails).length === 0) delete vendor.vendorContactDetails;
      }
      vendorList.push(vendor);
    });
    return vendorList;
  }

  /**
   * Create a purchase invoice to Netvisor
   * @example await purchaseInvoice(purchaseInvoiceObject)
   * @returns the added purhcase invoice's netvisor key
   */
  async purchaseInvoice(purchaseInvoice: PurchaseInvoice): Promise<string> {
    const response = await this._client.post('purchaseinvoice.nv', buildXml({ root: { purchaseInvoice: purchaseInvoice } }));
    return parseXml(response).replies.inserteddataidentifier;
  }
}
