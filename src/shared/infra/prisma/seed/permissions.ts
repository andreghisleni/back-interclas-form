// import { prisma } from '..';

// import { localPermissions } from './data/permissions';

// export const seedPermissions = async () => {
//   await Promise.all(
//     localPermissions.map(async permission =>
//       prisma.permission.upsert({
//         where: {
//           name: permission.name,
//         },
//         update: {
//           permission_groups: {
//             connectOrCreate: permission.groups.map(group => ({
//               where: {
//                 name: group,
//               },
//               create: {
//                 name: group,
//               },
//             })),
//           },
//         },
//         create: {
//           name: permission.name,
//           label: permission.label,
//           permission_groups: {
//             connectOrCreate: permission.groups.map(group => ({
//               where: {
//                 name: group,
//               },
//               create: {
//                 name: group,
//               },
//             })),
//           },
//         },
//       }),
//     ),
//   );
// };
