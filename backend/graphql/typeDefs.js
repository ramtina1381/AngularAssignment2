const { gql } = require("apollo-server-express");

const typeDefs = gql`
  # Types for Employee
  type Employee {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    created_at: String
    updated_at: String
  }
  input EmployeeInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: String
    department: String
    employee_photo: String
}


  # Types for User
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
  }

  # Token type for login response
  type Token {
    token: String!
    user: User!
  }

  # Queries
  type Query {
    login(email: String!, password: String!): Token!
    getAllEmployees: [Employee!]!
    searchEmployeeById(id: ID!): Employee
    searchEmployeeByDesignationOrDept(designation: String, department: String): [Employee!]!
  }

  # Mutations
  type Mutation {
    signup(username: String!, email: String!, password: String!): User!
    addEmployee(
      first_name: String!
      last_name: String!
      email: String!
      gender: String!
      designation: String!
      salary: Float!
      date_of_joining: String!
      department: String!
      employee_photo: String
    ): Employee!
    updateEmployee(id: ID!, input: EmployeeInput!): Employee!
    deleteEmployee(id: ID!): String!
  }
`;

module.exports = typeDefs;
