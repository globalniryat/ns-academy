import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CourseForm from "@/components/admin/CourseForm";

export default function NewCoursePage() {
  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div>
        <Link href="/admin/courses" className="flex items-center gap-1.5 text-sm text-muted hover:text-blue transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>
        <h1 className="font-heading text-2xl font-bold text-navy">New Course</h1>
        <p className="text-muted text-sm mt-1">Fill in the details to create a new course. You can add lessons after creation.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <CourseForm />
      </div>
    </div>
  );
}
