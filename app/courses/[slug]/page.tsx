import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import CourseDetailClient from "./CourseDetailClient";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug },
    select: { metaTitle: true, metaDescription: true, title: true, shortDescription: true },
  });
  if (!course) return {};
  return {
    title: course.metaTitle || course.title,
    description: course.metaDescription || course.shortDescription,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      sections: {
        orderBy: { sortOrder: "asc" },
        include: {
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
      courseNotes: {
        orderBy: { sortOrder: "asc" },
        select: { id: true, title: true, fileUrl: true },
      },
      _count: { select: { enrollments: true } },
    },
  });

  if (!course || course.status !== "PUBLISHED") {
    notFound();
  }

  // Check if the current user is enrolled
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let enrollmentStatus: "ACTIVE" | "COMPLETED" | null = null;
  if (user) {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: course.id,
        status: { in: ["ACTIVE", "COMPLETED"] },
      },
      select: { status: true },
    });
    enrollmentStatus = (enrollment?.status as "ACTIVE" | "COMPLETED") ?? null;
  }

  return <CourseDetailClient course={course} enrollmentStatus={enrollmentStatus} />;
}
