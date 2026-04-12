import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import CoursePlayerClient from "./CoursePlayerClient";

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function CoursePlayerPage({ params }: Props) {
  const { courseId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/dashboard/${courseId}`);
  }

  const [course, enrollment] = await Promise.all([
    prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        slug: true,
        sections: {
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            title: true,
            sortOrder: true,
            lessons: {
              orderBy: { sortOrder: "asc" },
              select: {
                id: true,
                title: true,
                description: true,
                videoUrl: true,
                duration: true,
                isFreePreview: true,
                sortOrder: true,
              },
            },
          },
        },
      },
    }),
    prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
      select: { status: true },
    }),
  ]);

  if (!course) notFound();

  // Redirect to course page if not enrolled
  if (
    !enrollment ||
    (enrollment.status !== "ACTIVE" && enrollment.status !== "COMPLETED")
  ) {
    redirect(`/courses/${course.slug}`);
  }

  // Fetch current lesson progress in one query
  const allLessonIds = course.sections.flatMap((s) => s.lessons.map((l) => l.id));
  const progressRows = await prisma.lessonProgress.findMany({
    where: { userId: user.id, lessonId: { in: allLessonIds } },
    select: { lessonId: true, isCompleted: true },
  });

  const initialProgress: Record<string, boolean> = {};
  for (const p of progressRows) {
    initialProgress[p.lessonId] = p.isCompleted;
  }

  return (
    <CoursePlayerClient
      courseId={courseId}
      courseTitle={course.title}
      sections={course.sections}
      enrollmentStatus={enrollment.status}
      initialProgress={initialProgress}
    />
  );
}
