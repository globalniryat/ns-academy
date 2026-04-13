import { prisma } from "@/lib/prisma";
import ContentEditor from "@/components/admin/ContentEditor";

export default async function AdminContentPage() {
  const items = await prisma.siteContent.findMany({ orderBy: { key: "asc" } });

  const initialContent: Record<string, string> = {};
  for (const item of items) {
    initialContent[item.key] = item.value;
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <ContentEditor initialContent={initialContent} />
    </div>
  );
}
