
import { createHash } from "crypto";

import {
  users,
  contactMessages,
  trainingApplications,

  studentAccounts,
  studentCourses,
  studentEnrollments,
  studentCourseRequests,

  type User,
  type InsertUser,
  type ContactMessage,
  type InsertContactMessage,
  type TrainingApplication,

  type InsertTrainingApplication,
  type StudentAccount,
  type StudentCourse,
  type StudentEnrollment,
  type StudentCourseRequest,

  type InsertTrainingApplication

} from "@shared/schema";

export interface StudentCourseSummary {
  id: number;
  courseId: number;
  title: string;
  description: string;
  status: StudentEnrollment["status"];
  progress: number;
  priceCents: number;
  updatedAt: Date;
}

export interface StudentCourseRequestSummary {
  id: number;
  courseId: number;
  courseTitle: string;
  priceCents: number;
  status: StudentCourseRequest["status"];
  createdAt: Date;
}

export interface StudentDashboardData {
  student: {
    id: number;
    cardNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string | null;
    address: string | null;
  };
  activeCourses: StudentCourseSummary[];
  inProgressCourses: StudentCourseSummary[];
  completedCourses: StudentCourseSummary[];
  pendingRequests: StudentCourseRequestSummary[];
  store: StudentCourse[];
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  createTrainingApplication(application: InsertTrainingApplication): Promise<TrainingApplication>;
  getTrainingApplications(): Promise<TrainingApplication[]>;
  getStudentByCardNumber(cardNumber: string): Promise<StudentAccount | undefined>;
  getStudentById(studentId: number): Promise<StudentAccount | undefined>;
  updateStudentPassword(studentId: number, newPasswordHash: string): Promise<StudentAccount | undefined>;
  getStudentDashboard(studentId: number): Promise<StudentDashboardData | null>;
  createStudentCourseRequest(studentId: number, courseId: number): Promise<StudentCourseRequestSummary>;
}

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");


}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactMessages: Map<number, ContactMessage>;
  private trainingApplications: Map<number, TrainingApplication>;

  private studentAccounts: Map<number, StudentAccount>;
  private studentCourses: Map<number, StudentCourse>;
  private studentEnrollments: Map<number, StudentEnrollment>;
  private studentCourseRequests: Map<number, StudentCourseRequest>;
  private currentUserId: number;
  private currentMessageId: number;
  private currentApplicationId: number;
  private currentStudentAccountId: number;
  private currentStudentCourseId: number;
  private currentEnrollmentId: number;
  private currentCourseRequestId: number;

  private currentUserId: number;
  private currentMessageId: number;
  private currentApplicationId: number;


  constructor() {
    this.users = new Map();
    this.contactMessages = new Map();
    this.trainingApplications = new Map();

    this.studentAccounts = new Map();
    this.studentCourses = new Map();
    this.studentEnrollments = new Map();
    this.studentCourseRequests = new Map();
    this.currentUserId = 1;
    this.currentMessageId = 1;
    this.currentApplicationId = 1;
    this.currentStudentAccountId = 1;
    this.currentStudentCourseId = 1;
    this.currentEnrollmentId = 1;
    this.currentCourseRequestId = 1;

    this.seedStudentPortalData();
  }

  private seedStudentPortalData() {
    const courses: Array<Omit<StudentCourse, "id">> = [
      {
        slug: "public-safety-fundamentals",
        title: "Public Safety Fundamentals",
        description: "Core knowledge for planning, communicating, and responding to public safety incidents.",
        priceCents: 27500,
        isActive: true,
        createdAt: new Date(),
      },
      {
        slug: "emergency-management-operations",
        title: "Emergency Management Operations",
        description: "Operational playbooks for coordinating multi-agency emergency responses.",
        priceCents: 31500,
        isActive: true,
        createdAt: new Date(),
      },
      {
        slug: "occupational-safety-strategies",
        title: "Occupational Safety Strategies",
        description: "Tools and templates to deploy compliant occupational health and safety programs.",
        priceCents: 28900,
        isActive: true,
        createdAt: new Date(),
      },
      {
        slug: "community-resilience-labs",
        title: "Community Resilience Labs",
        description: "Workshops focused on empowering francophone and bilingual community response teams.",
        priceCents: 24900,
        isActive: true,
        createdAt: new Date(),
      },
    ];

    courses.forEach((course) => {
      const newCourse: StudentCourse = {
        id: this.currentStudentCourseId++,
        ...course,
      };
      this.studentCourses.set(newCourse.id, newCourse);
    });

    const studentOne: StudentAccount = {
      id: this.currentStudentAccountId++,
      cardNumber: "STU-1001",
      email: "alex.durand@example.com",
      firstName: "Alex",
      lastName: "Durand",
      phoneNumber: "613-555-0101",
      address: "123 Main Street, Ottawa, ON",
      temporaryPasswordHash: hashPassword("TEMP1234"),
      passwordHash: null,
      requiresPasswordChange: true,
      isActive: true,
      createdAt: new Date(),
    };

    const studentTwo: StudentAccount = {
      id: this.currentStudentAccountId++,
      cardNumber: "STU-2044",
      email: "marie.dupont@example.com",
      firstName: "Marie",
      lastName: "Dupont",
      phoneNumber: "437-555-0199",
      address: "908 Rue King Est, Sherbrooke, QC",
      temporaryPasswordHash: hashPassword("PASSINIT"),
      passwordHash: hashPassword("Secur3Pass!"),
      requiresPasswordChange: false,
      isActive: true,
      createdAt: new Date(),
    };

    this.studentAccounts.set(studentOne.id, studentOne);
    this.studentAccounts.set(studentTwo.id, studentTwo);

    const publicSafetyCourse = Array.from(this.studentCourses.values()).find(
      (course) => course.slug === "public-safety-fundamentals",
    );
    const emergencyCourse = Array.from(this.studentCourses.values()).find(
      (course) => course.slug === "emergency-management-operations",
    );
    const ohsCourse = Array.from(this.studentCourses.values()).find(
      (course) => course.slug === "occupational-safety-strategies",
    );

    if (publicSafetyCourse) {
      const enrollment: StudentEnrollment = {
        id: this.currentEnrollmentId++,
        studentId: studentOne.id,
        courseId: publicSafetyCourse.id,
        status: "active",
        progress: 100,
        activatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
        updatedAt: new Date(),
      };
      this.studentEnrollments.set(enrollment.id, enrollment);
    }

    if (emergencyCourse) {
      const enrollment: StudentEnrollment = {
        id: this.currentEnrollmentId++,
        studentId: studentOne.id,
        courseId: emergencyCourse.id,
        status: "in-progress",
        progress: 55,
        activatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
        updatedAt: new Date(),
      };
      this.studentEnrollments.set(enrollment.id, enrollment);
    }

    if (ohsCourse) {
      const request: StudentCourseRequest = {
        id: this.currentCourseRequestId++,
        studentId: studentOne.id,
        courseId: ohsCourse.id,
        status: "pending",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
      };
      this.studentCourseRequests.set(request.id, request);
    }

    this.currentUserId = 1;
    this.currentMessageId = 1;
    this.currentApplicationId = 1;

  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentMessageId++;
    const message: ContactMessage = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async createTrainingApplication(
    insertApplication: InsertTrainingApplication,
  ): Promise<TrainingApplication> {
    const id = this.currentApplicationId++;
    const application: TrainingApplication = {
      ...insertApplication,
      id,
      createdAt: new Date(),
    };
    this.trainingApplications.set(id, application);
    return application;
  }

  async getTrainingApplications(): Promise<TrainingApplication[]> {
    return Array.from(this.trainingApplications.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async getStudentByCardNumber(cardNumber: string): Promise<StudentAccount | undefined> {
    const normalized = cardNumber.trim().toUpperCase();
    return Array.from(this.studentAccounts.values()).find(
      (student) => student.cardNumber.toUpperCase() === normalized,
    );
  }


  async getStudentById(studentId: number): Promise<StudentAccount | undefined> {
    return this.studentAccounts.get(studentId);
  }

  async updateStudentPassword(
    studentId: number,
    newPasswordHash: string,
  ): Promise<StudentAccount | undefined> {
    const account = this.studentAccounts.get(studentId);
    if (!account) {
      return undefined;
    }

    const updated: StudentAccount = {
      ...account,
      passwordHash: newPasswordHash,
      temporaryPasswordHash: newPasswordHash,
      requiresPasswordChange: false,
    };
    this.studentAccounts.set(studentId, updated);
    return updated;
  }

  async getStudentDashboard(studentId: number): Promise<StudentDashboardData | null> {
    const student = this.studentAccounts.get(studentId);
    if (!student) {
      return null;
    }

    const enrollments = Array.from(this.studentEnrollments.values()).filter(
      (enrollment) => enrollment.studentId === studentId,
    );
    const requests = Array.from(this.studentCourseRequests.values()).filter(
      (request) => request.studentId === studentId,
    );

    const formatEnrollment = (enrollment: StudentEnrollment): StudentCourseSummary => {
      const course = this.studentCourses.get(enrollment.courseId);
      return {
        id: enrollment.id,
        courseId: enrollment.courseId,
        title: course?.title ?? "Course",
        description: course?.description ?? "",
        status: enrollment.status,
        progress: enrollment.progress,
        priceCents: course?.priceCents ?? 0,
        updatedAt: enrollment.updatedAt,
      };
    };

    const formatRequest = (
      request: StudentCourseRequest,
    ): StudentCourseRequestSummary => {
      const course = this.studentCourses.get(request.courseId);
      return {
        id: request.id,
        courseId: request.courseId,
        courseTitle: course?.title ?? "Course",
        priceCents: course?.priceCents ?? 0,
        status: request.status,
        createdAt: request.createdAt,
      };
    };

    const activeCourses = enrollments
      .filter((enrollment) => enrollment.status === "active")
      .map(formatEnrollment);
    const inProgressCourses = enrollments
      .filter((enrollment) => enrollment.status === "in-progress")
      .map(formatEnrollment);
    const completedCourses = enrollments
      .filter((enrollment) => enrollment.status === "completed")
      .map(formatEnrollment);

    const pendingRequests = requests.map(formatRequest);

    const unavailableCourseIds = new Set<number>([
      ...enrollments.map((enrollment) => enrollment.courseId),
      ...requests.map((request) => request.courseId),
    ]);

    const store = Array.from(this.studentCourses.values())
      .filter((course) => course.isActive && !unavailableCourseIds.has(course.id))
      .map((course) => ({ ...course }));

    return {
      student: {
        id: student.id,
        cardNumber: student.cardNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phoneNumber: student.phoneNumber ?? null,
        address: student.address ?? null,
      },
      activeCourses,
      inProgressCourses,
      completedCourses,
      pendingRequests,
      store,
    };
  }

  async createStudentCourseRequest(
    studentId: number,
    courseId: number,
  ): Promise<StudentCourseRequestSummary> {
    const course = this.studentCourses.get(courseId);
    if (!course || !course.isActive) {
      throw new Error("course_not_found");
    }

    const alreadyEnrolled = Array.from(this.studentEnrollments.values()).some(
      (enrollment) => enrollment.studentId === studentId && enrollment.courseId === courseId,
    );
    if (alreadyEnrolled) {
      throw new Error("course_already_enrolled");
    }

    const existingRequest = Array.from(this.studentCourseRequests.values()).find(
      (request) => request.studentId === studentId && request.courseId === courseId,
    );
    if (existingRequest) {
      return {
        id: existingRequest.id,
        courseId: existingRequest.courseId,
        courseTitle: course.title,
        priceCents: course.priceCents,
        status: existingRequest.status,
        createdAt: existingRequest.createdAt,
      };
    }

    const request: StudentCourseRequest = {
      id: this.currentCourseRequestId++,
      studentId,
      courseId,
      status: "pending",
      createdAt: new Date(),
    };
    this.studentCourseRequests.set(request.id, request);

    return {
      id: request.id,
      courseId: request.courseId,
      courseTitle: course.title,
      priceCents: course.priceCents,
      status: request.status,
      createdAt: request.createdAt,
    };

  async createTrainingApplication(insertApplication: InsertTrainingApplication): Promise<TrainingApplication> {
    const id = this.currentApplicationId++;
    const application: TrainingApplication = {
      ...insertApplication,
      id,
      createdAt: new Date()
    };
    this.trainingApplications.set(id, application);
    return application;
  }

  async getTrainingApplications(): Promise<TrainingApplication[]> {
    return Array.from(this.trainingApplications.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

  }
}

export const storage = new MemStorage();
