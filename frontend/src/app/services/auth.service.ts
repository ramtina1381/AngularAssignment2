import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

// GraphQL Queries and Mutations
const LOGIN_MUTATION = gql`
  query login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

const GET_ALL_EMPLOYEES = gql`
  query {
    getAllEmployees {
      id
      first_name
      last_name
      email
    }
  }
`;

const ADD_EMPLOYEE = gql`
  mutation addEmployee(
    $first_name: String!, 
    $last_name: String!, 
    $email: String!, 
    $gender: String!, 
    $designation: String!, 
    $salary: Float!, 
    $date_of_joining: String!, 
    $department: String!, 
    $employee_photo: String
  ) {
    addEmployee(
      first_name: $first_name, 
      last_name: $last_name,   
      email: $email,
      gender: $gender,
      designation: $designation,
      salary: $salary,
      date_of_joining: $date_of_joining, 
      department: $department,
      employee_photo: $employee_photo
    ) {
      id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
    }
  }
`;

const GET_EMPLOYEE_BY_ID = gql`
  query searchEmployeeById($id: ID!) {
    searchEmployeeById(id: $id) {
      id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
    }
  }
`;


const UPDATE_EMPLOYEE = gql`
mutation updateEmployee($id: ID!, $input: EmployeeInput!) {
  updateEmployee(id: $id, input: $input) {
    id
    first_name
    last_name
    email
    gender
    designation
    salary
    date_of_joining
    department
    employee_photo
  }
}

`;

const DELETE_EMPLOYEE = gql`
  mutation deleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

// GraphQL Queries and Mutations
const SEARCH_EMPLOYEE = gql`
  query searchEmployeeByDesignationOrDept($designation: String, $department: String) {
    searchEmployeeByDesignationOrDept(designation: $designation, department: $department) {
      id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private apollo: Apollo, private router: Router) {}

  // Login method using GraphQL query
  login(email: string, password: string) {
    this.apollo
      .watchQuery({
        query: LOGIN_MUTATION,
        variables: { email, password }
      })
      .valueChanges.subscribe(
        (result: any) => {
          const { token, user } = result?.data?.login;
          if (token) {
            localStorage.setItem('authToken', token);
            this.currentUserSubject.next(user);
            this.router.navigate(['/employee']);
          }
        },
        (error) => {
          console.error('Login failed', error);
          alert('Invalid credentials');
        }
      );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  logout() {
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
    this.router.navigate(['']);
  }

  // **Employee Management Functions**
  
  // Get all employees
  getAllEmployees() {
    return this.apollo.watchQuery({
      query: GET_ALL_EMPLOYEES
    }).valueChanges;
  }

    // Get employee by ID
    getEmployeeById(id: string) {
      return this.apollo.watchQuery({
        query: GET_EMPLOYEE_BY_ID,
        variables: { id }
      }).valueChanges;
    }

// Add a new employee
addEmployee(
  first_name: string,
  last_name: string,
  email: string,
  gender: string,
  designation: string,
  salary: number,
  date_of_joining: string,
  department: string,
  employee_photo?: string
) {
  return this.apollo.mutate({
    mutation: ADD_EMPLOYEE,
    variables: {
      first_name,
      last_name,
      email,
      gender,
      designation,
      salary,
      date_of_joining,
      department,
      employee_photo
    }
  });
}


// Update employee details
updateEmployee(id: string, first_name?: string, last_name?: string, email?: string, gender?: string, designation?: string, salary?: number, date_of_joining?: string, department?: string, employee_photo?: string) {
  return this.apollo.mutate({
    mutation: UPDATE_EMPLOYEE,
    variables: { 
      id, 
      input: {
        first_name,
        last_name,
        email,
        gender,
        designation,
        salary,
        date_of_joining,
        department,
        employee_photo
      }
    }
  });
}


  // Delete an employee
  deleteEmployee(id: string) {
    return this.apollo.mutate({
      mutation: DELETE_EMPLOYEE,
      variables: { id }
    });
  }

  searchEmployees(designation?: string, department?: string) {
    return this.apollo.watchQuery({
      query: SEARCH_EMPLOYEE,
      variables: { designation, department }
    }).valueChanges;
  }
  
}
