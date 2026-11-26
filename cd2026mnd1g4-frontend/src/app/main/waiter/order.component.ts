import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import {
  Customer,
  OrderLineInput,
  OrderQuote,
  OrderReceipt,
  Product,
  ProductCategory,
  Promotion,
  Reward,
  Waiter
} from './models/waiter.models';
import { WaiterDataService } from './waiter-data.service';
import { WaiterSessionService } from './waiter-session.service';

/** Gestiona el pedido, sus descuentos y el envío simulado al TPV. */
@Component({
  selector: 'app-waiter-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  readonly categories: { id: ProductCategory; name: string }[] = [
    { id: 'coffee', name: 'Cafés' },
    { id: 'drink', name: 'Bebidas' },
    { id: 'pastry', name: 'Bollería' },
    { id: 'food', name: 'Comida' }
  ];
  readonly waiter: Waiter | null;
  customer: Customer | null;

  products: Product[] = [];
  promotions: Promotion[] = [];
  rewards: Reward[] = [];
  selectedCategory: ProductCategory = 'coffee';
  selectedPromotionId: string | null = null;
  selectedRewardId: string | null = null;
  quantities: Record<string, number> = {};
  errorMessage: string = '';
  printMessage: string = '';
  retryMessage: string = '';
  retryErrorMessage: string = '';
  isLoading: boolean = true;
  isSending: boolean = false;
  isRetrying: boolean = false;
  receipt: OrderReceipt | null = null;
  submittedQuote: OrderQuote | null = null;

  constructor(
    private readonly dataService: WaiterDataService,
    private readonly sessionService: WaiterSessionService,
    private readonly router: Router
  ) {
    this.waiter = this.sessionService.currentWaiter();
    this.customer = this.sessionService.currentCustomer();
    if (!this.waiter) {
      this.router.navigate(['/main/waiter']);
    }
  }

  ngOnInit(): void {
    forkJoin({
      products: this.dataService.getProducts(),
      promotions: this.dataService.getPromotions(),
      rewards: this.dataService.getRewards()
    }).subscribe({
      next: (data) => {
        this.products = data.products;
        this.promotions = data.promotions;
        this.rewards = data.rewards;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'No se ha podido cargar la carta y las ofertas.';
        this.isLoading = false;
      }
    });
  }

  productsInCategory(category: ProductCategory): Product[] {
    return this.products.filter((product: Product) => product.category === category);
  }

  formatPrice(cents: number): string {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cents / 100);
  }

  formatNegativePrice(cents: number): string {
    return `−${this.formatPrice(cents)}`;
  }

  quantityFor(productId: string): number {
    return this.quantities[productId] ?? 0;
  }

  changeQuantity(product: Product, change: number): void {
    if (this.receipt) {
      return;
    }
    this.quantities[product.id] = Math.max(0, this.quantityFor(product.id) + change);
    if (
      this.selectedRewardId &&
      this.quantityFor(this.rewardProductId(this.selectedRewardId)) === 0
    ) {
      this.selectedRewardId = null;
    }
  }

  togglePromotion(promotion: Promotion): void {
    if (this.receipt) {
      return;
    }
    this.selectedPromotionId = this.selectedPromotionId === promotion.id ? null : promotion.id;
  }

  selectReward(reward: Reward): void {
    if (this.receipt || !this.customer || this.customer.points < reward.pointsCost) {
      return;
    }
    if (this.selectedRewardId === reward.id) {
      this.selectedRewardId = null;
      return;
    }
    this.selectedRewardId = reward.id;
    const rewardProduct: Product | undefined = this.products.find(
      (product: Product) => product.id === reward.productId
    );
    if (rewardProduct && this.quantityFor(reward.productId) === 0) {
      this.quantities[reward.productId] = 1;
    }
  }

  get orderItems(): OrderLineInput[] {
    return this.products
      .map((product: Product) => ({ productId: product.id, quantity: this.quantityFor(product.id) }))
      .filter((item: OrderLineInput) => item.quantity > 0);
  }

  get quote(): OrderQuote {
    if (this.submittedQuote) {
      return this.submittedQuote;
    }
    return this.dataService.quoteOrder(
      this.orderItems,
      this.selectedPromotionId,
      this.selectedRewardId,
      this.customer
    );
  }

  sendToPos(): void {
    this.errorMessage = '';
    if (this.isSending || this.receipt || !this.waiter || this.orderItems.length === 0) {
      return;
    }

    this.isSending = true;
    this.dataService.sendOrder({
      waiterId: this.waiter.id,
      customerId: this.customer?.id ?? null,
      items: this.orderItems,
      promotionId: this.selectedPromotionId,
      rewardId: this.selectedRewardId
    }).subscribe({
      next: (receipt: OrderReceipt) => {
        this.receipt = receipt;
        this.submittedQuote = receipt.quote;
        if (this.customer && receipt.customerPointsAfterOrder !== null) {
          this.customer = { ...this.customer, points: receipt.customerPointsAfterOrder };
          this.sessionService.setCustomer(this.customer);
        }
        this.isSending = false;
      },
      error: (error: Error) => {
        this.errorMessage = error.message || 'No se ha podido enviar el pedido al TPV.';
        this.isSending = false;
      }
    });
  }

  retryPos(): void {
    if (!this.receipt || this.isRetrying || this.receipt.status !== 'posUnavailable') {
      return;
    }
    this.retryMessage = '';
    this.retryErrorMessage = '';
    this.isRetrying = true;
    this.dataService.retryOrder(this.receipt.id).subscribe({
      next: (receipt: OrderReceipt) => {
        this.receipt = receipt;
        this.retryMessage = receipt.status === 'sent'
          ? 'El TPV respondió y el pedido se ha enviado.'
          : 'El TPV sigue sin responder. El pedido permanece guardado.';
        this.isRetrying = false;
      },
      error: (error: Error) => {
        this.retryErrorMessage = error.message || 'No se ha podido reintentar el envío al TPV.';
        this.isRetrying = false;
      }
    });
  }

  printTicket(): void {
    if (!this.receipt) {
      return;
    }
    this.printMessage = '';
    this.dataService.printTicket(this.receipt.id).subscribe({
      next: () => {
        this.printMessage = 'Ticket impreso (simulación).';
      },
      error: () => {
        this.printMessage = 'No se ha podido imprimir el ticket.';
      }
    });
  }

  nextCustomer(): void {
    this.sessionService.clearCustomer();
    this.router.navigate(['/main/waiter/identify']);
  }

  finishTurn(): void {
    this.sessionService.clear();
    this.router.navigate(['/main/waiter']);
  }

  private rewardProductId(rewardId: string): string {
    return this.rewards.find((reward: Reward) => reward.id === rewardId)?.productId ?? '';
  }
}
