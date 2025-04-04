import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import {  RouterLink } from '@angular/router'; 


const GET_EMPLOYEE_BY_ID = gql`
  query getEmployee($id: ID!) {
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
mutation updateEmployee($id: ID!, $first_name: String, $last_name: String, $email: String, $gender: String, $designation: String, $salary: Float, $date_of_joining: String, $department: String, $employee_photo: String) {
  updateEmployee(
    id: $id
    first_name: $first_name
    last_name: $last_name
    email: $email
    gender: $gender
    designation: $designation
    salary: $salary
    date_of_joining: $date_of_joining
    department: $department
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
  selector: 'app-edit-employee',
  standalone: true,
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css'],
  imports: [FormsModule, RouterLink, ReactiveFormsModule]
})
export class EditEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employeeId: string = '';

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: [''],
      designation: [''],
      salary: [''],
      date_of_joining: [''],
      department: [''],
      employee_photo: [''],
    });
  }

  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    console.log(this.employeeId)
  
    if (!this.employeeId) {
      console.error("Employee ID is missing.");
      return; // Prevent further execution if the ID is missing
    }
  
    // Fetch Employee Data
    this.apollo
      .watchQuery({ query: GET_EMPLOYEE_BY_ID, variables: { id: this.employeeId } })
      .valueChanges.subscribe((result: any) => {
        if (result.data?.searchEmployeeById) {
          this.employeeForm.patchValue(result.data.searchEmployeeById);
        }
      });
  }
  

  updateEmployee() {
    if (this.employeeForm.invalid) {
      return;
    }
  
    const updatedData = this.employeeForm.value;
  
    this.apollo
      .mutate({
        mutation: UPDATE_EMPLOYEE,
        variables: {
          id: this.employeeId,
          first_name: updatedData.first_name,
          last_name: updatedData.last_name,
          email: updatedData.email,
          gender: updatedData.gender,
          designation: updatedData.designation,
          salary: updatedData.salary,
          date_of_joining: updatedData.date_of_joining,
          department: updatedData.department,
          employee_photo: updatedData.employee_photo,
        },
      })
      .subscribe(
        () => {
          alert("Employee updated successfully!");
          this.router.navigate(['/employee']); // Redirect back to the list
        },
        (error) => {
          console.error("Error updating employee:", error);
        }
      );
  }
  
}
