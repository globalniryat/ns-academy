import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CourseForm from "@/components/admin/CourseForm";
import SectionEditor from "@/components/admin/SectionEditor";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: Props) {
  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { sortOrder: "asc" },
        include: { lessons: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  if (!course) notFound();

  const initialFormData = {
    title: course.title,
    slug: course.slug,
    shortDescription: course.shortDescription,
    description: course.description,
    level: course.level,
    status: course.status,
    price: String(Math.round(course.price / 100)),
    originalPrice: String(Math.round(course.originalPrice / 100)),
    duration: course.duration,
    color: course.color,
    instructor: course.instructor,
    metaTitle: course.metaTitle ?? "",
    metaDescription: course.metaDescription ?? "",
    freePreviewUrl: course.freePreviewUrl ?? "",
    thumbnailUrl: course.thumbnailUrl ?? "",
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl">
      <div>
        <Link href="/admin/courses" className="flex items-center gap-1.5 text-sm text-muted hover:text-blue transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>
        <h1 className="font-heading text-2xl font-bold text-navy line-clamp-1">{course.title}</h1>
        <p className="text-muted text-sm mt-1 font-mono">{course.slug}</p>
      </div>

      {/* Course details form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-heading font-bold text-navy mb-5">Course Details</h2>
        <CourseForm courseId={id} initial={initialFormData} />
      </div>

      {/* Curriculum editor */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="mb-5">
          <h2 className="font-heading font-bold text-navy">Curriculum</h2>
          <p className="text-muted text-sm mt-1">
            {course.sections.length} sections ·{" "}
            {course.sections.reduce((acc, s) => acc + s.lessons.length, 0)} lessons
          </p>
        </div>
        <SectionEditor courseId={id} initialSections={course.sections} />
      </div>
    </div>
  );
}
