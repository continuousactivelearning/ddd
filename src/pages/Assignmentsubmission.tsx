import { useState  } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { Upload, FileText, Calendar, User, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';

interface FormData {
  studentName: string;
  studentId: string;
  assignmentTitle: string;
  subject: string;
  dueDate: string;
  description: string;
  file: File | null;
}

export default function AssignmentSubmission() {
  const [formData, setFormData] = useState<FormData>({
    studentName: '',
    studentId: '',
    assignmentTitle: '',
    subject: '',
    dueDate: '',
    description: '',
    file: null
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isDragOver, setIsDragOver] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      if (errors.file) {
        setErrors(prev => ({ ...prev, file: '' }));
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, file: files[0] }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.studentName.trim()) newErrors.studentName = 'Student name is required';
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!formData.assignmentTitle.trim()) newErrors.assignmentTitle = 'Assignment title is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (!formData.file) newErrors.file = 'Please upload your assignment file';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setTimeout(() => {
        setIsSubmitted(true);
      }, 1000);
    }
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      studentId: '',
      assignmentTitle: '',
      subject: '',
      dueDate: '',
      description: '',
      file: null
    });
    setIsSubmitted(false);
    setErrors({});
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isSubmitted) {
    return (
      <div style={{ marginLeft: '230px', backgroundColor: '#ffffff', padding: '40px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', padding: '30px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ margin: '0 auto', height: '64px', width: '64px', borderRadius: '50%', backgroundColor: '#dcfce7', marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CheckCircle color="#16a34a" size={32} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>Assignment Submitted Successfully!</h2>
            <p style={{ color: '#4b5563', marginBottom: '20px' }}>
              Your assignment <strong>"{formData.assignmentTitle}"</strong> has been submitted for <strong>{formData.subject}</strong>.
            </p>
            <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
                <div><strong>Student:</strong> <p>{formData.studentName}</p></div>
                <div><strong>ID:</strong> <p>{formData.studentId}</p></div>
                <div><strong>File:</strong> <p>{formData.file?.name}</p></div>
                <div><strong>Size:</strong> <p>{formatFileSize(formData.file?.size || 0)}</p></div>
              </div>
            </div>
            <button onClick={resetForm} style={{ backgroundColor: '#3b82f6', color: '#ffffff', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
              Submit Another Assignment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginLeft: '230px', backgroundColor: '#ffffff', padding: '40px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: '#ffffff', padding: '30px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px', color: '#16a34a' }}>Submit Assignment</h1>
        <p style={{ marginBottom: '30px', color: '#4b5563' }}>Upload your completed assignment with the required details.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Student Name */}
          <div>
            <label><User size={16} style={{ marginRight: '5px' }} />Student Name *</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: errors.studentName ? '1px solid red' : '1px solid #d1d5db' }}
              placeholder="Enter your full name"
            />
            {errors.studentName && (
              <p style={{ color: 'red', fontSize: '12px' }}><AlertCircle size={14} style={{ marginRight: '5px' }} />{errors.studentName}</p>
            )}
          </div>

          {/* Student ID */}
          <div>
            <label>Student ID *</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: errors.studentId ? '1px solid red' : '1px solid #d1d5db' }}
              placeholder="Enter your student ID"
            />
            {errors.studentId && (
              <p style={{ color: 'red', fontSize: '12px' }}><AlertCircle size={14} style={{ marginRight: '5px' }} />{errors.studentId}</p>
            )}
          </div>

          {/* Assignment Title */}
          <div>
            <label><FileText size={16} style={{ marginRight: '5px' }} />Assignment Title *</label>
            <input
              type="text"
              name="assignmentTitle"
              value={formData.assignmentTitle}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: errors.assignmentTitle ? '1px solid red' : '1px solid #d1d5db' }}
              placeholder="Enter assignment title"
            />
            {errors.assignmentTitle && (
              <p style={{ color: 'red', fontSize: '12px' }}><AlertCircle size={14} style={{ marginRight: '5px' }} />{errors.assignmentTitle}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label><BookOpen size={16} style={{ marginRight: '5px' }} />Subject *</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: errors.subject ? '1px solid red' : '1px solid #d1d5db' }}
            >
              <option value="">Select subject</option>
              <option value="MERN stack development">MERN stack development</option>
              <option value="Data Structures and algorithms">Data Structures and algorithms</option>
              <option value="SQL and Analytics">SQL and Analytics</option>
              <option value="Cloud Practitioner and Architect">Cloud Practitioner and Architect</option>
              <option value="Other">Other</option>
            </select>
            {errors.subject && (
              <p style={{ color: 'red', fontSize: '12px' }}><AlertCircle size={14} style={{ marginRight: '5px' }} />{errors.subject}</p>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label><Calendar size={16} style={{ marginRight: '5px' }} />Due Date *</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: errors.dueDate ? '1px solid red' : '1px solid #d1d5db' }}
            />
            {errors.dueDate && (
              <p style={{ color: 'red', fontSize: '12px' }}><AlertCircle size={14} style={{ marginRight: '5px' }} />{errors.dueDate}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label>Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any additional notes"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          {/* File Upload */}
          <div>
            <label><Upload size={16} style={{ marginRight: '5px' }} />Upload File *</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: '2px dashed #d1d5db',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center',
                backgroundColor: isDragOver ? '#f0fdf4' : '#ffffff'
              }}
            >
              {formData.file ? (
                <div>
                  <p><FileText size={20} style={{ marginBottom: '4px' }} /> {formData.file.name}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>{formatFileSize(formData.file.size)}</p>
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, file: null }))} style={{ color: 'red', marginTop: '6px' }}>
                    Remove File
                  </button>
                </div>
              ) : (
                <div>
                  <p>Drag and drop your file here, or <label style={{ color: '#3b82f6', cursor: 'pointer' }}>
                    browse
                    <input type="file" onChange={handleFileChange} style={{ display: 'none' }} accept=".pdf,.doc,.docx,.txt,.rtf" />
                  </label></p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>PDF, DOC, DOCX, TXT, RTF up to 10MB</p>
                </div>
              )}
            </div>
            {errors.file && (
              <p style={{ color: 'red', fontSize: '12px' }}><AlertCircle size={14} style={{ marginRight: '5px' }} />{errors.file}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            style={{ marginTop: '20px', backgroundColor: '#16a34a', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}
          >
            Submit Assignment
          </button>
        </div>
      </div>
    </div>
  );
}
