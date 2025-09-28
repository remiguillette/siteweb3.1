
import { pgTable, text, serial, boolean, timestamp, integer } from "drizzle-orm/pg-core";

import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";

import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  service: text("service").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const trainingApplications = pgTable("training_applications", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  address: text("address").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
  employmentStatus: text("employment_status").notNull(),
  employmentStatusOther: text("employment_status_other"),
  motivations: text("motivations").notNull(),
  careerGoals: text("career_goals").notNull(),
  declarationAccepted: boolean("declaration_accepted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const studentAccounts = pgTable("student_accounts", {
  id: serial("id").primaryKey(),
  cardNumber: text("card_number").notNull().unique(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phoneNumber: text("phone_number"),
  address: text("address"),
  temporaryPasswordHash: text("temporary_password_hash").notNull(),
  passwordHash: text("password_hash"),
  requiresPasswordChange: boolean("requires_password_change").default(true).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studentCourses = pgTable("student_courses", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priceCents: integer("price_cents").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studentEnrollments = pgTable("student_enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  courseId: integer("course_id").notNull(),
  status: text("status").notNull(),
  progress: integer("progress").default(0).notNull(),
  activatedAt: timestamp("activated_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const studentCourseRequests = pgTable("student_course_requests", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  courseId: integer("course_id").notNull(),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});




export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export const insertTrainingApplicationSchema = createInsertSchema(trainingApplications).omit({
  id: true,
  createdAt: true,
});


export const insertStudentAccountSchema = createInsertSchema(studentAccounts).omit({
  id: true,
  createdAt: true,
});

export const insertStudentCourseSchema = createInsertSchema(studentCourses).omit({
  id: true,
  createdAt: true,
});

export const insertStudentEnrollmentSchema = createInsertSchema(studentEnrollments).omit({
  id: true,
  activatedAt: true,
  updatedAt: true,
});

export const insertStudentCourseRequestSchema = createInsertSchema(studentCourseRequests).omit({
  id: true,
  createdAt: true,
});


export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertTrainingApplication = z.infer<typeof insertTrainingApplicationSchema>;
export type TrainingApplication = typeof trainingApplications.$inferSelect;

export type InsertStudentAccount = z.infer<typeof insertStudentAccountSchema>;
export type StudentAccount = typeof studentAccounts.$inferSelect;
export type InsertStudentCourse = z.infer<typeof insertStudentCourseSchema>;
export type StudentCourse = typeof studentCourses.$inferSelect;
export type InsertStudentEnrollment = z.infer<typeof insertStudentEnrollmentSchema>;
export type StudentEnrollment = typeof studentEnrollments.$inferSelect;
export type InsertStudentCourseRequest = z.infer<typeof insertStudentCourseRequestSchema>;
export type StudentCourseRequest = typeof studentCourseRequests.$inferSelect;
