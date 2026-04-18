import { STATIC_COURSE_CARD } from "@/lib/static-data";
import CoursesClient from "./CoursesClient";

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-offwhite">
      <CoursesClient courses={[STATIC_COURSE_CARD]} />
    </div>
  );
}
