import { 
  LoginRequest, 
  LoginResponse, 
  User, 
  ChangePasswordRequest, 
  ResetPasswordRequest,
  CreateStudentRequest 
} from '@/types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      const errorText = await response.text();
      let errorMessage = 'An error occurred';
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = errorText || `HTTP ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }

    const text = await response.text();
    if (!text) return {} as T;
    
    try {
      return JSON.parse(text);
    } catch {
      return text as unknown as T;
    }
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return this.handleResponse<LoginResponse>(response);
  }

  // User Profile (Student or Admin)
  async getCurrentUser(): Promise<User> {
    const userStr = localStorage.getItem('user');
    let endpoint = '/api/students/me';
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'ADMIN') {
          endpoint = '/api/admins/me';
        }
      } catch {}
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<User>(response);
  }

  async changePassword(request: ChangePasswordRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/students/me/password`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });
    return this.handleResponse<void>(response);
  }

  // Admin - Student Management
  async getAllStudents(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/api/students`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<User[]>(response);
  }

  async getStudentById(id: number): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<User>(response);
  }

  async createStudent(student: CreateStudentRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/students`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(student),
    });
    return this.handleResponse<User>(response);
  }

  async deleteStudent(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  async resetStudentPassword(registrationNumber: string, request: ResetPasswordRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/students/${registrationNumber}/reset-password`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });
    return this.handleResponse<void>(response);
  }

  // Course Management
  async getAllCourses(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/courses`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getCourseById(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async createCourse(course: { courseCode: string; courseTitle: string; program: { id: number } }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/courses`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(course),
    });
    return this.handleResponse<any>(response);
  }

  async updateCourse(id: number, course: { courseCode: string; courseTitle: string; program: { id: number } }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(course),
    });
    return this.handleResponse<any>(response);
  }

  async deleteCourse(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  // Unit Management
  async getAllUnits(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/units`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getUnitById(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/units/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async createUnit(unit: { code: string; title: string }, courseId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/units?courseId=${courseId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(unit),
    });
    return this.handleResponse<any>(response);
  }

  async updateUnit(id: number, unit: { code: string; title: string }, courseId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/units/${id}?courseId=${courseId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(unit),
    });
    return this.handleResponse<any>(response);
  }

  async deleteUnit(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/units/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  // Program Management
  async getAllPrograms(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/programs`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getProgramById(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/programs/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async createProgram(program: { programCode: string; programTitle: string }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/programs`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(program),
    });
    return this.handleResponse<any>(response);
  }

  async updateProgram(id: number, program: { programCode: string; programTitle: string }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/programs/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(program),
    });
    return this.handleResponse<any>(response);
  }

  async deleteProgram(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/programs/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  // Reports
  async getEnrollmentsByProgramReport(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/reports/enrollments-by-program`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  // Enrollment Management
  async getAllEnrollments(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/enrollments`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getEnrollmentById(enrollmentId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/enrollments/${enrollmentId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async getEnrollmentsByStudent(studentId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/enrollments/student/${studentId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getEnrollmentsByProgram(programId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/enrollments/program/${programId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async deleteEnrollment(enrollmentId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/enrollments/${enrollmentId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  // CSV Import/Export
  async exportStudentsToCsv(): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/csv/export/students`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to export students');
    }
    return response.blob();
  }

  async exportEnrollmentsToCsv(): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/csv/export/enrollments`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to export enrollments');
    }
    return response.blob();
  }

  async importStudentsFromCsv(file: File): Promise<string[]> {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/api/csv/import/students`, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    return this.handleResponse<string[]>(response);
  }

  async bulkEnrollStudentsFromCsv(file: File): Promise<string[]> {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/api/csv/import/enrollments`, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    return this.handleResponse<string[]>(response);
  }

  async downloadStudentsCsvTemplate(): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/csv/template/students`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to download template');
    }
    return response.blob();
  }

  async downloadEnrollmentsCsvTemplate(): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/csv/template/enrollments`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to download template');
    }
    return response.blob();
  }

  // Fee Management
  async getAllFees(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/fees`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getActiveFees(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/fees/active`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getFeeById(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/fees/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async createFee(fee: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/fees`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(fee),
    });
    return this.handleResponse<any>(response);
  }

  async updateFee(id: number, fee: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/fees/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(fee),
    });
    return this.handleResponse<any>(response);
  }

  async deleteFee(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/fees/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  // Student Fee Management
  async getAllStudentFees(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/student-fees`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getStudentFeesByStudentId(studentId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/student-fees/student/${studentId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getOverdueFees(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/student-fees/overdue`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async createStudentFee(studentFee: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/student-fees`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(studentFee),
    });
    return this.handleResponse<any>(response);
  }

  async updateStudentFee(id: number, studentFee: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/student-fees/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(studentFee),
    });
    return this.handleResponse<any>(response);
  }

  async deleteStudentFee(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/student-fees/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  async getOutstandingAmount(studentId: number): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/api/student-fees/student/${studentId}/outstanding`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<number>(response);
  }

  async getPaidAmount(studentId: number): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/api/student-fees/student/${studentId}/paid`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<number>(response);
  }

  // Payment Management
  async getAllPayments(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/payments`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getPaymentsByStudentId(studentId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/payments/student/${studentId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async createPayment(payment: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/payments`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payment),
    });
    return this.handleResponse<any>(response);
  }

  async updatePaymentStatus(id: number, status: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/payments/${id}/status?status=${status}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async deletePayment(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/payments/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  async getTotalPaidAmount(studentId: number): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/api/payments/student/${studentId}/total-paid`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<number>(response);
  }

  // Transcript & Certificate
  async getTranscriptMe(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/transcript/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async downloadTranscriptPdfMe(): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/transcript/me/pdf`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to download transcript PDF');
    return response.blob();
  }

  async downloadCertificatePdfMe(): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/certificate/me/pdf`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Blob>(response);
  }

  // Enrollment Request Management
  async createEnrollmentRequest(studentId: number, programId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/enrollment-requests?studentId=${studentId}&programId=${programId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async createEnrollmentRequestWithCourses(studentId: number, programId: number, trimesterId: number, courseIds: number[]): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/enrollment-requests/with-courses`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        studentId, // camelCase
        programId, // camelCase
        trimesterId, // camelCase
        courseIds
      }),
    });
    return this.handleResponse<any>(response);
  }

  async getEnrollmentRequestsByStudent(studentId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/enrollment-requests/student/${studentId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async canRequestEnrollment(studentId: number, programId: number): Promise<{canRequest: boolean, reason?: string}> {
    const response = await fetch(`${API_BASE_URL}/api/enrollment-requests/can-request/${studentId}/${programId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{canRequest: boolean, reason?: string}>(response);
  }

  async getAllEnrollmentRequests(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/enrollment-requests`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getEnrollmentRequestsByStatus(status: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/enrollment-requests/status/${status}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getEnrollmentRequestById(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/enrollment-requests/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async approveEnrollmentRequest(id: number, adminNotes?: string): Promise<any> {
    const params = new URLSearchParams();
    if (adminNotes) params.append('adminNotes', adminNotes);
    
    const response = await fetch(`${API_BASE_URL}/api/enrollment-requests/${id}/approve?${params}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async rejectEnrollmentRequest(id: number, adminNotes?: string): Promise<any> {
    const params = new URLSearchParams();
    if (adminNotes) params.append('adminNotes', adminNotes);
    
    const response = await fetch(`${API_BASE_URL}/api/enrollment-requests/${id}/reject?${params}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async deleteEnrollmentRequest(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/enrollment-requests/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  // Trimester Management
  async createTrimester(trimester: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/trimesters`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(trimester),
    });
    return this.handleResponse<any>(response);
  }

  async getAllTrimesters(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/trimesters`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getActiveTrimesters(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/trimesters/active`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getTrimestersByType(periodType: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/trimesters/type/${periodType}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getTrimestersByAcademicYear(academicYear: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/trimesters/year/${academicYear}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getTrimesterById(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/trimesters/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async updateTrimester(id: number, trimester: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/trimesters/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(trimester),
    });
    return this.handleResponse<any>(response);
  }

  async deleteTrimester(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/trimesters/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  // Program Course Management
  async addCourseToProgram(programId: number, courseId: number, trimesterId: number, creditHours: number, isCore: boolean = true, prerequisites?: string): Promise<any> {
    const params = new URLSearchParams({
      programId: programId.toString(),
      courseId: courseId.toString(),
      trimesterId: trimesterId.toString(),
      creditHours: creditHours.toString(),
      isCore: isCore.toString(),
    });
    if (prerequisites) params.append('prerequisites', prerequisites);
    
    const response = await fetch(`${API_BASE_URL}/api/program-courses?${params}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async getCoursesByProgramAndTrimester(programId: number, trimesterId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/program-courses/program/${programId}/trimester/${trimesterId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getCoursesByTrimester(trimesterId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/program-courses/trimester/${trimesterId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getCoursesByProgram(programId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/program-courses/program/${programId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async updateProgramCourse(id: number, programCourse: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/program-courses/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(programCourse),
    });
    return this.handleResponse<any>(response);
  }

  async deleteProgramCourse(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/program-courses/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  // Student Course Enrollment Management
  async enrollInCourse(studentId: number, programCourseId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/student-course-enrollments?studentId=${studentId}&programCourseId=${programCourseId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async getStudentCourseEnrollments(studentId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/student-course-enrollments/student/${studentId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getStudentCourseEnrollmentsByTrimester(studentId: number, trimesterId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/student-course-enrollments/student/${studentId}/trimester/${trimesterId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async updateEnrollmentStatus(id: number, status: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/student-course-enrollments/${id}/status?status=${status}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async updateGrade(id: number, grade: string, score?: number): Promise<any> {
    const params = new URLSearchParams({ grade });
    if (score !== undefined) params.append('score', score.toString());
    
    const response = await fetch(`${API_BASE_URL}/api/student-course-enrollments/${id}/grade?${params}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async dropCourse(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/student-course-enrollments/${id}/drop`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  async dropCourseEnrollment(enrollmentId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/student-course-enrollments/${enrollmentId}/drop`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  async getEnrollmentCountByStudentAndTrimester(studentId: number, trimesterId: number): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/api/student-course-enrollments/student/${studentId}/trimester/${trimesterId}/count`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<number>(response);
  }
}

export const apiService = new ApiService();