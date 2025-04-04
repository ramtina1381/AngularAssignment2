const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");
require('dotenv').config();
const resolvers = {
  Query: {
    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
          throw new Error("Invalid Credentials");
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return { token, user };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    getAllEmployees: async () => {
      try {
        return await Employee.find();
      } catch (error) {
        throw new Error("Error retrieving employees");
      }
    },

    searchEmployeeById: async (_, { id }, { db }) => {
      const employee = await db.collection('employees').findOne({ _id: new ObjectId(id) });

      if (!employee) return null;

      return {
        ...employee,
        id: employee._id.toString(), // Convert MongoDB ObjectId to a string
      };
    },
    employees: async (_, __, { db }) => {
      const employees = await db.collection('employees').find().toArray();
      return employees.map(emp => ({
        ...emp,
        id: emp._id.toString(), // Convert `_id` to `id` for frontend
      }));
    },

    searchEmployeeByDesignationOrDept: async (_, { designation, department }) => {
      try {
        const filter = {};
        if (designation) filter.designation = designation;
        if (department) filter.department = department;
        return await Employee.find(filter);
      } catch (error) {
        throw new Error("Error searching employees");
      }
    },
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) throw new Error("Username or email already taken");

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        return await user.save();
      } catch (error) {
        throw new Error(error.message);
      }
    },

    addEmployee: async (_, { first_name, last_name, email, gender, designation, salary, date_of_joining, department, employee_photo }) => {
      try {
        const employee = new Employee({
          first_name,
          last_name,
          email,
          gender,
          designation,
          salary,
          date_of_joining,
          department,
          employee_photo
        });
        return await employee.save();
      } catch (error) {
        console.error('Error adding employee to database:', error);  // Log the error for easier debugging
        throw new Error("Error adding employee");
      }
    },
    
    

    updateEmployee: async (_, { id, ...updates }) => {
      try {
        const employee = await Employee.findByIdAndUpdate(id, updates, { new: true });
        if (!employee) throw new Error("Employee not found");
        return employee;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    deleteEmployee: async (_, { id }) => {
      try {
        const employee = await Employee.findByIdAndDelete(id);
        if (!employee) throw new Error("Employee not found");
        return "Employee successfully deleted";
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = resolvers;
