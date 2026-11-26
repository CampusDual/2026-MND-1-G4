import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer, Waiter } from './models/waiter.models';
import { WaiterDataService } from './waiter-data.service';
import { WaiterSessionService } from './waiter-session.service';

/** Permite al camarero identificarse al inicio de su turno. */
@Component({
  selector: 'app-waiter-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './waiter-select.component.html',
  styleUrl: './waiter-select.component.scss'
})
export class WaiterSelectComponent implements OnInit {
  waiters: Waiter[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private readonly dataService: WaiterDataService,
    private readonly sessionService: WaiterSessionService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.dataService.listWaiters().subscribe({
      next: (waiters: Waiter[]) => {
        this.waiters = waiters;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'No se ha podido cargar la lista de camareros.';
        this.isLoading = false;
      }
    });
  }

  selectWaiter(waiter: Waiter): void {
    this.sessionService.startFor(waiter);
    this.router.navigate(['/main/waiter/identify']);
  }
}
