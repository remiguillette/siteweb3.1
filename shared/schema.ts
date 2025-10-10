import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";
import { z } from "zod";

const timestampDefault = sql`(strftime('%s','now'))`;

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactMessages = sqliteTable("contact_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  service: text("service").notNull(),
  message: text("message").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(timestampDefault).notNull(),
});

export const trainingApplications = sqliteTable("training_applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
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
  declarationAccepted: integer("declaration_accepted", { mode: "boolean" }).default(false).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(timestampDefault).notNull(),
});

export const studentAccounts = sqliteTable("student_accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  cardNumber: text("card_number").notNull().unique(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phoneNumber: text("phone_number"),
  address: text("address"),
  temporaryPasswordHash: text("temporary_password_hash").notNull(),
  passwordHash: text("password_hash"),
  requiresPasswordChange: integer("requires_password_change", { mode: "boolean" }).default(true).notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(timestampDefault).notNull(),
});

export const studentCourses = sqliteTable("student_courses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priceCents: integer("price_cents").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(timestampDefault).notNull(),
});

export const studentEnrollments = sqliteTable("student_enrollments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("student_id").notNull(),
  courseId: integer("course_id").notNull(),
  status: text("status").notNull(),
  progress: integer("progress").default(0).notNull(),
  activatedAt: integer("activated_at", { mode: "timestamp" }).default(timestampDefault).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(timestampDefault).notNull(),
});

export const studentCourseRequests = sqliteTable("student_course_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("student_id").notNull(),
  courseId: integer("course_id").notNull(),
  status: text("status").default("pending").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(timestampDefault).notNull(),
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
