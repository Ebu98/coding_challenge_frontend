import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SupervisorForm = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    supervisor: ''
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get('http://localhost:3000/api/supervisors')
      .then(res => setSupervisors(res.data))
      .catch(() => setMessage('Failed to load supervisors.'));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.match(/^[A-Za-z]+$/)) newErrors.firstName = "Valid first name required";
    if (!formData.lastName.match(/^[A-Za-z]+$/)) newErrors.lastName = "Valid last name required";
    if (!formData.supervisor) newErrors.supervisor = "Supervisor is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/api/submit', formData);
      setMessage(res.data.message);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        supervisor: ''
      });
      setErrors({});
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || 'Submission failed.';
      setMessage(msg);
    }
  };

  return (
    <div>
      <h2>Supervisor Notification Form</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
        {errors.firstName && <p>{errors.firstName}</p>}

        <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
        {errors.lastName && <p>{errors.lastName}</p>}

        <input name="email" placeholder="Email (optional)" value={formData.email} onChange={handleChange} />
        <input name="phoneNumber" placeholder="Phone (optional)" value={formData.phoneNumber} onChange={handleChange} />

        <select name="supervisor" value={formData.supervisor} onChange={handleChange}>
          <option value="">Select Supervisor</option>
          {supervisors.map((s, idx) => (
            <option key={idx} value={s.label}>{s.label}</option>
          ))}
        </select>
        {errors.supervisor && <p>{errors.supervisor}</p>}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SupervisorForm;
