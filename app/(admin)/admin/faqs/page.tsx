import { prisma } from "@/lib/prisma";
import FaqsManager from "@/components/admin/FaqsManager";

export default async function AdminFAQsPage() {
  const faqs = await prisma.fAQ.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const serialized = faqs.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
    isActive: f.isActive,
    sortOrder: f.sortOrder,
  }));

  return <FaqsManager initialFaqs={serialized} />;
}
