const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb+srv://admin:password%40123@cluster0.8umanrj.mongodb.net/employee_db?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('🚀 Connected perfectly to MongoDB Atlas Cloud Database!'))
  .catch(err => console.error('❌ Database connection error:', err));

// 1. Updated Schema to match your project assessment rules perfectly
const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true }, // renamed from role
  salary: { type: Number, required: true },     // added salary field
  email: { type: String, required: true }
});

const Employee = mongoose.model('Employee', employeeSchema);

// CREATE: Add a new employee
app.post('/api/employees', async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    const savedEmployee = await newEmployee.save(); 
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ: Fetch all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find(); 
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE: Edit employee details using their unique MongoDB ID
app.put('/api/employees/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // returns the updated document back to React
    );
    if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Remove an employee using their unique MongoDB ID
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee successfully removed from database' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});