# Splid.Js

a feature-complete typescript client for the Splid (https://splid.app) API.
Splid is a free mobile app for keeping track of expenses among friend groups.
this package is not officially associated with Splid.

none of the functionality has been tested for currencies other than `EUR`

last updated Nov 6 2024

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
  const splid = new SplidClient();

  const inviteCode = 'PWJ E2B P7A';

  const groupRes = await splid.group.getByInviteCode(inviteCode);

  const groupInfoRes = await splid.groupInfo.getByGroup(
    groupRes.result.objectId
  );

  const entriesRes = await splid.entry.getByGroup(groupRes.result.objectId);

  const membersRes = await splid.person.getByGroup(groupRes.result.objectId);

  const expensesAndPayments = await splid.entry.getByGroup(
    groupRes.result.objectId
  );
}
main();
```

```typescript
// parsing the returned data
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
  const splid = new SplidClient();

  const inviteCode = 'PWJ E2B P7A';

  const groupRes = await splid.group.getByInviteCode(inviteCode);

  const groupInfoRes = await splid.groupInfo.getByGroup(
    groupRes.result.objectId
  );

  const entriesRes = await splid.entry.getByGroup(groupRes.result.objectId);

  const membersRes = await splid.person.getByGroup(groupRes.result.objectId);

  for (const entry of entriesRes.result.results) {
    console.log(getEntryDescription(entry, membersRes.result.results));
  }
}
main();
```

```typescript
// calculating members balances and suggested payments
const people = await splid.person.getAllByGroup(groupId);
const entries = await splid.entry.getAllByGroup(groupId);

const balance = SplidClient.getBalance(people, entries);
const suggestedPayments = SplidClient.getSuggestedPayments(balance);
```

```typescript
// updating group properties
const groupInfoRes = await splid.groupInfo.getByGroup(groupId);

const groupInfo = groupInfoRes.result.results[0];

groupInfo.name = 'Modified Group 🔥';

groupInfo.customCategories.push('Pharmaceuticals 💊');

groupInfo.currencyRates.EUR = 5;

groupInfo.defaultCurrencyCode = 'EUR';

await splid.groupInfo.set(groupInfo);
```

```typescript
// updating group wallpaper (NodeJs)
import fs from 'fs';

const file = await fs.promises.readFile('image.png');

const uploadRes = await splid.file.upload(file);

groupInfo.wallpaperID = uploadRes.dataID;
```

```typescript
// updating person properties
const membersRes = await splid.person.getByGroup(groupId);

const linus = membersRes.result.results.find((i) => i.name === 'Linus');

linus.name = 'Alex';
linus.initials = 'A';

await splid.person.set(linus);
```

```typescript
// updating entry properties
const entriesRes = await splid.entry.getByGroup(groupId);

const pizzaEntries = entriesRes.result.results.filter((i) =>
  i.title.toLowerCase().includes('pizza')
);

await splid.batch((b) =>
  pizzaEntries.map((i) => {
    i.category = {
      originalName: 'Italian Food',
      type: 'custom',
    };
    return b.entry.set(i);
  })
);
```

```typescript
// creating a group
await splid.group.create('🎉 Ramber Zamber', ['Linus', 'Laurin', 'Oskar']);
```
