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

/*
 * RESOURCE
 * purchaseinvoicelist.nv
 */

export interface PurchaseInvoiceListParameters {
  beginInvoiceDate?: string;
  endInvoiceDate?: string;
  invoiceNumber?: string;
  invoiceStatus?: 'open' | 'approved' | 'accepted';
  /** yyyy-MM-ddTHH:mm:ss */
  lastModifiedStart?: string;
  /** yyyy-MM-ddTHH:mm:ss */
  lastModifiedEnd?: string;
  purchaseInvoiceBatchId?: number;
  paymentStatus?: 'unpaid' | 'paid';
}

export interface PurchaseInvoiceListItem {
  netvisorKey: number;
  invoiceNumber: string;
  invoiceDate: {
    value: string;
    attr: { format: 'ansi' };
  };
  vendor: string;
  vendorOrganizationIdentifier: string;
  sum: number;
  payments: number;
  openSum: number;
  uri: string;
}

/*
 * RESOURCE
 * getpurchaseinvoice.nv
 */

export interface GetPurchaseInvoiceParameters {
  netvisorKey?: number;
  /** Max 500 ids */
  netvisorKeyList?: string;
  include?: 'actions' | 'handlinghistory' | 'previewimage' | 'invoiceimage';
  omitAttachments?: boolean;
}

export interface GetPurchaseInvoice {
  purchaseInvoiceNetvisorKey: number;
  purchaseInvoiceNumber: string;
  purchaseInvoiceDate: {
    value: string;
    attr: { format: 'ansi' };
  };
  purchaseInvoiceEventDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  purchaseInvoiceDeliveryDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  purchaseInvoiceDueDate: {
    value: string;
    attr: { format: 'ansi' };
  };
  purchaseInvoiceValueDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  purchaseInvoiceReferenceNumber?: string;
  purchaseInvoiceAgreementIdentifier?: string;
  purchaseInvoiceVendorBankAccountNumber?: string;
  isPurchaseInvoiceVendorBankAccountDeleted?: boolean;
  isPurchaseInvoiceVendorBankAccountFromSEPARegion?: boolean;
  purchaseInvoiceAmount: number;
  purchaseInvoicePaidAmount: number;
  foreignCurrencyAmount?: number;
  foreignCurrencyNameID?: string;
  invoiceStatus: string;
  approvalStatus: string;
  purchaseInvoiceOurReference?: string;
  purchaseInvoiceYourReference?: string;
  purchaseInvoiceDescription?: string;
  vendorNetvisorKey: number;
  vendorOrganizationIdentifier?: string;
  vendorCode?: string;
  vendorName: string;
  vendorAddressLine?: string;
  vendorPostNumber?: string;
  vendorTown?: string;
  vendorCountry?: string;
  fingerprint: string;
  voucherId?: number;
  isAccounted: boolean;
  previewImage?: {
    value: string;
    attr: { attachmentNetvisorKey: number };
  };
  invoiceImage?: {
    value: string;
    attr: { attachmentNetvisorKey: number };
  };
  attachments?: {
    attachment: {
      attachmentBase64Data: string;
      fileName: string;
      contentType: string;
      comment?: string;
    }[];
  };
  invoiceLines: {
    purchaseInvoiceLine: GetPurchaseInvoiceLine[];
  };
  linkedPurchaseOrders?: {
    purchaseOrder: {
      orderNumber: string;
      netvisorKey?: number;
    }[];
  };
  postingLinesAccess?: {
    canEditPostingLines: boolean;
    canUserPostInvoice: boolean;
    suggestPostingByDefault: boolean;
    canEditAccountingSuggestion: boolean;
  };
  actions?: {
    action: {
      id: string;
      type: string;
      description: string;
    }[];
  };
  alerts?: {
    alert: {
      heading: string;
      description: string;
    }[];
  };
  notifications?: {
    notification: {
      heading: string;
      description: string;
    }[];
  };
  handlingHistory?: {
    handlingHistoryLine: GetPurchaseInvoiceHandlingHistoryLine[];
  };
}

export interface GetPurchaseInvoiceLine {
  netvisorKey: number;
  lineSum: number;
  lineNetSum: number;
  unitPrice: number;
  vatPercent: number;
  vatCode: string;
  description?: string;
  unit?: string;
  orderedAmount: number;
  deliveredAmount: number;
  productCode?: string;
  discountPercentage: number;
  productName?: string;
  accountingSuggestionBookkeepingAccount?: string;
  accountingSuggestionBookkeepingAccountNetvisorKey?: number;
  purchaseInvoiceLineDimensions?: {
    dimension: {
      dimensionName: string;
      dimensionNameNetvisorKey: number;
      dimensionDetailName: string;
      dimensionDetailNameNetvisorKey: number;
    }[];
  };
}

export interface GetPurchaseInvoiceHandlingHistoryLine {
  type: string;
  heading: string;
  description: string;
  timestamp: {
    value: string;
    attr: { format: 'ansi' };
  };
  userName: string;
  userEmail?: string;
  updatedInformationFields?: {
    fieldName: string;
    oldValue: string;
    newValue: string;
  }[];
}

/*
 * RESOURCE
 * purchaseorder.nv
 */

export interface PurchaseOrderParameters {
  method: 'add' | 'edit';
  /** Must be given if method is 'edit' */
  id?: number;
}

export interface PurchaseOrder {
  orderNumber?: string;
  orderStatus?: 'proposal' | 'approved' | 'senttovendor' | 'archived';
  orderDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  vendorIdentifier?: {
    value: string;
    attr: { type: 'netvisor' | 'code' | 'organisationidentifier' };
  };
  purchaseOrderVendorDetails?: {
    address?: string;
    postNumber?: string;
    city?: string;
    country?: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
  };
  deliveryTerm?: string;
  deliveryMethod?: string;
  purchaseOrderDeliveryDetails?: {
    name?: string;
    address?: string;
    postNumber?: string;
    deliveryCity?: string;
    deliveryCountry?: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
  };
  privateComment?: string;
  comment?: string;
  ourReference?: string;
  currencyCode?: {
    value: string;
    attr: { type: 'ISO-4217' };
  };
  purchaseOrderPaymentTerm?: {
    netDays?: number;
    discountDays?: number;
    discountPercent?: number;
  };
  purchaseOrderLines?: {
    purchaseOrderProductLine?: PurchaseOrderProductLine[];
    purchaseOrderCommentLine?: {
      attr?: { method?: 'add' | 'edit' | 'delete'; netvisorKey?: number };
      comment?: string;
    }[];
  };
}

export interface PurchaseOrderProductLine {
  attr?: {
    method?: 'add' | 'edit' | 'delete' | 'partialdeliver' | 'addtopartialdeliverygroup';
    netvisorKey?: number;
  };
  purchaseOrderProductLinePartialDelivery?: {
    purchaseOrderProductLinePartialDeliveryContent?: {
      orderedAmount?: number;
      deliveredAmount?: number;
      deliveryReceivedDate?: {
        value: string;
        attr: { format: 'ansi' };
      };
      deliveryManuallyConfirmed?: boolean;
      deliveredProductQuality?: number;
      inventoryBatchNumber?: number;
      inventoryManufactureDate?: {
        value: string;
        attr: { format: 'ansi' };
      };
      inventoryPackagingDate?: {
        value: string;
        attr: { format: 'ansi' };
      };
      inventoryBestBeforeDate?: {
        value: string;
        attr: { format: 'ansi' };
      };
      inventoryExpiryDate?: {
        value: string;
        attr: { format: 'ansi' };
      };
    }[];
  };
  productCode?: {
    value: string;
    attr: { type: 'netvisor' | 'customer' };
  };
  vendorProductCode?: string;
  orderedAmount?: number;
  unitPrice?: number;
  vatPercent?: number;
  freightRate?: number;
  lineComment?: string;
  deliveryDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  purchaseOrderProductLineDeliveryDetails?: {
    deliveredAmount?: number;
    deliveryReceivedDate?: {
      value: string;
      attr: { format: 'ansi' };
    };
    deliveryManuallyConfirmed?: boolean;
    deliveredProductQuality?: number;
  };
  inventoryPlace?: {
    value: string;
    attr: { type: 'netvisor' | 'customer' };
  };
  purchaseOrderProductLineDimensions?: {
    dimension: {
      dimensionName: string;
      dimensionItem: string;
    }[];
  };
}
