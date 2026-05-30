import React, { useState, useEffect } from 'react';

function App() {
  const [employees, setEmployees] = useState([]);

  // Form State Variables
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [salary, setSalary] = useState('');
  const [email, setEmail] = useState('');

  // Inline Editing Trackers
  const [editingId, setEditingId] = useState(null); 
  const [editForm, setEditForm] = useState({ department: '', designation: '', salary: '' });

  // Fetch complete list on load
  useEffect(() => {
    fetch('http://localhost:5001/api/employees')
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error('Error fetching employees:', err));
  }, []);

  // Task 1: Add Employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    const employeeData = { employeeId, name, department, designation, salary: Number(salary), email };

    try {
      const response = await fetch('http://localhost:5001/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        const newEmp = await response.json();
        setEmployees((prev) => [...prev, newEmp]);
        
        // Reset state fields
        setEmployeeId(''); setName(''); setDepartment(''); setDesignation(''); setSalary(''); setEmail('');
      } else {
        const err = await response.json();
        alert('Error adding employee: ' + err.message);
      }
    } catch (error) {
      console.error('Network connection error:', error);
    }
  };

  // Task 2: Edit Employee Logic
  const startEditing = (emp) => {
    setEditingId(emp._id);
    setEditForm({ department: emp.department, designation: emp.designation, salary: emp.salary });
  };

  const handleEditSubmit = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedEmp = await response.json();
        setEmployees((prev) => prev.map((emp) => (emp._id === id ? updatedEmp : emp)));
        setEditingId(null); // Close edit view mode
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  // Task 3: Delete Employee Logic
  const handleDelete = async (id) => {
    if (window.confirm('Are you absolutely sure you want to delete this employee record?')) {
      try {
        const response = await fetch(`http://localhost:5001/api/employees/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Remove the record immediately from the frontend state array
          setEmployees((prev) => prev.filter((emp) => emp._id !== id));
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Employee Management System (MERN Stack Assessment)</h2>
      
      {/* ADD FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
        <h3 style={{ gridColumn: '1 / span 2', margin: '0 0 10px 0' }}>Add New Employee</h3>
        <input type="text" placeholder="Employee ID (e.g., EMP001)" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required style={{ padding: '8px' }} />
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '8px' }} />
        <input type="text" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} required style={{ padding: '8px' }} />
        <input type="text" placeholder="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} required style={{ padding: '8px' }} />
        <input type="number" placeholder="Salary (INR)" value={salary} onChange={(e) => setSalary(e.target.value)} required style={{ padding: '8px' }} />
        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '8px' }} />
        <button type="submit" style={{ gridColumn: '1 / span 2', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Add Employee
        </button>
      </form>

      {/* VIEW RECORDS TABLE */}
      <h3>Employee Records</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#ddd' }}>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Salary</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>No records found.</td>
            </tr>
          ) : (
            employees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.employeeId}</td>
                <td>{emp.name}</td>
                
                {/* Check if this specific row is being edited */}
                {editingId === emp._id ? (
                  <>
                    <td><input type="text" value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} style={{ width: '90%' }} /></td>
                    <td><input type="text" value={editForm.designation} onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })} style={{ width: '90%' }} /></td>
                    <td><input type="number" value={editForm.salary} onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })} style={{ width: '90%' }} /></td>
                  </>
                ) : (
                  <>
                    <td>{emp.department}</td>
                    <td>{emp.designation}</td>
                    <td>₹{emp.salary.toLocaleString()}</td>
                  </>
                )}
                
                <td>{emp.email}</td>
                <td>
                  {editingId === emp._id ? (
                    <>
                      <button onClick={() => handleEditSubmit(emp._id)} style={{ marginRight: '5px', background: '#17a2b8', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                      <button onClick={() => setEditingId(null)} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditing(emp)} style={{ marginRight: '5px', background: '#ffc107', color: 'black', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete(emp._id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;