import prisma from '../../config/db';
import { randomUUID } from 'crypto';

// MOCK Storage Service
export const storageService = {
  upload: async (file: any) => {
    // In real app: upload to S3
    return `s3://mock-bucket/${randomUUID()}-${file.filename}`;
  },
  getSignedUrl: async (path: string) => {
    return `https://mock-s3.com/${path}`; // Mock URL
  }
};

export async function createDocument(userId: number, file: any) {
  const path = await storageService.upload(file);
  
  const doc = await prisma.document.create({
    data: {
      userId,
      storagePath: path,
      status: 'PROCESSING', // Worker will pick this up
    },
  });

  // Simulator Worker: Immediately tag it (DEMO ONLY)
  // In real app, this happens in background
  setTimeout(async () => {
    const tags = await prisma.tag.findMany({ take: 2 });
    for (const tag of tags) {
      await prisma.documentTag.create({
        data: {
          documentId: doc.id,
          tagId: tag.id,
          confidence: 0.95,
        }
      });
    }
    await prisma.document.update({
      where: { id: doc.id },
      data: { status: 'READY_FOR_PREVIEW' }
    });
  }, 2000);

  return doc;
}

export async function getDocumentById(id: number, userId: number) {
  return prisma.document.findFirst({
    where: { id, userId },
    include: {
      tags: {
        include: {
          tag: true
        }
      }
    }
  });
}
