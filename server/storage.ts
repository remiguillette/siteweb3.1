import {
  users,
  contactMessages,
  trainingApplications,
  type User,
  type InsertUser,
  type ContactMessage,
  type InsertContactMessage,
  type TrainingApplication,
  type InsertTrainingApplication
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  createTrainingApplication(application: InsertTrainingApplication): Promise<TrainingApplication>;
  getTrainingApplications(): Promise<TrainingApplication[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactMessages: Map<number, ContactMessage>;
  private trainingApplications: Map<number, TrainingApplication>;
  private currentUserId: number;
  private currentMessageId: number;
  private currentApplicationId: number;

  constructor() {
    this.users = new Map();
    this.contactMessages = new Map();
    this.trainingApplications = new Map();
    this.currentUserId = 1;
    this.currentMessageId = 1;
    this.currentApplicationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
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
      createdAt: new Date()
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

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
