import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

/**
 * Servicio de autenticación mínimo con Basic Auth contra el backend.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usersPath: string = '/api/users';
  private readonly authenticatedSignal = signal<boolean>(false);
  private readonly authHeaderSignal = signal<string>('');
  private readonly errorMessageSignal = signal<string>('');

  constructor(private readonly http: HttpClient) {}

  isAuthenticated(): boolean {
    return this.authenticatedSignal();
  }

  getErrorMessage(): string {
    return this.errorMessageSignal();
  }

  login(username: string, password: string): Observable<boolean> {
    const normalizedUsername: string = username?.trim() ?? '';
    const normalizedPassword: string = password ?? '';

    if (!normalizedUsername || !normalizedPassword) {
      this.logout();
      return of(false);
    }

    const token: string = btoa(unescape(encodeURIComponent(`${normalizedUsername}:${normalizedPassword}`)));
    const authHeader: string = `Basic ${token}`;
    const headers: HttpHeaders = new HttpHeaders({ Authorization: authHeader });

    this.errorMessageSignal.set('');

    return this.http.get<unknown[]>(this.usersPath, { headers }).pipe(
      map(() => {
        this.authHeaderSignal.set(authHeader);
        this.authenticatedSignal.set(true);
        return true;
      }),
      catchError((error: HttpErrorResponse) => {
        this.logout();
        if (error.status === 401 || error.status === 403) {
          this.errorMessageSignal.set('Credenciales incorrectas.');
        } else if (error.status === 0) {
          this.errorMessageSignal.set('No se puede conectar con el backend en localhost:8080.');
        } else {
          this.errorMessageSignal.set('Error inesperado durante la autenticación.');
        }
        return of(false);
      })
    );
  }

  logout(): void {
    this.authHeaderSignal.set('');
    this.authenticatedSignal.set(false);
    this.errorMessageSignal.set('');
  }

  getAuthHeader(): string {
    return this.authHeaderSignal();
  }
}