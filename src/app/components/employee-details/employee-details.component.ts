import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';

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
@Component({
  selector: 'app-employee-details',
  standalone: true,
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
  imports: [ReactiveFormsModule, RouterLink, CommonModule]
})
export class EmployeeDetailsComponent implements OnInit {
  employee: any;
  loading: boolean = false;
  constructor(private route: ActivatedRoute, private apollo: Apollo) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log("Employee ID from URL:", id); // Debugging log
  
    if (!id) {
      console.error("Error: Employee ID is undefined");
      return; // Stop execution if ID is undefined
    }
  
    this.apollo.watchQuery({ 
      query: GET_EMPLOYEE_BY_ID, 
      variables: { id } 
    }).valueChanges.subscribe(
      (result: any) => {
        console.log("GraphQL Response:", result); // Debugging log
        this.employee = result.data?.searchEmployeeById;
  
        if (!this.employee) {
          console.error("Error: Employee data is empty");
        }
      },
      (error) => console.error("GraphQL Error:", error)
    );
  }
  
}
