import { prisma } from "@/lib/prisma";
import TestimonialsManager from "@/components/admin/TestimonialsManager";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const serialized = testimonials.map((t) => ({
    id: t.id,
    name: t.name,
    college: t.college,
    role: t.role,
    quote: t.quote,
    rating: t.rating,
    isActive: t.isActive,
    sortOrder: t.sortOrder,
  }));

  return <TestimonialsManager initialTestimonials={serialized} />;
}
