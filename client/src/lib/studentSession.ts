export interface StudentSessionStudent {
  id: number;
  cardNumber: string;
  firstName: string;
  lastName: string;
  requiresPasswordChange: boolean;
}

export interface StudentSession {
  token: string;
  student: StudentSessionStudent;
}

const STORAGE_KEY = "rg-student-portal-session";

export function getStudentSession(): StudentSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as StudentSession;
  } catch (error) {
    console.warn("Failed to parse student session from storage", error);
    return null;
  }
}

export function setStudentSession(session: StudentSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStudentSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function updateStudentSessionStudent(update: Partial<StudentSessionStudent>): StudentSession | null {
  const existing = getStudentSession();
  if (!existing) {
    return null;
  }

  const updated: StudentSession = {
    ...existing,
    student: {
      ...existing.student,
      ...update,
    },
  };
  setStudentSession(updated);
  return updated;
}
