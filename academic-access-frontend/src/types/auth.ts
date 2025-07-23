export interface User {
  id: number;
  registrationNumber: string;
  fullName: string;
  universityEmail: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role: 'STUDENT' | 'ADMIN';
  dateOfBirth?: string;
  phoneNumber?: string;
  address?: string;
  enrollmentDate?: string;
  postalAddress?: string;
}

export interface LoginRequest {
  registrationNumber?: string;
  email?: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
}

export interface CreateStudentRequest {
  registrationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  address?: string;
}