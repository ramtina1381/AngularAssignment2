import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Import AuthService

// GraphQL mutation for adding an employee
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

@Component({
  selector: 'add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
  employeeForm: FormGroup;

  constructor(private fb: FormBuilder, private apollo: Apollo, private router: Router, private authService: AuthService) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(0)]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required],
      employee_photo: ['']
    });
  }

  submitForm() {
    if (this.employeeForm.valid) {
      // Prepare the variables to match the GraphQL mutation
      const variables = {
        first_name: this.employeeForm.value.first_name,
        last_name: this.employeeForm.value.last_name,
        email: this.employeeForm.value.email,
        gender: this.employeeForm.value.gender,
        designation: this.employeeForm.value.designation,
        salary: parseFloat(this.employeeForm.value.salary),
        date_of_joining: this.employeeForm.value.date_of_joining,
        department: this.employeeForm.value.department,
        employee_photo: this.employeeForm.value.employee_photo
      };

      this.apollo.mutate({
        mutation: ADD_EMPLOYEE,
        variables: variables
      }).subscribe(
        (response) => {
          console.log('Employee added successfully', response);
          this.router.navigate(['/employee']); // Redirect to the employee list or another page
        },
        (error) => {
          console.error('Error adding employee:', error);
          console.error('Error details:', error.graphQLErrors, error.networkError);
          alert('Error adding employee. Please try again.');
        }
      );
    }
  }
}
