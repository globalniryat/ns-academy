import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
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

  return <CourseDetailClient course={course} />;
}
