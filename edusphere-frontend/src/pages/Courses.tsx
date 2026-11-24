import { useEffect, useState } from "react";
import { coursesAPI } from "../lib/api";

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnail_url: string;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesAPI.getAll()
      .then((data) => setCourses(data.courses))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl">Loading courses...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-indigo-700">📚 All Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
            <img
              src={course.thumbnail_url || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400"}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                {course.category}
              </span>
              <h2 className="text-lg font-semibold mt-2">{course.title}</h2>
              <p className="text-gray-500 text-sm mt-1">{course.description}</p>
              <button
                onClick={() => coursesAPI.enroll(course._id).then(() => alert("Enrolled successfully!"))}
                className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Enroll Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
