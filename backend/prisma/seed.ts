import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tags = [
    { key: 'FORM_106', labelEn: 'Form 106', labelHe: 'טופס 106', category: 'INCOME', isSystem: true },
    { key: 'INCOME_REPORT', labelEn: 'Annual Income Report', labelHe: 'דו"ח הכנסות שנתי', category: 'INCOME', isSystem: true },
    { key: 'INSURANCE_CLAIM', labelEn: 'Insurance Claim', labelHe: 'תביעת ביטוח', category: 'INSURANCE', isSystem: true },
    { key: 'MEDICAL_EXPENSE', labelEn: 'Medical Expense', labelHe: 'הוצאה רפואית', category: 'EXPENSE', isSystem: true },
    { key: 'DONATION_RECEIPT', labelEn: 'Donation Receipt', labelHe: 'קבלה על תרומה', category: 'DEDUCTION', isSystem: true },
  ];

  console.log('Seeding tags...');
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { key: tag.key },
      update: {},
      create: tag,
    });
  }
  
  console.log('Pulling tags from DB...');
  const allTags = await prisma.tag.findMany();
  console.log('Current Tags in DB:', allTags);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
