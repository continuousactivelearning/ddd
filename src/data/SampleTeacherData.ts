// src/data/SampleTeacherData.ts
export interface Teacher {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'Teacher';
  profilePicture?: string;
  department: string;
  joinDate: string;
  isActive: boolean;
  employeeId: string;
  specialization?: string;
  qualification: string;
  experience: number; // years of experience
  phoneNumber?: string;
  officeLocation?: string;
  officeHours?: string;
  subjects?: string[];
  classes?: string[];
}

export const sampleTeacherData: Teacher[] = [
  {
    id: '5',
    name: 'Prof. Sakshi Sharma',
    email: 'sakshisharma@gmail.com',
    password: 'Sakshi123',
    role: 'Teacher',
    department: 'Computer Science',
    joinDate: '2020-08-15',
    isActive: true,
    employeeId: 'EMP001',
    specialization: 'Machine Learning & AI',
    qualification: 'Ph.D. in Computer Science',
    experience: 8,
    phoneNumber: '+91-9876543210',
    officeLocation: 'CS Block, Room 201',
    officeHours: 'Mon-Fri: 10:00 AM - 12:00 PM',
    subjects: ['Data Structures', 'Machine Learning', 'Algorithms'],
    classes: ['CS-A', 'CS-B', 'MCA-1']
  },
  {
    id: '6',
    name: 'Dr. Priya Patel',
    email: 'priya.patel@university.edu',
    password: 'Teacher456',
    role: 'Teacher',
    department: 'Mathematics',
    joinDate: '2019-06-10',
    isActive: true,
    employeeId: 'EMP002',
    specialization: 'Applied Mathematics',
    qualification: 'Ph.D. in Mathematics',
    experience: 12,
    phoneNumber: '+91-9876543211',
    officeLocation: 'Math Block, Room 101',
    officeHours: 'Mon-Wed-Fri: 2:00 PM - 4:00 PM',
    subjects: ['Calculus', 'Linear Algebra', 'Statistics'],
    classes: ['Math-A', 'Math-B', 'BSc-1']
  },
  {
    id: '7',
    name: 'Prof. Amit Kumar',
    email: 'amit.kumar@university.edu',
    password: 'Teacher789',
    role: 'Teacher',
    department: 'Physics',
    joinDate: '2021-03-22',
    isActive: true,
    employeeId: 'EMP003',
    specialization: 'Quantum Physics',
    qualification: 'Ph.D. in Physics',
    experience: 6,
    phoneNumber: '+91-9876543212',
    officeLocation: 'Physics Block, Room 301',
    officeHours: 'Tue-Thu: 11:00 AM - 1:00 PM',
    subjects: ['Quantum Mechanics', 'Classical Mechanics', 'Thermodynamics'],
    classes: ['Physics-A', 'Physics-B', 'MSc-1']
  },
  {
    id: '8',
    name: 'Dr. Neha Gupta',
    email: 'neha.gupta@university.edu',
    password: 'Teacher101',
    role: 'Teacher',
    department: 'Chemistry',
    joinDate: '2020-11-05',
    isActive: true,
    employeeId: 'EMP004',
    specialization: 'Organic Chemistry',
    qualification: 'Ph.D. in Chemistry',
    experience: 10,
    phoneNumber: '+91-9876543213',
    officeLocation: 'Chemistry Block, Room 102',
    officeHours: 'Mon-Fri: 9:00 AM - 11:00 AM',
    subjects: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry'],
    classes: ['Chem-A', 'Chem-B', 'BSc-2']
  },
  {
    id: '9',
    name: 'Prof. Suresh Verma',
    email: 'suresh.verma@university.edu',
    password: 'Teacher202',
    role: 'Teacher',
    department: 'English',
    joinDate: '2018-09-12',
    isActive: true,
    employeeId: 'EMP005',
    specialization: 'Literature & Creative Writing',
    qualification: 'Ph.D. in English Literature',
    experience: 15,
    phoneNumber: '+91-9876543214',
    officeLocation: 'Arts Block, Room 205',
    officeHours: 'Mon-Wed-Fri: 3:00 PM - 5:00 PM',
    subjects: ['English Literature', 'Creative Writing', 'Grammar'],
    classes: ['Eng-A', 'Eng-B', 'BA-1']
  },
  {
    id: '11',
    name: 'Dr. Kavita Singh',
    email: 'kavita.singh@university.edu',
    password: 'Teacher303',
    role: 'Teacher',
    department: 'Biology',
    joinDate: '2022-01-10',
    isActive: true,
    employeeId: 'EMP006',
    specialization: 'Molecular Biology',
    qualification: 'Ph.D. in Biology',
    experience: 5,
    phoneNumber: '+91-9876543215',
    officeLocation: 'Bio Block, Room 103',
    officeHours: 'Tue-Thu: 1:00 PM - 3:00 PM',
    subjects: ['Cell Biology', 'Genetics', 'Microbiology'],
    classes: ['Bio-A', 'Bio-B', 'BSc-3']
  },
  {
    id: '12',
    name: 'Prof. Rahul Joshi',
    email: 'rahul.joshi@university.edu',
    password: 'Teacher404',
    role: 'Teacher',
    department: 'Economics',
    joinDate: '2019-09-20',
    isActive: true,
    employeeId: 'EMP007',
    specialization: 'Macroeconomics',
    qualification: 'Ph.D. in Economics',
    experience: 9,
    phoneNumber: '+91-9876543216',
    officeLocation: 'Commerce Block, Room 204',
    officeHours: 'Mon-Fri: 10:00 AM - 12:00 PM',
    subjects: ['Microeconomics', 'Macroeconomics', 'International Trade'],
    classes: ['Eco-A', 'Eco-B', 'BCom-1']
  }
];

// Helper functions for teacher-specific operations
export const getTeachersByDepartment = (department: string): Teacher[] => {
  return sampleTeacherData.filter(teacher => teacher.department === department);
};

export const getActiveTeachers = (): Teacher[] => {
  return sampleTeacherData.filter(teacher => teacher.isActive);
};

export const findTeacherByEmail = (email: string): Teacher | undefined => {
  return sampleTeacherData.find(teacher => teacher.email === email);
};

export const findTeacherById = (id: string): Teacher | undefined => {
  return sampleTeacherData.find(teacher => teacher.id === id);
};

export const findTeacherByEmployeeId = (employeeId: string): Teacher | undefined => {
  return sampleTeacherData.find(teacher => teacher.employeeId === employeeId);
};

export const validateTeacher = (email: string, password: string): Teacher | null => {
  const teacher = sampleTeacherData.find(t => 
    t.email === email && 
    t.password === password && 
    t.isActive
  );
  return teacher || null;
};

export const getTeachersByExperience = (minYears: number): Teacher[] => {
  return sampleTeacherData.filter(teacher => teacher.experience >= minYears);
};

export const getTeachersBySubject = (subject: string): Teacher[] => {
  return sampleTeacherData.filter(teacher => 
    teacher.subjects?.includes(subject)
  );
};

export const getAllDepartments = (): string[] => {
  return [...new Set(sampleTeacherData.map(teacher => teacher.department))];
};

export const getAllSubjects = (): string[] => {
  const subjects = sampleTeacherData.flatMap(teacher => teacher.subjects || []);
  return [...new Set(subjects)];
};