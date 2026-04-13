import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import CheckoutClient from "./CheckoutClient";

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function CheckoutPage({ params }: Props) {
  const { courseId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/checkout/${courseId}`);
  }

  const [course, enrollment] = await Promise.all([
    prisma.course.findUnique({
      where: { id: courseId, status: "PUBLISHED" },
      select: {
        id: true,
        title: true,
        slug: true,
        color: true,
        price: true,
        originalPrice: true,
        duration: true,
        sections: {
          select: { lessons: { select: { id: true } } },
        },
      },
    }),
    prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
      select: { status: true },
    }),
  ]);

  if (!course) notFound();

  // Already enrolled → go to course player
  if (enrollment && (enrollment.status === "ACTIVE" || enrollment.status === "COMPLETED")) {
    redirect(`/dashboard/${courseId}`);
  }

  const lessonCount = course.sections.reduce((sum, s) => sum + s.lessons.length, 0);

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { name: true, email: true },
  });

  return (
    <CheckoutClient
      courseId={courseId}
      courseTitle={course.title}
      courseSlug={course.slug}
      courseColor={course.color}
      price={course.price}
      originalPrice={course.originalPrice}
      duration={course.duration}
      lessonCount={lessonCount}
      userName={profile?.name ?? user.email?.split("@")[0] ?? "Student"}
      userEmail={profile?.email ?? user.email ?? ""}
    />
  );
}
