import fs from 'fs';
import SplidClient from './SplidClient';
import { generateInviteCodes } from './inviteCodes';
import { join } from 'path';

export { default as SplidClient } from './SplidClient';

export { SplidJs } from './types';

async function main() {
  const client = new SplidClient({
    maxRetries: -1,
  });

  const createGroupRes = await client.group.create();

  console.log('createGroupRes:', createGroupRes);

  const groupId = createGroupRes.result.objectId;

  const createGroupInfoRes = await client.groupInfo.create(groupId, {
    name: 'Sack',
    defaultCurrencyCode: 'EUR',
    customCategories: [],
  });
  console.log('createGroupInfoRes:', createGroupInfoRes);

  const createPersonRes = await client.person.create(groupId, {
    initials:
      "these are some very lengthy initials for such a short name, don't you think? 🤔",
    name: 'Sack',
  });
  console.log('createPersonRes:', createPersonRes);

  const membersRes = await client.person.getByGroup(groupId);

  console.log('membersRes:', membersRes.result.results);

  const getGroupInfoRes = await client.groupInfo.getByGroup(groupId);
  console.log('getGroupInfoRes:', JSON.stringify(getGroupInfoRes, null, 2));

  const deletePersonRes = await client.person.delete(createPersonRes.objectId);

  console.log('deletePersonRes:', deletePersonRes);

  const membersRes2 = await client.person.getByGroup(groupId);

  console.log('membersRes2:', membersRes2.result.results);

  // const inviteCodes = generateInviteCodes(100);

  // const res = await client.batch((b) =>
  //   inviteCodes.map(b.group.getByInviteCode)
  // );

  const [person1, person2] = await client.batch((b) => [
    b.person.create(groupId, {
      name: 'Linus Bolls',
      initials: 'LB',
    }),
    b.person.create(groupId, {
      name: 'Florian König',
      initials: 'FK',
    }),
  ]);

  // const person1 = await client.person.create(groupId, {});
  // const person2 = await client.person.create(groupId, {});

  // let numCodesTried = 0;
  // let numCodesToTry = 1000;

  // while (true) {
  //   const codes = generateInviteCodes(numCodesToTry, numCodesTried);

  //   const before = Date.now();

  //   const res = await client.batchMultipleRequests(codes);

  //   console.log('completed in:', numCodesTried + numCodesToTry);

  //   const after = Date.now();

  //   const batch = {
  //     skip: numCodesTried,
  //     amount: numCodesToTry,
  //     timeMs: after - before,
  //     codes: res,
  //   };
  //   await fs.promises.writeFile(
  //     join(
  //       __dirname,
  //       '../data/',
  //       `inviteCodes-${numCodesTried}-to-${numCodesTried + numCodesToTry}.json`
  //     ),
  //     JSON.stringify(batch, null, 2)
  //   );

  //   numCodesTried += numCodesToTry;
  // }
}
main();
