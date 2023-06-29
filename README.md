# netvisor-api-client

Third party Netvisor API client.

:warning: This tool is work in progress and is still missing many API end points.

## Installation

Install from npm:

```
npm install @rantalainen/netvisor-api-client
```

## Setup

### Import to NodeJS project

```js
const { NetvisorApiClient } = require('@rantalainen/netvisor-api-client');
```

### Import to TypeScript project

```ts
import { NetvisorApiClient } from '@rantalainen/netvisor-api-client';
```

### Setup client

- `integrationName` Name for integration that is visible in Netvisor UI (self defined)
- `customerId` consult Netvisor (Header: X-Netvisor-Authentication-CustomerId)
- `customerKey` consult Netvisor
- `partnerId` consult Netvisor (Header: X-Netvisor-Authentication-PartnerId)
- `partnerKey` consult Netvisor
- `organizationId` Oganization id for company

Since v0.14.0 allows using cacheable-lookup with either internal or external dns cache. Make sure you are using cacheable-lookup@5 which is compatible with got@11 that is used.

```ts
const netvisor = new NetvisorApiClient({
  integrationName: '',
  customerId: '',
  customerKey: '',
  partnerId: '',
  partnerKey: '',
  organizationId: '1234567-8'

  // optional - set to true if you want to use internal cache within Netvisor API Client
  dnsCache: dnsCache
});
```

## Methods

All the methods will follow Visma Netvisor's integration resources. Methods are divided by category and there is also general methods for handling the raw xml data. More methods are added with future versions. If there is a method you need but it's not yet supported in the v2 api client, use previous versions of the api client or use one of the general xml methods. You can find currently implemented methods from [Added methods](#added-methods).

You can reference Netvisor's integration [documentation](https://support.netvisor.fi/en/support/solutions/77000205228) for more info about certain resource/method and their properties.

### General methods

With these methods, you can call any resource you want but the result and input data will be xml string.

```ts
// Each resource category has saveByXmlData() method (example with product)
const data =
`<root>
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
</root>`;
await netvisor.product.saveByXmlData('product.nv', data, { method: 'add' });

// Each resource category has getXmlData() method to get the raw xml data as a string (example with sales invoice)
const xmlString = await netvisor.sales.getXmlData('getsalesinvoice.nv', { netvisorkey: '123', showcommentlines: '1' });
```

### Added methods

| Class         | Method             | Netvisor resource   | Added    |
|---------------|--------------------|---------------------|----------|
| customers     | customerList()     | customerlist.nv     | 2.0.0    |
| customers     | getCustomer()      | getcustomer.nv      | 2.0.0    |
| customers     | customer()         | customer.nv         | 2.0.0    |
| dimensions    | dimensionList()    | dimensionlist.nv    | 2.0.0    |
| payments      | salesPaymentList() | salespaymentlist.nv | 2.0.0    |
| sales         | salesInvoiceList() | salesinvoicelist.nv | 2.0.0    |
| sales         | getSalesInvoice()  | getsalesinvoice.nv  | 2.0.0    |
| sales         | salesInvoice()     | salesinvoice.nv     | 2.0.0    |


## Examples
```ts
// Get full customer info from customer that has id 123
const customer = await netvisor.customers.getCustomer({ id: 123 });
// Get all the dimensions including hidden ones
const dimensions = await netvisor.dimensions.dimensionList({ showhidden: 1 });
// Get all the sales payments
const payments = await netvisor.payments.salesPaymentList();
// Add a new invoice to Netvisor
const netvisorKey = await netvisor.sales.salesInvoice(salesInvoice, { method: 'add'});
// Edit sales invoice that is already in Netvisor
await netvisor.sales.salesInvoice(editedSalesInvoice, { method: 'edit', id: 123 });
```
