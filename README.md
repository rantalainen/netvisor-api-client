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

### Setup client with option

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
// Get vouchers by date
const vouchers = await nvApiClient.accounting.getVouchers('2021-01-01', '2021-01-31');

// TODO: documentation
```

## Changelog

0.0.1 Under development