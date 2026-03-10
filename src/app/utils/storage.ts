/**
 * Storage Module - Handles data persistence using localStorage
 * Simulates MongoDB database operations
 */

import { ComplaintCategory } from "./classifier";
import { EmergencyLevel, PriorityLevel } from "./priority";

export type ComplaintStatus = "submitted" | "under_review" | "in_process" | "resolved" | "rejected";

export interface Complaint {
  id: string;
  passengerName: string;
  email: string;
  phone: string;
  pnr: string;
  flightNumber: string;
  airline: string;
  source: string;
  destination: string;
  dateOfTravel: string;
  complaintType: ComplaintCategory;
  description: string;
  priority: PriorityLevel;
  emergencyLevel: EmergencyLevel;
  status: ComplaintStatus;
  uploadedFiles?: string[];
  ocrData?: string;
  submittedAt: string;
  updatedAt: string;
  adminNotes?: string;
}

const COMPLAINTS_KEY = "flyhappy_complaints";
const ADMIN_KEY = "flyhappy_admin";
const USER_KEY = "flyhappy_user";
const REGISTERED_USERS_KEY = "flyhappy_registered_users";

export interface UserSession {
  isLoggedIn: boolean;
  email: string;
  name?: string;
  avatarUrl?: string;
  authProvider?: "local" | "google";
}

export interface RegisteredUser {
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

/**
 * Generate unique complaint ID
 */
export function generateComplaintId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `FH${timestamp}${random}`.toUpperCase();
}

/**
 * Save complaint to storage
 */
export function saveComplaint(complaint: Complaint): void {
  const complaints = getAllComplaints();
  complaints.push(complaint);
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
}

/**
 * Get all complaints
 */
export function getAllComplaints(): Complaint[] {
  const data = localStorage.getItem(COMPLAINTS_KEY);
  const complaints = data ? (JSON.parse(data) as Partial<Complaint>[]) : [];

  return complaints.map((complaint) => ({
    emergencyLevel: 3,
    ...complaint,
  })) as Complaint[];
}

/**
 * Get complaint by ID
 */
export function getComplaintById(id: string): Complaint | null {
  const complaints = getAllComplaints();
  return complaints.find((c) => c.id === id) || null;
}

/**
 * Update complaint status
 */
export function updateComplaintStatus(
  id: string,
  status: ComplaintStatus,
  adminNotes?: string
): boolean {
  const complaints = getAllComplaints();
  const index = complaints.findIndex((c) => c.id === id);

  if (index === -1) return false;

  complaints[index].status = status;
  complaints[index].updatedAt = new Date().toISOString();
  if (adminNotes) {
    complaints[index].adminNotes = adminNotes;
  }

  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
  return true;
}

/**
 * Get complaints with filters
 */
export function getFilteredComplaints(filters: {
  airline?: string;
  category?: ComplaintCategory;
  priority?: PriorityLevel;
  status?: ComplaintStatus;
  dateFrom?: string;
  dateTo?: string;
}): Complaint[] {
  let complaints = getAllComplaints();

  if (filters.airline) {
    complaints = complaints.filter((c) =>
      c.airline.toLowerCase().includes(filters.airline!.toLowerCase())
    );
  }

  if (filters.category) {
    complaints = complaints.filter((c) => c.complaintType === filters.category);
  }

  if (filters.priority) {
    complaints = complaints.filter((c) => c.priority === filters.priority);
  }

  if (filters.status) {
    complaints = complaints.filter((c) => c.status === filters.status);
  }

  if (filters.dateFrom) {
    complaints = complaints.filter(
      (c) => new Date(c.submittedAt) >= new Date(filters.dateFrom!)
    );
  }

  if (filters.dateTo) {
    complaints = complaints.filter(
      (c) => new Date(c.submittedAt) <= new Date(filters.dateTo!)
    );
  }

  return complaints;
}

/**
 * Get complaint statistics
 */
export function getComplaintStats() {
  const complaints = getAllComplaints();

  const stats = {
    total: complaints.length,
    byStatus: {} as Record<ComplaintStatus, number>,
    byCategory: {} as Record<string, number>,
    byPriority: {} as Record<PriorityLevel, number>,
    byAirline: {} as Record<string, number>,
    resolved: 0,
    pending: 0,
    averageResolutionTime: 0,
  };

  // Initialize counters
  const statuses: ComplaintStatus[] = ["submitted", "under_review", "in_process", "resolved", "rejected"];
  statuses.forEach((status) => {
    stats.byStatus[status] = 0;
  });

  const priorities: PriorityLevel[] = ["low", "medium", "high"];
  priorities.forEach((priority) => {
    stats.byPriority[priority] = 0;
  });

  // Count statistics
  complaints.forEach((complaint) => {
    stats.byStatus[complaint.status]++;
    stats.byCategory[complaint.complaintType] =
      (stats.byCategory[complaint.complaintType] || 0) + 1;
    stats.byPriority[complaint.priority]++;
    stats.byAirline[complaint.airline] = (stats.byAirline[complaint.airline] || 0) + 1;

    if (complaint.status === "resolved") {
      stats.resolved++;
    } else if (complaint.status !== "rejected") {
      stats.pending++;
    }
  });

  return stats;
}

/**
 * Admin authentication
 */
export function checkAdminAuth(username: string, password: string): boolean {
  // Simple demo authentication
  return username === "admin" && password === "admin123";
}

/**
 * Set admin session
 */
export function setAdminSession(isLoggedIn: boolean): void {
  localStorage.setItem(ADMIN_KEY, JSON.stringify({ isLoggedIn }));
}

/**
 * Check admin session
 */
export function isAdminLoggedIn(): boolean {
  const data = localStorage.getItem(ADMIN_KEY);
  if (!data) return false;
  const session = JSON.parse(data);
  return session.isLoggedIn === true;
}

/**
 * Clear admin session
 */
export function clearAdminSession(): void {
  localStorage.removeItem(ADMIN_KEY);
}

export function checkUserAuth(email: string, password: string): boolean {
  const users = getRegisteredUsers();
  return users.some(
    (user) =>
      user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password
  );
}

export function setUserSession(email: string): void {
  const existingUser = getRegisteredUsers().find(
    (user) => user.email.toLowerCase() === email.trim().toLowerCase()
  );
  const session: UserSession = {
    isLoggedIn: true,
    email,
    name: existingUser?.name,
    authProvider: "local",
  };
  localStorage.setItem(USER_KEY, JSON.stringify(session));
}

export function setGoogleUserSession(payload: {
  email: string;
  name?: string;
  avatarUrl?: string;
}): void {
  const session: UserSession = {
    isLoggedIn: true,
    email: payload.email,
    name: payload.name,
    avatarUrl: payload.avatarUrl,
    authProvider: "google",
  };
  localStorage.setItem(USER_KEY, JSON.stringify(session));
}

export function getUserSession(): UserSession | null {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearUserSession(): void {
  localStorage.removeItem(USER_KEY);
}

export function getRegisteredUsers(): RegisteredUser[] {
  const data = localStorage.getItem(REGISTERED_USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function registerUser(user: { name: string; email: string; password: string }): {
  success: boolean;
  message: string;
} {
  const users = getRegisteredUsers();
  const exists = users.some(
    (item) => item.email.toLowerCase() === user.email.trim().toLowerCase()
  );

  if (exists) {
    return { success: false, message: "An account with this email already exists" };
  }

  users.push({
    name: user.name.trim(),
    email: user.email.trim(),
    password: user.password,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  return { success: true, message: "Account created successfully" };
}

/**
 * Initialize with sample data if empty
 */
export function initializeSampleData(): void {
  const complaints = getAllComplaints();
  if (complaints.length > 0) return;

  const users = getRegisteredUsers();
  if (users.length === 0) {
    localStorage.setItem(
      REGISTERED_USERS_KEY,
      JSON.stringify([
        {
          name: "Demo User",
          email: "demo@flyhappy.com",
          password: "demo1234",
          createdAt: new Date().toISOString(),
        },
      ])
    );
  }

  const sampleComplaints: Complaint[] = [
    {
      id: generateComplaintId(),
      passengerName: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+91-9876543210",
      pnr: "ABC123XYZ",
      flightNumber: "AI-342",
      airline: "Air India",
      source: "Delhi",
      destination: "Mumbai",
      dateOfTravel: "2026-03-10",
      complaintType: "delay",
      description:
        "Flight was delayed by 4 hours without any prior notification. No compensation or accommodation was provided.",
      priority: "medium",
      emergencyLevel: 3,
      status: "under_review",
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateComplaintId(),
      passengerName: "Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "+91-9876543211",
      pnr: "6E78945",
      flightNumber: "6E-2451",
      airline: "IndiGo",
      source: "Bangalore",
      destination: "Delhi",
      dateOfTravel: "2026-03-08",
      complaintType: "baggage",
      description:
        "My checked baggage was lost during the flight. It contained important documents and valuables. Need urgent assistance.",
      priority: "high",
      emergencyLevel: 5,
      status: "in_process",
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateComplaintId(),
      passengerName: "Amit Patel",
      email: "amit.patel@email.com",
      phone: "+91-9876543212",
      pnr: "SG12345",
      flightNumber: "SG-8756",
      airline: "SpiceJet",
      source: "Hyderabad",
      destination: "Kolkata",
      dateOfTravel: "2026-03-05",
      complaintType: "cancellation",
      description:
        "Flight was cancelled at the last moment. No refund has been processed yet despite multiple follow-ups.",
      priority: "high",
      emergencyLevel: 4,
      status: "submitted",
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateComplaintId(),
      passengerName: "Sneha Reddy",
      email: "sneha.reddy@email.com",
      phone: "+91-9876543213",
      pnr: "UK45678",
      flightNumber: "UK-823",
      airline: "Vistara",
      source: "Mumbai",
      destination: "Chennai",
      dateOfTravel: "2026-02-28",
      complaintType: "staff_behaviour",
      description: "The cabin crew was extremely rude and unprofessional during the flight.",
      priority: "low",
      emergencyLevel: 1,
      status: "resolved",
      submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      adminNotes: "Issue resolved. Staff member has been counseled.",
    },
  ];

  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(sampleComplaints));
}
