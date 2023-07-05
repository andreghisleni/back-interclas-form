
import { IUser } from '@modules/users/repositories/IUsersRepository';

import { getFileUrl } from './getFileUrl';

// import { getAvatarUrl } from './getAvatarUrl';
// import { getPermissions } from './getPermissions';

export const userTransform = (user: IUser | IUser[]) => {
  const parseUser = (u: IUser) => ({
    ...u,
    // avatarUrl: getAvatarUrl(u.avatar),
    // permissions: getPermissions(u),
    password: undefined,
    // permission_groups: undefined,
  });

  if (Array.isArray(user)) {
    return user.map(userItem => parseUser(userItem));
  }

  return parseUser(user);
};

// export const transactionTransform = (
//   transaction: ITransaction | ITransaction[],
// ) => {
//   const parseTransaction = (u: ITransaction) => ({
//     ...u,
//     // avatarUrl: getAvatarUrl(u.avatar),
//     bill: undefined,
//     bill_url: u.bill.map(b => getFileUrl(b, u.client_id)),
//   });

//   if (Array.isArray(transaction)) {
//     return transaction.map(transactionItem =>
//       parseTransaction(transactionItem),
//     );
//   }

//   return parseTransaction(transaction);
// };
