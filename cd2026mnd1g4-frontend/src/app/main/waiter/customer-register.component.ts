import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from './models/waiter.models';
import { WaiterDataService } from './waiter-data.service';
import { WaiterSessionService } from './waiter-session.service';

/** Registra un cliente nuevo con consentimiento de protección de datos obligatorio. */
@Component({
  selector: 'app-customer-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-register.component.html',
  styleUrl: './customer-register.component.scss'
})
export class CustomerRegisterComponent {
  errorMessage: string = '';
  isSaving: boolean = false;

  readonly customerForm;

  constructor(
    formBuilder: FormBuilder,
    private readonly dataService: WaiterDataService,
    private readonly sessionService: WaiterSessionService,
    private readonly router: Router,
    route: ActivatedRoute
  ) {
    if (!this.sessionService.currentWaiter()) {
      this.router.navigate(['/main/waiter']);
    }
    const tagCode: string = route.snapshot.queryParamMap.get('tagCode') ?? '';
    this.customerForm = formBuilder.nonNullable.group({
      fullName: ['', [Validators.required, Validators.maxLength(120)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+()\s-]{6,20}$/)]],
      email: ['', [Validators.email, Validators.maxLength(160)]],
      keyTagCode: [tagCode, [Validators.maxLength(80)]],
      acceptsDataProtection: [false, [Validators.requiredTrue]]
    });
  }

  saveCustomer(): void {
    this.errorMessage = '';
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formValue = this.customerForm.getRawValue();
    this.dataService.registerCustomer({
      fullName: formValue.fullName,
      phone: formValue.phone,
      email: formValue.email,
      keyTagCode: formValue.keyTagCode,
      acceptsDataProtection: formValue.acceptsDataProtection
    }).subscribe({
      next: (customer: Customer) => {
        this.sessionService.setCustomer(customer);
        this.router.navigate(['/main/waiter/order']);
      },
      error: (error: Error) => {
        this.errorMessage = error.message || 'No se ha podido dar de alta al cliente.';
        this.isSaving = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/main/waiter/identify']);
  }
}
