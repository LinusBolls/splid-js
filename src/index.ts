import fs from 'fs';
import SplidClient from './SplidClient';
import { generateInviteCodes } from './inviteCodes';
import { join } from 'path';

export { default as SplidClient } from './SplidClient';

export { SplidJs } from './types';

async function main() {
  const client = new SplidClient();

  //   const createGroupRes = await client.group.create();

  //   const createPersonRes = await client.person.create(
  //     createGroupRes.result.objectId,
  //     {
  //       initials: 'AMG',
  //       name: 'Sack',
  //     }
  //   );
  //   console.log(createGroupRes);

  //   console.log(createPersonRes);

  //   const getGroupInfoRes = await client.groupInfo.getByGroup(
  //     createGroupRes.result.objectId
  //   );

  //   console.log(getGroupInfoRes);

  let numCodesTried = 0;
  let numCodesToTry = 10;

  while (true) {
    const codes = generateInviteCodes(numCodesToTry, numCodesTried);

    const before = Date.now();

    const res = await client.batchMultipleRequests(codes);

    console.log('completed:', numCodesTried + numCodesToTry);

    const after = Date.now();

    const batch = {
      skip: numCodesTried,
      amount: numCodesToTry,
      timeMs: after - before,
      codes: res,
    };
    await fs.promises.writeFile(
      join(
        __dirname,
        '../data/',
        `inviteCodes-${numCodesTried}-to-${numCodesTried + numCodesToTry}.json`
      ),
      JSON.stringify(batch, null, 2)
    );

    numCodesTried += numCodesToTry;
  }
}
main();
