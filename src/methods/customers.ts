import { NetvisorApiClient } from '..';
import { NetvisorMethod, parseXml, buildXml, forceArray } from './_method';
import {
  CustomerListParameters,
  CustomerListItem,
  GetCustomerParameters,
  GetCustomer,
  CustomerParameters,
  Customer,
  SalesPersonnelListItem
} from '../interfaces/customers';

export class NetvisorCustomerMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);
  }

  /**
   * Get customer list from Netvisor
   * @example await customerList({ keyword: 'Oy', customerCodeList: '123,124,560,999' })
   * @returns {CustomerListItem[]} If no customers were retrieved, empty array will be returned.
   */
  async customerList(params?: CustomerListParameters): Promise<CustomerListItem[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('customerlist.nv', params);
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const customerList: CustomerListItem[] = [];
    // Add items to return array
    if (xmlObject.customerlist.customer) {
      forceArray(xmlObject.customerlist.customer).forEach((xmlCustomer) => {
        // Push the list items to array
        customerList.push({
          netvisorKey: parseInt(xmlCustomer.netvisorkey),
          name: xmlCustomer.name,
          code: xmlCustomer.code,
          organisationIdentifier: xmlCustomer.organisationidentifier,
          customerGroupID: parseInt(xmlCustomer.customergroupid) || null,
          customerGroupName: xmlCustomer.customergroupname,
          uri: xmlCustomer.uri
        });
      });
    }
    return customerList;
  }

  /**
   * Get customer(s) from Netvisor.
   * @example await getCustomer({ idList: '1,2,3' })
   * @returns {GetCustomer[]} Returns array even when getting only a single customer.
   */
  async getCustomer(params: GetCustomerParameters): Promise<GetCustomer[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('getcustomer.nv', params);
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const customers: GetCustomer[] = [];
    // Create array from the xml result
    let xmlCustomers: any[] = [];
    if (xmlObject.customers) {
      if (xmlObject.customers.customer) {
        // If there were multiple customers in the result
        xmlCustomers = forceArray(xmlObject.customers.customer);
      }
    } else {
      if (xmlObject.customer) {
        // If there were a single customer in the result
        xmlCustomers = forceArray(xmlObject.customer);
      }
    }
    // Add customers to return array
    xmlCustomers.forEach((xmlCustomer) => {
      // Create template object with mandatory properties
      const customer: GetCustomer = {
        customerBaseInformation: {
          netvisorKey: parseInt(xmlCustomer.customerbaseinformation.netvisorkey),
          internalIdentifier: xmlCustomer.customerbaseinformation.internalidentifier,
          externalIdentifier: xmlCustomer.customerbaseinformation.externalidentifier,
          name: xmlCustomer.customerbaseinformation.name,
          nameExtension: xmlCustomer.customerbaseinformation.nameextension,
          streetAddress: xmlCustomer.customerbaseinformation.streetaddress,
          additionalStreetAddress: xmlCustomer.customerbaseinformation.additionalstreetaddress,
          city: xmlCustomer.customerbaseinformation.city,
          postNumber: xmlCustomer.customerbaseinformation.postnumber,
          phoneNumber: xmlCustomer.customerbaseinformation.phonenumber,
          faxNumber: xmlCustomer.customerbaseinformation.faxnumber,
          email: xmlCustomer.customerbaseinformation.email,
          emailInvoicingAddress: xmlCustomer.customerbaseinformation.emailinvoicingaddress,
          homePageUri: xmlCustomer.customerbaseinformation.homepageuri,
          isActive: parseInt(xmlCustomer.customerbaseinformation.isactive),
          isPrivateCustomer: parseInt(xmlCustomer.customerbaseinformation.isprivatecustomer)
        },
        customerFinvoiceDetails: {
          finvoiceAddress: xmlCustomer.customerfinvoicedetails.finvoiceaddress,
          finvoiceRouterCode: xmlCustomer.customerfinvoicedetails.finvoiceroutercode
        },
        customerDeliveryDetails: {
          deliveryName: xmlCustomer.customerdeliverydetails.deliveryname,
          deliveryStreetAddress: xmlCustomer.customerdeliverydetails.deliverystreetaddress,
          deliveryCity: xmlCustomer.customerdeliverydetails.deliverycity,
          deliveryPostNumber: xmlCustomer.customerdeliverydetails.deliverypostnumber
        },
        customerContactDetails: {
          contactPerson: xmlCustomer.customercontactdetails.contactperson,
          contactPersonEmail: xmlCustomer.customercontactdetails.contactpersonemail,
          contactPersonPhone: xmlCustomer.customercontactdetails.contactpersonphone
        },
        customerAdditionalInformation: {
          comment: xmlCustomer.customeradditionalinformation.comment,
          customerAgreementIdentifier: xmlCustomer.customeradditionalinformation.customeragreementidentifier,
          referenceNumber: xmlCustomer.customeradditionalinformation.referencenumber,
          useCreditorReferenceNumber: parseInt(xmlCustomer.customeradditionalinformation.usecreditorreferencenumber),
          yourDefaultReference: xmlCustomer.customeradditionalinformation.yourdefaultreference,
          defaultTextBeforeInvoiceLines: xmlCustomer.customeradditionalinformation.defaulttextbeforeinvoicelines,
          defaultTextAfterInvoiceLines: xmlCustomer.customeradditionalinformation.defaulttextafterinvoicelines,
          defaultPaymentTerm: xmlCustomer.customeradditionalinformation.defaultpaymentterm,
          taxHandlingType: xmlCustomer.customeradditionalinformation.taxhandlingtype,
          balanceLimit: parseFloat(xmlCustomer.customeradditionalinformation.balancelimit.replace(',', '.')) || null,
          euStandardFinvoice: parseInt(xmlCustomer.customeradditionalinformation.eustandardfinvoice) || 0
        }
      };
      // Add base information's optional properties if they exist
      if (xmlCustomer.customerbaseinformation.organizationunitnumber) {
        customer.customerBaseInformation.organizationUnitNumber = parseInt(xmlCustomer.customerbaseinformation.organizationunitnumber);
      }
      if (xmlCustomer.customerbaseinformation.customergroupnetvisorkey) {
        customer.customerBaseInformation.customerGroupNetvisorKey = xmlCustomer.customerbaseinformation.customergroupnetvisorkey;
      }
      if (xmlCustomer.customerbaseinformation.customergroupname) {
        customer.customerBaseInformation.customerGroupName = xmlCustomer.customerbaseinformation.customergroupname;
      }
      if (xmlCustomer.customerbaseinformation.country) {
        customer.customerBaseInformation.country = xmlCustomer.customerbaseinformation.country;
      }
      if (xmlCustomer.customerdeliverydetails.deliverycountry) {
        customer.customerDeliveryDetails.deliveryCountry = xmlCustomer.customerdeliverydetails.deliverycountry;
      }
      // Add customer contact person if it exists
      if (xmlCustomer.customercontactpersons) {
        customer.customerContactPersons = {
          customerContactPerson: {
            contactPersonID: parseInt(xmlCustomer.customercontactpersons.customercontactperson.contactpersonid),
            contactPersonFirstName: xmlCustomer.customercontactpersons.customercontactperson.contactpersonfirstname,
            contactPersonLastName: xmlCustomer.customercontactpersons.customercontactperson.contactpersonlastname,
            contactPersonPhoneNumber: xmlCustomer.customercontactpersons.customercontactperson.contactpersonphonenumber,
            contactPersonEmail: xmlCustomer.customercontactpersons.customercontactperson.contactpersonemail,
            contactPersonOfficeNetvisorKey: parseInt(
              xmlCustomer.customercontactpersons.customercontactperson.contactpersonofficenetvisorkey
            )
          }
        };
      }
      // Add customer offices if there is any
      if (xmlCustomer.customerofficedetails) {
        customer.customerOfficeDetails = [];
        forceArray(xmlCustomer.customerofficedetails).forEach((xmlOfficeDetails) => {
          const customerOfficeDetail = {
            officeNetvisorKey: parseInt(xmlOfficeDetails.officenetvisorkey),
            officeName: xmlOfficeDetails.officename,
            officePhoneNumber: xmlOfficeDetails.officephonenumber,
            officeTelefaxNumber: xmlOfficeDetails.officetelefaxnumber,
            officeIdentifier: xmlOfficeDetails.officeidentifier,
            officeContactAddress: {
              streetAddress: xmlOfficeDetails.officecontactaddress.streetaddress || undefined,
              postNumber: xmlOfficeDetails.officecontactaddress.postnumber || undefined,
              city: xmlOfficeDetails.officecontactaddress.city || undefined,
              country: xmlOfficeDetails.officecontactaddress.country || undefined
            },
            officeVisitAddress: {
              streetAddress: xmlOfficeDetails.officevisitaddress.streetaddress || undefined,
              postNumber: xmlOfficeDetails.officevisitaddress.postnumber || undefined,
              city: xmlOfficeDetails.officevisitaddress.city || undefined,
              country: xmlOfficeDetails.officevisitaddress.country || undefined
            },
            officeFinvoiceDetails: {
              finvoiceAddress: xmlOfficeDetails.officefinvoicedetails.finvoiceaddress || undefined,
              finvoiceRouterCode: xmlOfficeDetails.officefinvoicedetails.finvoiceroutercode || undefined
            }
          };
          customer.customerOfficeDetails!.push(customerOfficeDetail);
        });
      }
      // Add additional information's optional properties if they exist
      if (xmlCustomer.customeradditionalinformation.defaultsalesperson) {
        customer.customerAdditionalInformation.defaultSalesPerson = xmlCustomer.customeradditionalinformation.defaultsalesperson;
      }
      if (xmlCustomer.customeradditionalinformation.discountpercentage) {
        customer.customerAdditionalInformation.discountPercentage = parseFloat(
          xmlCustomer.customeradditionalinformation.discountpercentage.replace(',', '.')
        );
      }
      if (xmlCustomer.customeradditionalinformation.pricegroup) {
        customer.customerAdditionalInformation.priceGroup = xmlCustomer.customeradditionalinformation.pricegroup;
      }
      if (xmlCustomer.customeradditionalinformation.factoringaccount) {
        customer.customerAdditionalInformation.factoringAccount = xmlCustomer.customeradditionalinformation.factoringaccount;
      }
      if (xmlCustomer.customeradditionalinformation.invoicinglanguage) {
        customer.customerAdditionalInformation.invoicingLanguage = xmlCustomer.customeradditionalinformation.invoicinglanguage;
      }
      if (xmlCustomer.customeradditionalinformation.customerdimensions) {
        customer.customerAdditionalInformation.customerDimensions = { dimension: [] };
        forceArray(xmlCustomer.customeradditionalinformation.customerdimensions.dimension).forEach((xmlDimension) => {
          customer.customerAdditionalInformation.customerDimensions!.dimension.push({
            dimensionName: {
              value: xmlDimension.dimensionname.value,
              attr: { netvisorkey: xmlDimension.dimensionname.attr.netvisorkey }
            },
            dimensionItem: {
              value: xmlDimension.dimensionitem.value,
              attr: { netvisorkey: xmlDimension.dimensionitem.attr.netvisorkey }
            }
          });
        });
      }
      if (xmlCustomer.customeradditionalinformation.additionalinformation) {
        customer.customerAdditionalInformation.additionalInformation = {
          receivablesManagement: {
            turnoverDays: xmlCustomer.customeradditionalinformation.additionalinformation.receivablesmanagement.turnoverdays,
            turnoverDeviation: xmlCustomer.customeradditionalinformation.additionalinformation.receivablesmanagement.turnoverdeviation
          }
        };
      }

      customers.push(customer);
    });
    return customers;
  }

  /**
   * Create a customer to Netvisor. When editing an existing customer, only give the properties that are being edited.
   * @example await customer(customer, { method: 'add' })
   * @returns the added customer's netvisor key
   */
  async customer(customer: Customer, params: CustomerParameters): Promise<string> {
    const response = await this._client.post('customer.nv', buildXml({ root: { customer: customer } }), params);
    if (params.method === 'add') return parseXml(response).replies.inserteddataidentifier;
    return params.id?.toString() || '';
  }

  /**
   * Get sales personnel from Netvisor.
   * @example await salesPersonnelList()
   * @returns {SalesPersonnelListItem[]} Returns array even when getting only a single sales person.
   */
  async salesPersonnelList(): Promise<SalesPersonnelListItem[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('salespersonnellist.nv');
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const salesPersonnelList: SalesPersonnelListItem[] = [];
    // Create array from the xml result
    let xmlSalesPersonnel: any[] = [];
    if (xmlObject.salespersonnellist.salesperson) {
      // If there were multiple customers in the result
      xmlSalesPersonnel = forceArray(xmlObject.salespersonnellist.salesperson);
    }

    // Add customers to return array
    xmlSalesPersonnel.forEach((xmlCustomer) => {
      salesPersonnelList.push({
        netvisorKey: parseInt(xmlCustomer.attr.netvisorkey),
        firstName: xmlCustomer.firstname || '',
        lastName: xmlCustomer.lastname || '',
        provisionPercent: parseFloat(xmlCustomer.provisionpercent.replace(',', '.')) || undefined
      });
    });

    return salesPersonnelList;
  }
}
