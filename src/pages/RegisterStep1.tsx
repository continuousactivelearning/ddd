import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

interface FormData {
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  role: string;
  contact: string;
}

const RegisterStep1: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    role: '',
    contact: '',
  });


const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


 const validateStep1 = (): string | null => {
  const { firstName, lastName, dob, role, contact } = formData;

  if (!firstName.trim()) return "First name is required.";
  if (!lastName.trim()) return "Last name is required.";
  if (!dob) return "Date of Birth is required.";
  if (!role) return "Role must be selected.";
   if (!contact.trim()) return "Contact number is required.";
  if (!/^[0-9]{10}$/.test(contact)) return "Contact number must be exactly 10 digits.";

  return null; // ✅ All good
};

 const handleNext = () => {
  const error = validateStep1();

  if (error) {
    alert(error);
  } else {
    localStorage.setItem('registerData', JSON.stringify(formData));
    navigate('/Register2');
  }
};


  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register - Step 1</h2>
          <select
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="title-select"
          >
            <option value="">Select Title</option>
            <option value="Mr.">Mr.</option>
            <option value="Ms.">Ms.</option>
            <option value="Mrs.">Mrs.</option>
            <option value="Prof.">Prof.</option>
            <option value="Dr.">Dr.</option>
          </select>


  
        <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
        <input name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} />
        <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <input
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          maxLength={10}
          required
        />
        
        <button type="button" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default RegisterStep1;
