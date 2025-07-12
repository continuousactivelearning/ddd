// SampleAdminData.ts
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'Admin';
  department: string;
  permissions: string[];
  joinDate: string;
  lastLogin: string;
  phone: string;
  status: 'active' | 'inactive';
  profileImage?: string;
  adminLevel: 'super' | 'department' | 'assistant';
}

export const sampleAdminData: AdminUser[] = [
  {
    id: 1,
    name: "Prof Sudarshan Iyengar",
    email: "superadmin@school.edu",
    password: "SuperAdmin123",
    role: "Admin",
    department: "Administration",
    permissions: [
      "user_management",
      "course_management",
      "system_settings",
      "financial_management",
      "reports_analytics",
      "security_management",
      "backup_restore",
      "audit_logs"
    ],
    joinDate: "2023-01-01",
    lastLogin: "2024-07-09 09:00:00",
    phone: "+91 98765 00001",
    status: "active",
    adminLevel: "super"
  },
  {
    id: 2,
    name: "Academic Admin",
    email: "academic@school.edu",
    password: "Academic123",
    role: "Admin",
    department: "Academic Affairs",
    permissions: [
      "course_management",
      "teacher_management",
      "student_management",
      "academic_reports",
      "curriculum_management"
    ],
    joinDate: "2023-03-15",
    lastLogin: "2024-07-09 08:30:00",
    phone: "+91 98765 00002",
    status: "active",
    adminLevel: "department"
  },
  {
    id: 3,
    name: "IT Admin",
    email: "itadmin@school.edu",
    password: "ITAdmin123",
    role: "Admin",
    department: "Information Technology",
    permissions: [
      "system_settings",
      "user_management",
      "security_management",
      "backup_restore",
      "technical_support",
      "infrastructure_management"
    ],
    joinDate: "2023-02-20",
    lastLogin: "2024-07-09 07:45:00",
    phone: "+91 98765 00003",
    status: "active",
    adminLevel: "department"
  },
  {
    id: 4,
    name: "Finance Admin",
    email: "finance@school.edu",
    password: "Finance123",
    role: "Admin",
    department: "Finance",
    permissions: [
      "financial_management",
      "payment_processing",
      "financial_reports",
      "billing_management",
      "revenue_tracking"
    ],
    joinDate: "2023-04-10",
    lastLogin: "2024-07-08 16:20:00",
    phone: "+91 98765 00004",
    status: "active",
    adminLevel: "department"
  },
  {
    id: 5,
    name: "Assistant Admin",
    email: "assistant@school.edu",
    password: "Assistant123",
    role: "Admin",
    department: "General Administration",
    permissions: [
      "basic_user_management",
      "content_moderation",
      "support_tickets",
      "basic_reports"
    ],
    joinDate: "2023-06-01",
    lastLogin: "2024-07-09 10:15:00",
    phone: "+91 98765 00005",
    status: "active",
    adminLevel: "assistant"
  },
  {
    id: 6,
    name: "Student Affairs Admin",
    email: "studentaffairs@school.edu",
    password: "StudentAffairs123",
    role: "Admin",
    department: "Student Affairs",
    permissions: [
      "student_management",
      "disciplinary_actions",
      "student_support",
      "extracurricular_management",
      "student_reports"
    ],
    joinDate: "2023-05-15",
    lastLogin: "2024-07-09 09:30:00",
    phone: "+91 98765 00006",
    status: "active",
    adminLevel: "department"
  }
];

// Utility functions for admin management
export const getAdminByEmail = (email: string): AdminUser | undefined => {
  return sampleAdminData.find(admin => admin.email === email);
};

export const getAdminById = (id: number): AdminUser | undefined => {
  return sampleAdminData.find(admin => admin.id === id);
};

export const getAdminsByDepartment = (department: string): AdminUser[] => {
  return sampleAdminData.filter(admin => admin.department === department);
};

export const getAdminsByLevel = (level: 'super' | 'department' | 'assistant'): AdminUser[] => {
  return sampleAdminData.filter(admin => admin.adminLevel === level);
};

export const hasPermission = (admin: AdminUser, permission: string): boolean => {
  return admin.permissions.includes(permission);
};

export const getActiveAdmins = (): AdminUser[] => {
  return sampleAdminData.filter(admin => admin.status === 'active');
};

export const getAdminPermissionLevel = (admin: AdminUser): string => {
  switch (admin.adminLevel) {
    case 'super':
      return 'Super Administrator';
    case 'department':
      return 'Department Administrator';
    case 'assistant':
      return 'Assistant Administrator';
    default:
      return 'Administrator';
  }
};