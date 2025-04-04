import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { EmployeeListComponent } from './components/employee/employee.component';

export const routes: Routes = [
  {
    path: '', 
    pathMatch: 'full',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'employee',
    loadComponent: () => import('./components/employee/employee.component').then(m => m.EmployeeListComponent)
  },
  {
    path: 'add-employee',
    loadComponent: () => import('./components/add-employee/add-employee.component').then(m => m.AddEmployeeComponent)
  },
  {
    path: 'edit-employee',
    loadComponent: () => import('./components/edit-employee/edit-employee.component').then(m => m.EditEmployeeComponent)
  },
  {
    path: 'employee-details/:id',
    loadComponent: () => import('./components/employee-details/employee-details.component').then(m => m.EmployeeDetailsComponent)
  }, 
  {
    path: 'edit-employee/:id',
    loadComponent: () => import('./components/edit-employee/edit-employee.component').then(m => m.EditEmployeeComponent)
  }  
   

];
