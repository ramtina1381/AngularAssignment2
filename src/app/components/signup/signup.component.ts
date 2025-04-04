import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, FormsModule], // Add these
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  })

  constructor(private apollo: Apollo, private router: Router) {}


  submitForm(event: Event) {
    event.preventDefault();
    console.log('Form submitted with email');

    const { username, email, password } = this.signupForm.value;

    const SIGNUP_MUTATION = gql`
      mutation signup($username: String!, $email: String!, $password: String!) {
        signup(username: $username, email: $email, password: $password) {
          username
          email
        }
      }
    `;

    this.apollo
      .mutate({
        mutation: SIGNUP_MUTATION,
        variables: { username, email, password }
      })
      .subscribe(
        ({ data }) => {
          console.log('Signup Successful', data);
          alert('Signup successful!');
          this.router.navigate(['/']); // Redirect to login page
        },
        (error) => {
          console.error('Signup Error', error);
          alert('Signup failed. Please try again.');
        }
      );
  }

  
}