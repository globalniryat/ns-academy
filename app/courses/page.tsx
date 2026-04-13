import { prisma } from "@/lib/prisma";
import CoursesClient from "./CoursesClient";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      shortDescription: true,
      level: true,
      price: true,
      originalPrice: true,
      duration: true,
      thumbnailUrl: true,
      freePreviewUrl: true,
      color: true,
      instructor: true,
      rating: true,
      totalRatings: true,
      _count: { select: { sections: true, enrollments: true } },
    },
  });

  return (
    <div className="min-h-screen bg-offwhite">
      <CoursesClient courses={courses} />
    </div>
  );
}
