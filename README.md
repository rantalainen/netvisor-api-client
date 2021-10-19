# netvisor-api-client
Third party Netvisor API client.

:warning: This tool is in early stages and is subject to change. 

## Installation

Install from npm (not available yet):

```
npm install netvisor-api-client
```

## Setup

### Import to NodeJS project

```javascript
const NetvisorApiClient = require('netvisor-api-client').NetvisorApiClient;
```

### Import to TypeScript project

```javascript
import { NetvisorApiClient } from 'netvisor-api-client';
```

### Setup client

* `integrationName` Name for integration that is visible in Netvisor UI (self defined)
* `customerId` consult Netvisor (Header: X-Netvisor-Authentication-CustomerId)
* `customerKey` consult Netvisor
* `partnerId` consult Netvisor (Header: X-Netvisor-Authentication-PartnerId)
* `partnerKey` consult Netvisor
* `organizationId` Oganization id for company

```javascript
const nvApiClient = new NetvisorApiClient({
  integrationName: '',
  customerId: '',
  customerKey: '',
  partnerId: '',
  partnerKey: '',
  organizationId: '1234567-8'
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

// More methods coming
```

## Changelog

0.0.1 Under development
0.0.3 Added method saveInvoiceByDataSet in salesinvoice
0.0.4 Added methods: inventory in products and purchaseinvoice
0.0.7 Added method getSales in salesinvoice
0.0.8 Improvements to salesinvoice and products
0.0.11 Fix undefined error (getSales) if zero results are found
0.0.12-13 Minor fix in fetching orders
0.0.14 Budgeting improvements + added methods: getBudgetAccountList and getDimensions in accounting