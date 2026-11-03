import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

/**
 * Pantalla de acceso mínima basada en Basic Auth.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isLoading: boolean = false;
  errorMessage: string = '';

  readonly loginForm;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.loginForm = this.formBuilder.nonNullable.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    this.isLoading = true;

    this.authService.login(username, password).subscribe({
      next: (isAuthenticated: boolean) => {
        if (isAuthenticated) {
          this.router.navigate(['/it-works']);
          return;
        }

        this.errorMessage = this.authService.getErrorMessage() || 'Credenciales incorrectas o backend no disponible.';
      },
      error: () => {
        this.errorMessage = 'Se ha producido un error durante el login.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}