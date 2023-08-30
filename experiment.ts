type RequestDetails = {
  method: string;
  path: string;
  body: any;
};

type WithRequestInfoResponse<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => RequestDetails;

// Request.ts
class RequestHandler<CallSignature extends (...args: any[]) => any> {
  id: string;

  private getFunc: WithRequestInfoResponse<CallSignature>;
  private executeFunc: CallSignature;

  constructor(
    id: string,
    getFunc: WithRequestInfoResponse<CallSignature>,
    executeFunc: CallSignature
  ) {
    this.id = id;

    this.getFunc = getFunc;
    this.executeFunc = executeFunc;
  }
  getDetails = ((...args) =>
    this.getFunc(...args)) as WithRequestInfoResponse<CallSignature>;
  execute = ((...args) => this.executeFunc(...args)) as CallSignature;
}

type RequestConfig = any;
type BasePersonInput = any;

const createPerson = new RequestHandler(
  'createPerson',
  (config: RequestConfig, groupId: string, person: BasePersonInput) => ({
    method: 'POST',
    path: '/parse/classes/Person',
    body: {
      name: person.name,
      initials: person.initials,

      GlobalId: generateUuid(),

      createdGlobally: {
        __type: 'Date',
        iso: dateToIso(new Date()),
      },
      group: {
        __type: 'Pointer',
        className: '_User',
        objectId: groupId,
      },
      UpdateID: generateUuid(),
      UpdateInstallationID: config.installationId,
    },
  }),
  async (config: RequestConfig, groupId: string, person: BasePersonInput) => {
    // option a: config.getRequestDetails()
    // option b: passed in as parameter
    // option c: reference the function

    return {
      objectId: 'QjisA7kjLi',
      createdAt: new Date(),
    };
  }
);

const createPersonRes = createPerson.execute('foo');

const createPersonInfo = createPerson.getDetails('foo');

class Dong {
  person = {
    create: this.injectRequestConfig(createPerson),
  };
}

// // createPerson.ts
// function getCreatePerson() {

//   return {};
// }
// function performCreatePerson(): {
//   objectId: 'QjisA7kjLi';
//   createdAt: Date;
// } {
//   return null as any
// }
// export const createPerson = new Request("createPerson").get(getCreatePerson).execute(performCreatePerson)

// // SplidRequest.ts
// const SplidRequest = {
//   createPerson,
// } as const;

// interface QueryDongs {

//   person: {
//     create: FuncWithoutConfigArg<typeof SplidRequest.createPerson.get>;
//     update: any;
//   },
// }

// export class BatchClient implements QueryDongs {
//   constructor() {}

//   group = {
//     getByInviteCode: this.injectRequestConfig(
//       SplidRequest.joinGroupWithAnyCode.get
//     ),
//   };
//   person = {
//     create: this.injectRequestConfig(SplidRequest.createPerson.get),
//     update: this.injectRequestConfig(SplidRequest.updatePerson.get),
//   };
//   private injectRequestConfig<
//     F extends (requestConfig: RequestConfig, ...args: any[]) => any,
//   >(f: F) {
//     // @ts-ignore
//     const newF: FuncWithoutConfigArg<typeof f> = (...args) => {
//       return f({} as any, ...args);
//     };
//     return newF;
//   }
//   // private requestConfig: RequestConfig = {
//   //     httpClient: {
//   //         post: (url: string, body: any, options: any): BatchItem => ({
//   //             method: "POST",
//   //             path: url,
//   //             body,
//   //         }),
//   //     },

//   // };

//   // private injectRequestConfig<
//   //     F extends (requestConfig: RequestConfig, ...args: any[]) => Promise<any>,
//   // >(f: F) {
//   //     // @ts-ignore
//   //     const newF: FuncWithoutConfigArg<typeof f> = async (...args) => {

//   //         const result = await f(this.requestConfig, ...args);
//   //      }

//   //     return newF
//   // }
// }
