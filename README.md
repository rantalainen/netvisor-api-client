# netvisor-api-client

Third party Netvisor API client.

:warning: This tool is in early stages and is subject to change.

## Installation

Install from npm:

```
npm install @rantalainen/netvisor-api-client
```

## Setup

### Import to NodeJS project

```javascript
const { NetvisorApiClient } = require('@rantalainen/netvisor-api-client');
```

### Import to TypeScript project

```javascript
import { NetvisorApiClient } from '@rantalainen/netvisor-api-client';
```

### Setup client

- `integrationName` Name for integration that is visible in Netvisor UI (self defined)
- `customerId` consult Netvisor (Header: X-Netvisor-Authentication-CustomerId)
- `customerKey` consult Netvisor
- `partnerId` consult Netvisor (Header: X-Netvisor-Authentication-PartnerId)
- `partnerKey` consult Netvisor
- `organizationId` Oganization id for company

Since v1.4.0 allows using cacheable-lookup with either internal or external dns cache. Make sure you are using cacheable-lookup@5 which is compatible with got@11 that is used.

```javascript
const nvApiClient = new NetvisorApiClient({
  integrationName: '',
  customerId: '',
  customerKey: '',
  partnerId: '',
  partnerKey: '',
  organizationId: '1234567-8'

  // optional - set to true if you want to use internal cache within Doks API Client
  dnsCache: dnsCache
});
```

## Methods (examples)

```javascript
// Each resource type has saveByXmlData() and saveByXmlFilePath() posts (below examples with products):
const data = = `<root>
  <product>
    <productbaseinformation>
      <productcode>CC</productcode>
      <productgroup>Books</productgroup>
      <name>Code Complete 2</name>
      <unitprice type="net">42,5</unitprice>
      <unit>pcs</unit>
      <isactive>1</isactive>
      <issalesproduct>1</issalesproduct>
      <inventoryenabled>1</inventoryenabled>
    </productbaseinformation>
    <productbookkeepingdetails>
      <defaultvatpercentage>24</defaultvatpercentage>
    </productbookkeepingdetails>
  </product>
</root>`
await nvApiClient.product.saveByXmlData(data);

const filepath = 'my\filepath\myfile.xml';
await nvApiClient.product.saveByXmlFilePath(filepath);

// Get vouchers by date
const vouchers = await nvApiClient.accounting.getVouchers('2021-01-01', '2021-01-31');

// Get products by product code
const products = await nvApiClient.product.getProducts('productCode');

// Save budget by json dataset
const data = {
  AccountingBudget: {
    Ratio: { '@': {type: 'account'}, '#': 4010 },
    Sum: -1000,
    Year: 2021,
    Month: 02,
    Version: 'Budjettiversio 1',
    VatClass: 0,
    Combinations: {
      Combination: [
        {
          CombinationSum: -500,
          Dimension: {
            DimensionName: 'Projects',
            DimensionItem: 'Project X'
          }
        },
        {
          CombinationSum: -500,
          Dimension: {
            DimensionName: 'Projects',
            DimensionItem: 'Project Y'
          }
        }
      ]
    }
  }
};
await nvApiClient.budget.saveBudgetByDataSet(data);

// Save budget from xml
await nvApiClient.budget.saveBudgetByXmlFilePath(filePath);

// Get raw xml data (example with sales invoice but works with any get resource)
await nvApiClient.sales.getXmlData('getsalesinvoice.nv', { netvisorkey: '123', pdfimage: 'nopdf', showcommentlines: '1' })

```

## Changelog

- 0.0.1 Under development
- 0.0.3 Added saveInvoiceByDataSet in salesinvoice
- 0.0.4 Added purchaseinvoice and inventory in product
- 0.0.7 Added getSales in salesinvoice
- 0.0.8 Improvements to salesinvoice and products
- 0.0.11 Fix undefined error (getSales) if zero results are found
- 0.0.12-0.0.18 Minor fixes
- 0.0.19 Added workday
- 0.1.0 Employee method with post employee and get getemployeesalaryparameters
- 0.1.1 Fix error in getSales if invoicelines are empty
- 0.1.2 Reorganize employee dataset to meet Netvisor xml format requirements
- 0.2.0 Added getProductByNetvisorKey
- 0.3.0 Added getExtendedProducts
- 0.4.0 Added getCustomerByNetvisorKey
- 0.5.0 Updated purchaseinvoice types
- 0.6.0 Added getXmlData
- 0.6.1 Added ability to change method when using saveByXmlData
- 0.6.2 Hotfix to parameter default value
- 0.6.3 Added delivery data to get sales
- 0.6.5 Added order - invoice link to get sales
- 0.6.6 Split salesinvoices fetch into smaller pieces to allow fetching large amount of invoices
- 0.6.7 Add more details to getSales
- 0.7.0 Add tripexpense method
- 0.8.0 Add savePayrollPeriodRecordByDataSet in workday method
- 0.9.0 Add vendors method
- 0.10.0 Allow getting multiple products with getProductWithNetvisorkey
- 0.11.0 Implemented timeout option
- 0.12.0 Add voucher by dataset
- 0.12.1 Fixed getting ProductPriceInformation.DefaultNetPrice for function getExtendedProducts() to reflect changes Netvisor made to the response
- 0.13.1 Add salespayment by dataset / Fix logging
- 0.14.0 Add dns caching possibility with cacheableLookup, extend purchase method, minor fixes in getSales, group interfaces to separate folder
- 0.15.0 Added GitHub Action workflow for automated npm publish
