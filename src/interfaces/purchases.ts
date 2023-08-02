/*
 * RESOURCE
 * getvendor.nv
 */

export interface GetVendorParameters {
  netvisorKey?: number;
  netvisorKeyList?: string;
  changedSince?: string;
  page?: number;
}

export interface GetVendor {
  netvisorKey: number;
  vendorBaseInformation: {
    code?: string;
    name: string;
    address: string;
    postCode: string;
    city: string;
    country: {
      value: string;
      attr: { type: string };
    };
    organizationId: string;
    groupName?: string;
    vendorBankAccounts?: {
      vendorDomesticBankAccounts?: {
        vendorDomesticBankAccount: {
          netvisorKey: number;
          iban: string;
          bankName: string;
          isDefault: boolean;
        }[];
      };
      vendorForeignBankAccounts?: {
        vendorForeignBankAccount: {
          netvisorKey: number;
          bban: string;
          bicSwift: string;
          bankName: string;
          clearingCode: string;
          clearingNumber: string;
          bankAddress: string;
          country: {
            value: string;
            attr: { type: string };
          };
          currencyCode: {
            value: string;
            attr: { type: string };
          };
          isDefault: boolean;
          includeAddresssInForeignPayments: boolean;
        }[];
      };
    };
  };
  vendorContactDetails?: {
    phoneNumber?: string;
    email?: string;
    faxNumber?: string;
    contactPersonName?: string;
    contactPersonPhoneNumber?: string;
    contactPersonEmail?: string;
    homePage?: string;
    comment?: string;
  };
  vendorAdditionalInformation: {
    defaultVatPercent: number;
    isPartialVatReducedPrivileged: boolean;
    paymentTerm?: number;
    vendorDimensions?: {
      dimension: {
        dimensionName: string;
        dimensionItem: string;
      }[];
    };
    vendorAccountingAccounts?: {
      vendorAccountingAccount: {
        accountNumber: string;
        accountName: string;
        isDefault: boolean;
      }[];
    };
    vendorAcceptanceDetails?: {
      vendorAcceptanceDetail: {
        acceptanceName: string;
        isDefault: boolean;
        isForced: boolean;
      }[];
    };
  };
}

/*
 * RESOURCE
 * purchaseinvoice.nv
 */

export interface PurchaseInvoice {
  invoiceNumber: string;
  invoiceDate: {
    value: string;
    attr: { format: 'ansi'; findOpenDate?: string };
  };
  invoiceSource?: 'finvoice' | 'manual';
  valueDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  eventDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  dueDate: {
    value: string;
    attr: { format: 'ansi' };
  };
  purchaseInvoiceOnRound?: 'open' | 'approved' | 'accepted';
  vendorCode?: string;
  vendorName?: string;
  vendorAddressLine?: string;
  vendorPostNumber?: string;
  vendorCity?: string;
  vendorCountry?: string;
  vendorPhoneNumber?: string;
  vendorFaxNumber?: string;
  vendorEmail?: string;
  vendorHomePage?: string;
  amount: number;
  accountNumber?: string;
  organizationIdentifier?: string;
  sellerOrganizationTaxCode?: string;
  deliveryDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  overdueFinePercent?: number;
  bankReferenceNumber?: string;
  ourReference?: string;
  yourReference?: string;
  currencyCode?: string;
  deliveryTerms?: string;
  deliveryMethod?: string;
  comment?: string;
  checksum?: string;
  pdfExtraPages?: number;
  readyForAccounting?: 1;
  agreementIdentifier?: string;
  primaryVendorMatchType?: 'code' | 'name' | 'organizationid';
  purchaseInvoiceLines: {
    purchaseInvoiceLine: PurchaseInvoiceLine[];
  };
  purchaseInvoiceSubLines?: {
    purchaseInvoiceSubLine: PurchaseInvoiceSubLine[];
  };
  purchaseInvoiceAttachments?: {
    purchaseInvoiceAttachment: {
      mimeType: string;
      attachmentDescription: string;
      fileName: string;
      documentData: string;
      documentType?: 'invoiceimage' | 'otherattachment';
    }[];
  };
  purchaseInvoiceRelatedPurchaseOrderNumbers?: {
    purchaseInvoiceRelatedPurchaseOrderNumber: {
      purchaseOrderNumber: string;
    }[];
  };
  partialPaymentDetails?: {
    paidAmount: {
      value: number;
      attr: { amountCurrencyIdentifier: string };
    };
  }[];
}

export interface PurchaseInvoiceLine {
  productCode?: string;
  productName: string;
  orderedAmount?: number;
  deliveredAmount: number;
  unitName?: string;
  unitPrice: number;
  discountPercentage?: number;
  vatPercent: number;
  lineSum: {
    value: number;
    attr: { type: 'brutto' };
  };
  description?: string;
  sort?: number;
  accountingSuggestion?: number;
  dimension?: {
    dimensionName: string;
    dimensionItem: string;
  }[];
}

export interface PurchaseInvoiceSubLine {
  productCode?: string;
  productName?: string;
  orderedAmount?: number;
  deliveredAmount?: number;
  unitName?: string;
  unitPrice?: number;
  discountPercentage?: number;
  vatPercent?: number;
  lineSum?: {
    value: number;
    attr: { type: 'brutto' };
  };
  description?: string;
  sort?: number;
}
