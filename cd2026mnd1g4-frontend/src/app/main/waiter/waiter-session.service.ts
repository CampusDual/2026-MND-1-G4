import { Injectable, signal } from '@angular/core';
import { Customer, Waiter } from './models/waiter.models';

/** Conserva la selección del camarero y del cliente mientras se navega entre pantallas. */
@Injectable({ providedIn: 'root' })
export class WaiterSessionService {
  private readonly waiterSignal = signal<Waiter | null>(null);
  private readonly customerSignal = signal<Customer | null>(null);

  currentWaiter(): Waiter | null {
    return this.waiterSignal();
  }

  currentCustomer(): Customer | null {
    return this.customerSignal();
  }

  startFor(waiter: Waiter): void {
    this.waiterSignal.set(waiter);
    this.customerSignal.set(null);
  }

  setCustomer(customer: Customer | null): void {
    this.customerSignal.set(customer);
  }

  clearCustomer(): void {
    this.customerSignal.set(null);
  }

  clear(): void {
    this.waiterSignal.set(null);
    this.customerSignal.set(null);
  }
}
