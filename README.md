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

### Edit methods

Some resources support editing with parameter `{ method: 'edit' }`. When editing some resources in Netvisor, you will only need to pass those attributes that are to be changed and not the whole object from scratch. This is why some interfaces have all the attributes set as optional. You can always refer to Netvisor's documentation to see what attributes are actually required for certain resources.

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

| Class         | Method                            | Netvisor resource                  | Added    |
|---------------|-----------------------------------|------------------------------------|----------|
| accounting    | accountingLedger()                | accountingledger.nv                | 2.1.0    |
| accounting    | accounting()                      | accounting.nv                      | 2.1.0    |
| accounting    | accountList()                     | accountlist.nv                     | 2.5.0    |
| accounting    | voucherTypeList()                 | vouchertypelist.nv                 | 2.5.0    |
| customers     | customerList()                    | customerlist.nv                    | 2.0.0    |
| customers     | getCustomer()                     | getcustomer.nv                     | 2.0.0    |
| customers     | customer()                        | customer.nv                        | 2.0.0    |
| customers     | salesPersonnelList()              | salespersonnellist.nv              | 2.5.0    |
| dimensions    | dimensionList()                   | dimensionlist.nv                   | 2.0.0    |
| dimensions    | dimensionItem()                   | dimensionitem.nv                   | 2.1.0    |
| dimensions    | dimensionDelete()                 | dimensiondelete.nv                 | 2.1.0    |
| payments      | salesPaymentList()                | salespaymentlist.nv                | 2.0.0    |
| payments      | payment()                         | payment.nv                         | 2.2.0    |
| payments      | salesPayment()                    | salespayment.nv                    | 2.5.0    |
| payroll       | payrollPeriodCollector()          | payrollperiodcollector.nv          | 2.2.0    |
| payroll       | getEmployees()                    | getemployees.nv                    | 2.3.0    |
| payroll       | getEmployee()                     | getemployee.nv                     | 2.3.0    |
| payroll       | getPayrollPaycheckBatchList()     | getpayrollpaycheckbatchlist.nv     | 2.3.0    |
| payroll       | getPayrollPaycheckBatch()         | getpayrollpaycheckbatch.nv         | 2.3.0    |
| payroll       | employee()                        | employee.nv                        | 2.4.0    |
| payroll       | patchEmployee()                   | patchemployee.nv                   | 2.4.0    |
| payroll       | getEmployeeSalaryParameters()     | getemployeesalaryparameters.nv     | 2.4.0    |
| payroll       | employeeSalaryParameters()        | employeesalaryparameters.nv        | 2.4.0    |
| payroll       | payrollRatioList()                | payrollratiolist.nv                | 2.4.0    |
| payroll       | payrollExternalSalaryPayment()    | payrollexternalsalarypayment.nv    | 2.4.0    |
| payroll       | addJobPeriod()                    | addjobperiod.nv                    | 2.4.0    |
| payroll       | editJobPeriod()                   | editjobperiod.nv                   | 2.4.0    |
| payroll       | deleteJobPeriod()                 | deletejobperiod.nv                 | 2.4.0    |
| payroll       | attachEmployeeToSettlementPoint() | attachemployeetosettlementpoint.nv | 2.4.0    |
| payroll       | getPayrollParties()               | getpayrollparties.nv               | 2.4.0    |
| payroll       | payrollPaycheckBatch()            | payrollpaycheckbatch.nv            | 2.4.0    |
| payroll       | payrollAdvance()                  | payrolladvance.nv                  | 2.4.0    |
| products      | productList()                     | productlist.nv                     | 2.1.0    |
| products      | getProduct()                      | getproduct.nv                      | 2.1.0    |
| products      | product()                         | product.nv                         | 2.1.0    |
| products      | extendedProductList()             | extendedproductlist.nv             | 2.1.0    |
| products      | inventoryByWarehouse()            | inventorybywarehouse.nv            | 2.2.0    |
| products      | warehouseEvent()                  | warehouseevent.nv                  | 2.2.0    |
| products      | getInventoryPlaces()              | getinventoryplaces.nv              | 2.5.0    |
| purchases     | getVendor()                       | getvendor.nv                       | 2.2.0    |
| purchases     | vendor()                          | vendor.nv                          | 2.5.0    |
| purchases     | purchaseInvoice()                 | purchaseinvoice.nv                 | 2.2.0    |
| purchases     | purchaseInvoiceList()             | purchaseinvoicelist.nv             | 2.3.0    |
| purchases     | getPurchaseInvoice()              | getpurchaseinvoice.nv              | 2.3.0    |
| purchases     | purchaseOrder()                   | purchaseorder.nv                   | 2.3.0    |
| purchases     | purchaseOrderList()               | purchaseorderlist.nv               | 2.4.0    |
| purchases     | getPurchaseOrder()                | getpurchaseorder.nv                | 2.4.0    |
| sales         | salesInvoiceList()                | salesinvoicelist.nv                | 2.0.0    |
| sales         | getSalesInvoice()                 | getsalesinvoice.nv                 | 2.0.0    |
| sales         | getSalesOrder()                   | getorder.nv                        | 2.0.1    |
| sales         | salesInvoice()                    | salesinvoice.nv                    | 2.0.0    |
| sales         | updateSalesInvoiceStatus()        | updatesalesinvoicestatus.nv        | 2.6.0    |
| workday       | tripExpense()                     | tripexpense.nv                     | 2.2.0    |
| workday       | workday()                         | workday.nv                         | 2.2.0    |
| workday       | getRecordTypeList()               | getrecordtypelist.nv               | 2.7.0    |


## Examples
```ts
// Get full customer info from customer that has id 123
const customer = await netvisor.customers.getCustomer({ id: 123 });
// Get all the dimensions including hidden ones
const dimensions = await netvisor.dimensions.dimensionList({ showhidden: 1 });
// Get all the sales payments
const payments = await netvisor.payments.salesPaymentList();
// Add a new invoice to Netvisor
const netvisorKey = await netvisor.sales.salesInvoice(salesInvoice, { method: 'add' });
// Edit sales invoice that is already in Netvisor
await netvisor.sales.salesInvoice(editedSalesInvoice, { method: 'edit', id: 123 });
```
