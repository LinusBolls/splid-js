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

  const groupRes = await client.group.getByInviteCode(inviteCode);

  const groupInfoRes = await client.groupInfo.getByGroup(
    groupRes.result.objectId
  );

  const entriesRes = await client.entry.getByGroup(groupRes.result.objectId);

  const membersRes = await client.person.getByGroup(groupRes.result.objectId);

  const expensesAndPayments = await client.entry.getByGroup(
    groupRes.result.objectId
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

  const groupRes = await client.group.getByInviteCode(inviteCode);

  const groupInfoRes = await client.groupInfo.getByGroup(
    groupRes.result.objectId
  );

  const entriesRes = await client.entry.getByGroup(groupRes.result.objectId);

  const membersRes = await client.person.getByGroup(groupRes.result.objectId);

  for (const entry of entriesRes.result.results) {
    console.log(getEntryDescription(entry, membersRes.result.results));
  }
}
main();
```

```typescript
// updating group properties

const groupInfoRes = await client.groupInfo.getByGroup(
  groupRes.result.objectId
);

const groupInfo = groupInfoRes.result.results[0];

groupInfo.name = 'Modified Group 🔥';

groupInfo.customCategories.push('Pharmaceuticals 💊');

groupInfo.currencyRates.EUR = 5;

groupInfo.defaultCurrencyCode = 'EUR';

await client.groupInfo.set(groupInfo);
```

```typescript
// updating group wallpaper (NodeJs)

import fs from 'fs';

const file = await fs.promises.readFile('image.png');

const uploadRes = await client.file.upload(file);

groupInfo.wallpaperID = uploadRes.dataID;
```

```typescript
// updating person properties

const membersRes = await client.person.getByGroup(groupRes.result.objectId);

const linus = membersRes.result.results.find((i) => i.name === 'Linus');

linus.name = 'Alex';
linus.initials = 'A';

await client.person.set(linus);
```

```typescript
// updating entry properties

const membersRes = await client.person.getByGroup(groupRes.result.objectId);

const linus = membersRes.result.results.find((i) => i.name === 'Linus');

linus.name = 'Alex';
linus.initials = 'A';

await client.person.set(linus);
```
