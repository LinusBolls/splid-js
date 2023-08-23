# Splid.Js

a reverse-engineered typescript client for the Splid (https://splid.app) API.
at the moment, only read operations are supported.

## Install

install the package:

```bash
npm install splid-js
```

## Examples

```typescript
// basic usage
import { SplidClient } from 'splid-js';

async function main() {
  const client = new SplidClient();

  const inviteCode = 'PWJ E2B P7A';

  const group = await client.group.joinByCode(inviteCode);

  const groupInfo = await client.groupInfo.getByGroup(group.result.objectId);

  const members = await client.person.getByGroup(group.result.objectId);

  const expensesAndPayments = await client.entry.getByGroup(
    group.result.objectId
  );
}
main();
```

```typescript
// using the returned data
import { SplidClient } from 'splid-js';

const formatCurrency = (amount: number, currencyCode: string) => {
  return (
    amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + currencyCode
  );
};

const getEntryDescription = (
  entry: SplidJs.Entry,
  members: SplidJs.Person[]
) => {
  const primaryPayer = members.find((j) => j.GlobalId === entry.primaryPayer);

  for (const item of entry.items) {
    const totalAmount = item.AM;

    const profiteers = Object.entries(item.P.P).map(([userId, share]) => {
      const user = members.find((j) => j.GlobalId === userId);

      const shareText = formatCurrency(totalAmount * share, entry.currencyCode);

      return user.name + ' (' + shareText + ')';
    });
    const profiteersText = profiteers.join(', ');

    const totalText = formatCurrency(totalAmount, entry.currencyCode);

    if (entry.isPayment) {
      const description =
        primaryPayer.name + ' sent ' + totalText + ' to ' + profiteersText;

      return description;
    } else {
      const description =
        primaryPayer.name + ' payed ' + totalText + ' for ' + profiteersText;

      return description;
    }
  }
};

async function main() {
  const client = new SplidClient();

  const inviteCode = 'PWJ E2B P7A';

  const group = await client.group.joinByCode(inviteCode);

  const groupInfoRes = await client.getGroup(groupRes.result.objectId);

  const expensesRes = await client.getExpensesByGroup(groupRes.result.objectId);

  const membersRes = await client.getMembersByGroup(groupRes.result.objectId);

  for (const entry of expensesRes.result.results) {
    console.log(getEntryDescription(entry, membersRes.result.results));
  }
}
main();
```
