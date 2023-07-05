import { prisma } from '..';

export const seedMemberTypes = async () => {
  const types = [
    {
      name: 'senior',
      label: 'Senior',
      description: 'Jovens de 15 à 17 anos',
    },
    {
      name: 'pioneiro',
      label: 'Pioneiro',
      description: 'Jovens de 18 à 21 anos',
    },
    {
      name: 'mestre',
      label: 'mestre',
      description: 'Chefe pioneiro',
    },
    {
      name: 'motorista',
      label: 'Motorista',
      description: 'Motorista',
    },
  ];
  await Promise.all(
    types.map(async type =>
      prisma.memberType.upsert({
        where: {
          name: type.name,
        },
        create: {
          name: type.name,
          label: type.label,
          description: type.description,
        },
        update: {
          label: type.label,
          description: type.description,
        },
      }),
    ),
  );
};
