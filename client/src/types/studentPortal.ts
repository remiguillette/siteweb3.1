export interface StudentProfile {
  id: number;
  cardNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
}

export interface StudentCourseSummary {
  id: number;
  courseId: number;
  title: string;
  description: string;
  status: string;
  progress: number;
  priceCents: number;
  updatedAt: string;
}

export interface StudentCourseRequestSummary {
  id: number;
  courseId: number;
  courseTitle: string;
  priceCents: number;
  status: string;
  createdAt: string;
}

export interface StudentDashboardData {
  student: StudentProfile;
  activeCourses: StudentCourseSummary[];
  inProgressCourses: StudentCourseSummary[];
  completedCourses: StudentCourseSummary[];
  pendingRequests: StudentCourseRequestSummary[];
  store: Array<{
    id: number;
    slug: string;
    title: string;
    description: string;
    priceCents: number;
    isActive: boolean;
    createdAt: string;
  }>;
}
