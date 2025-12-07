import prisma from '../../config/db';

export async function getAllTags() {
  return prisma.tag.findMany({
    orderBy: {
      key: 'asc',
    },
  });
}
