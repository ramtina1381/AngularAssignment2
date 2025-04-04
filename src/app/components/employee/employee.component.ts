import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, RouterLink } from '@angular/router'; 
import { FormsModule } from '@angular/forms';  // ✅ Import FormsModule


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  standalone: true, 
  imports: [CommonModule, RouterLink, FormsModule],

})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  designation: string = '';
  department: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getAllEmployees().subscribe(
      (response: any) => {
        this.employees = response.data.getAllEmployees;
        console.log("Fetched Employees:", this.employees);
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  deleteEmployee(id: string) {
    this.authService.deleteEmployee(id).subscribe(() => {
      this.employees = this.employees.filter(emp => emp.id !== id);
    });
  }
  debug(id: any) {
    console.log("Employee ID Clicked:", id);
  }

  searchEmployees() {
    this.authService.searchEmployees(this.designation, this.department).subscribe((result: any) => {
      this.employees = result?.data?.searchEmployeeByDesignationOrDept || [];
    });
  }

  logout() {
    this.authService.logout(); // Calls logout function from AuthService
  }
  
}
