import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

/**
 * Pantalla mínima de confirmación tras autenticación correcta.
 */
@Component({
  selector: 'app-it-works',
  standalone: true,
  templateUrl: './it-works.component.html',
  styleUrl: './it-works.component.scss'
})
export class ItWorksComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}