import { notFound } from "next/navigation";
import { STATIC_COURSE } from "@/lib/static-data";
import CourseDetailClient from "./CourseDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (slug !== STATIC_COURSE.slug) return {};
  return {
    title: STATIC_COURSE.metaTitle,
    description: STATIC_COURSE.metaDescription,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;

  if (slug !== STATIC_COURSE.slug) notFound();

  return <CourseDetailClient course={STATIC_COURSE} enrollmentStatus={null} />;
}
