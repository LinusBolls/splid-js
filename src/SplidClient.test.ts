import { describe, expect, it, vi } from 'vitest';

import SplidClient from './SplidClient';

const jsonRes = (data: unknown) => {
  return { json: () => new Promise((resolve) => resolve(data)) };
};

global.fetch = vi.fn();

describe('SplidClient.group.getByInviteCode', () => {
  it('makes a http request', async () => {
    const splid = new SplidClient();

    const mockRes = {
      result: {
        objectId: '#',
        shortCode: 'xxx xxx xxx',
        extendedShortCode: '',
        longCode: '',
      },
    };

    // @ts-expect-error
    fetch.mockResolvedValue(jsonRes(mockRes));

    const res = await splid.group.getByInviteCode('xxx xxx xxx');

    expect(res).toStrictEqual(mockRes);
  });
});
