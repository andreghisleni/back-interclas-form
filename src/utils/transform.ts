import { IInscription } from '@modules/inscriptions/repositories/IInscriptionsRepository';
import { IMemberAll } from '@modules/inscriptions/repositories/IMembersRepository';
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

export const inscriptionTransform = (
  inscription: IInscription | IInscription[],
) => {
  const parseInscription = (i: IInscription) => ({
    ...i,
    receipt_file_url: getFileUrl(i.receipt_file),
  });

  if (Array.isArray(inscription)) {
    return inscription.map(inscriptionItem =>
      parseInscription(inscriptionItem),
    );
  }

  return parseInscription(inscription);
};

export const memberTransform = (member: IMemberAll | IMemberAll[]) => {
  const parseMember = (m: IMemberAll) => ({
    ...m,
    inscription: {
      ...m.inscription,
      receipt_file_url: getFileUrl(m.inscription.receipt_file),
    },
  });

  if (Array.isArray(member)) {
    return member.map(memberItem => parseMember(memberItem));
  }

  return parseMember(member);
};
