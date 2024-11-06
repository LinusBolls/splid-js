<img src="docs/banner.svg" width="100%" />

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

  const groupId = groupRes.result.objectId;

  const members = await splid.person.getAllByGroup(groupId);
  const expensesAndPayments = await splid.entry.getAllByGroup(groupId);

  const balance = SplidClient.getBalance(members, expensesAndPayments);
  const suggestedPayments = SplidClient.getSuggestedPayments(balance);

  console.log(balance, suggestedPayments);
}
main();
```

```typescript
// parsing the returned data
import { SplidClient } from 'splid-js';

const formatCurrency = (amount: number, currency: string) => {
  return amount.toLocaleString(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getEntryDescription = (
  entry: SplidJs.Entry,
  members: SplidJs.Person[]
) => {
  const primaryPayer = members.find((i) => i.GlobalId === entry.primaryPayer);

  for (const item of entry.items) {
    const totalAmount = item.AM;
    // a map of a userId to their share (how much they profit from the expense). the shares are floats between 0 and 1 and their sum is exactly 1.
    const userIdToShareMap = item.P.P;

    const profiteers = Object.entries(userIdToShareMap).map(
      ([userId, share]) => {
        const user = members.find((i) => i.GlobalId === userId);

        const shareText = formatCurrency(
          totalAmount * share,
          entry.currencyCode
        );
        return user.name + ' (' + shareText + ')';
      }
    );
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

  const groupId = groupRes.result.objectId;

  const members = await splid.person.getAllByGroup(groupId);
  const expensesAndPayments = await splid.entry.getAllByGroup(groupId);

  for (const entry of expensesAndPayments) {
    console.log(getEntryDescription(entry, members));
  }
}
main();
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
const members = await splid.person.getAllByGroup(groupId);

const linus = members.find((i) => i.name === 'Linus');

linus.name = 'Alex';
linus.initials = 'A';

await splid.person.set(linus);
```

```typescript
// updating entry properties
const entries = await splid.entry.getAllByGroup(groupId);

const pizzaEntries = entries.filter((i) =>
  i.title.toLowerCase().includes('pizza')
);

for (const entry of pizzaEntries) {
  entry.category = {
    type: 'custom',
    originalName: 'Italian Food 🍕',
  };
}
await splid.entry.set(pizzaEntries);
```

```typescript
// creating a group
await splid.group.create('🎉 Ramber Zamber', ['Linus', 'Laurin', 'Oskar']);
```

```typescript
// creating a basic expense
await splid.entry.expense.create(
  {
    groupId,
    payers: [linus.GlobalId],
    title: 'döner',
  },
  {
    amount: 10,
    // equivalent to equivalent to { [laurin.GlobalId]: 0.5, [oskar.GlobalId]: 0.5 }
    profiteers: [laurin.GlobalId, oskar.GlobalId],
  }
);
```

```typescript
// creating an expense with multiple items
await splid.entry.expense.create(
  {
    groupId,
    payers: [linus.GlobalId],
    title: 'shopping spree 😌',
  },
  [
    {
      title: 'gucci belt',
      amount: 10,
      profiteers: [laurin.GlobalId],
    },
    {
      title: 'drippy hat',
      amount: 15,
      profiteers: [oskar.GlobalId],
    },
  ]
);
```

```typescript
// creating an expense with multiple payers (both pay half)
await splid.entry.expense.create(
  {
    groupId,
    // equivalent to { [linus.GlobalId]: 5, [oskar.GlobalId]: 5 }
    payers: [linus.GlobalId, oskar.GlobalId],
    title: 'döner',
  },
  {
    amount: 10,
    profiteers: [linus.GlobalId, oskar.GlobalId],
  }
);
```

```typescript
// creating an expense with unevenly split payers (oskar pays 3€)
await splid.entry.expense.create(
  {
    groupId,
    // equivalent to { [linus.GlobalId]: 7, [oskar.GlobalId]: 3 }
    payers: [linus.GlobalId, { id: oskar.GlobalId, amount: 3 }],
    title: 'shopping',
  },
  {
    amount: 10,
    profiteers: [laurin.GlobalId],
  }
);
```

```typescript
// creating an expense with unevenly split profiteers (oskar owes 2.25€)
await splid.entry.expense.create(
  {
    groupId,
    payers: [linus.GlobalId],
    title: 'shopping',
  },
  {
    amount: 10,
    // equivalent to { [linus.GlobalId]: 3 / 4, [oskar.GlobalId]: 1 / 4 }
    profiteers: [linus.GlobalId, { id: oskar.GlobalId, share: 1 / 4 }],
  }
);
```
