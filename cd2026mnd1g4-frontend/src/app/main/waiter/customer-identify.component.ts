import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer, Waiter } from './models/waiter.models';
import { WaiterDataService } from './waiter-data.service';
import { WaiterSessionService } from './waiter-session.service';

/** Identifica a un cliente mediante llavero simulado o teléfono. */
@Component({
  selector: 'app-customer-identify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-identify.component.html',
  styleUrl: './customer-identify.component.scss'
})
export class CustomerIdentifyComponent {
  readonly waiter: Waiter | null;
  keyTagCode: string = '';
  phone: string = '';
  errorMessage: string = '';
  isSearching: boolean = false;

  constructor(
    private readonly dataService: WaiterDataService,
    private readonly sessionService: WaiterSessionService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.waiter = this.sessionService.currentWaiter();
    if (!this.waiter) {
      this.router.navigate(['/main/waiter']);
    }
  }

  searchByKeyTag(): void {
    this.searching();
    this.dataService.findCustomerByKeyTag(this.keyTagCode).subscribe({
      next: (customer: Customer | null) => this.handleSearchResult(customer, 'Llavero no registrado'),
      error: () => this.handleSearchError('No se ha podido buscar el llavero.')
    });
  }

  searchByPhone(): void {
    this.searching();
    this.dataService.findCustomerByPhone(this.phone).subscribe({
      next: (customer: Customer | null) => this.handleSearchResult(customer, 'Cliente no encontrado'),
      error: () => this.handleSearchError('Introduce un teléfono válido para buscar.')
    });
  }

  registerCustomer(): void {
    this.router.navigate(['/main/waiter/register'], {
      queryParams: { tagCode: this.keyTagCode.trim() },
      relativeTo: this.route
    });
  }

  continueWithoutCustomer(): void {
    this.sessionService.clearCustomer();
    this.router.navigate(['/main/waiter/order']);
  }

  changeWaiter(): void {
    this.sessionService.clear();
    this.router.navigate(['/main/waiter']);
  }

  private searching(): void {
    this.errorMessage = '';
    this.isSearching = true;
  }

  private handleSearchResult(customer: Customer | null, notFoundMessage: string): void {
    this.isSearching = false;
    if (!customer) {
      this.errorMessage = notFoundMessage;
      return;
    }
    this.sessionService.setCustomer(customer);
    this.router.navigate(['/main/waiter/order']);
  }

  private handleSearchError(message: string): void {
    this.isSearching = false;
    this.errorMessage = message;
  }
}
