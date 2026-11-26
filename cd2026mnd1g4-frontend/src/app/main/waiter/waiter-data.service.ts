import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {
  Customer,
  CustomerRegistration,
  OrderDiscountLine,
  OrderLineInput,
  OrderQuote,
  OrderQuoteLine,
  OrderReceipt,
  OrderSubmission,
  Product,
  Promotion,
  Reward,
  Store,
  Waiter
} from './models/waiter.models';

/** Proporciona datos y operaciones simuladas sustituibles por el servicio HTTP real. */
@Injectable({ providedIn: 'root' })
export class WaiterDataService {
  private readonly waiters: Waiter[] = [
    { id: 'waiter-lucia', name: 'Lucía', storeId: 'store-main' },
    { id: 'waiter-andres', name: 'Andrés', storeId: 'store-main' },
    { id: 'waiter-marta', name: 'Marta', storeId: 'store-outage' }
  ];

  private readonly stores: Store[] = [
    { id: 'store-main', posAvailable: true },
    { id: 'store-outage', posAvailable: false }
  ];

  private readonly customers: Customer[] = [
    {
      id: 'customer-carmen',
      fullName: 'Carmen López',
      phone: '600111222',
      email: null,
      keyTagCode: 'NFC-0001',
      points: 120,
      favoriteProductNames: ['Croissant', 'Café con leche']
    },
    {
      id: 'customer-pablo',
      fullName: 'Pablo Rivas',
      phone: '600333444',
      email: null,
      keyTagCode: 'NFC-0002',
      points: 35,
      favoriteProductNames: ['Tostada con tomate', 'Café solo']
    }
  ];

  private readonly products: Product[] = [
    { id: 'coffee-solo', name: 'Café solo', category: 'coffee', unitPriceCents: 140 },
    { id: 'coffee-milk', name: 'Café con leche', category: 'coffee', unitPriceCents: 170 },
    { id: 'coffee-cappuccino', name: 'Capuchino', category: 'coffee', unitPriceCents: 230 },
    { id: 'drink-orange-juice', name: 'Zumo de naranja', category: 'drink', unitPriceCents: 280 },
    { id: 'pastry-croissant', name: 'Croissant', category: 'pastry', unitPriceCents: 160 },
    {
      id: 'pastry-chocolate-napolitana',
      name: 'Napolitana de chocolate',
      category: 'pastry',
      unitPriceCents: 180
    },
    { id: 'food-tomato-toast', name: 'Tostada con tomate', category: 'food', unitPriceCents: 250 }
  ];

  private readonly promotions: Promotion[] = [
    {
      id: 'promo-pastry-two-for-one',
      name: 'Bollería 2x1',
      description: 'Cada dos unidades de bollería, una gratis.',
      kind: 'twoForOne',
      productId: 'pastry-croissant'
    },
    {
      id: 'promo-napolitana-20',
      name: '−20 % napolitanas',
      description: 'Descuento en cada napolitana de chocolate.',
      kind: 'percentage',
      productId: 'pastry-chocolate-napolitana',
      discountPercent: 20
    },
    {
      id: 'promo-order-15',
      name: '−15 % en todo el pedido',
      description: 'Descuento del 15 % sobre el importe del pedido.',
      kind: 'orderPercentage',
      discountPercent: 15
    }
  ];

  private readonly rewards: Reward[] = [
    { id: 'reward-milk-coffee', name: 'Café con leche gratis', productId: 'coffee-milk', pointsCost: 50 },
    { id: 'reward-croissant', name: 'Croissant gratis', productId: 'pastry-croissant', pointsCost: 40 }
  ];

  private readonly receipts = new Map<string, OrderReceipt>();
  private nextCustomerNumber: number = 3;
  private nextOrderNumber: number = 1;

  listWaiters(): Observable<Waiter[]> {
    return of(this.waiters.map((waiter: Waiter) => ({ ...waiter })));
  }

  findCustomerByKeyTag(code: string): Observable<Customer | null> {
    const normalizedCode: string = code.trim().toUpperCase();
    if (!normalizedCode) {
      return throwError(() => new Error('El código del llavero es obligatorio.'));
    }
    return of(this.copyCustomer(this.customers.find(
      (customer: Customer) => customer.keyTagCode?.toUpperCase() === normalizedCode
    ) ?? null));
  }

  findCustomerByPhone(phone: string): Observable<Customer | null> {
    const normalizedPhone: string = this.normalizePhone(phone);
    if (normalizedPhone.length < 6) {
      return throwError(() => new Error('Introduce un teléfono válido.'));
    }
    return of(this.copyCustomer(this.customers.find(
      (customer: Customer) => this.normalizePhone(customer.phone) === normalizedPhone
    ) ?? null));
  }

  registerCustomer(request: CustomerRegistration): Observable<Customer> {
    const fullName: string = request.fullName.trim();
    const phone: string = this.normalizePhone(request.phone);
    const keyTagCode: string | null = request.keyTagCode?.trim().toUpperCase() || null;

    if (!fullName || phone.length < 6 || !request.acceptsDataProtection) {
      return throwError(() => new Error('Revisa los campos obligatorios y el consentimiento RGPD.'));
    }
    if (this.customers.some((customer: Customer) => this.normalizePhone(customer.phone) === phone)) {
      return throwError(() => new Error('Ya existe un cliente con ese teléfono.'));
    }
    if (keyTagCode && this.customers.some((customer: Customer) => customer.keyTagCode === keyTagCode)) {
      return throwError(() => new Error('Ese código de llavero ya está registrado.'));
    }

    const customer: Customer = {
      id: `customer-${this.nextCustomerNumber++}`,
      fullName,
      phone,
      email: request.email?.trim() || null,
      keyTagCode,
      points: 0,
      favoriteProductNames: []
    };
    this.customers.push(customer);
    return of({ ...customer, favoriteProductNames: [...customer.favoriteProductNames] });
  }

  getProducts(): Observable<Product[]> {
    return of(this.products.map((product: Product) => ({ ...product })));
  }

  getPromotions(): Observable<Promotion[]> {
    return of(this.promotions.map((promotion: Promotion) => ({ ...promotion })));
  }

  getRewards(): Observable<Reward[]> {
    return of(this.rewards.map((reward: Reward) => ({ ...reward })));
  }

  quoteOrder(
    items: OrderLineInput[],
    promotionId: string | null,
    rewardId: string | null,
    customer: Customer | null
  ): OrderQuote {
    this.validateQuoteItems(items);
    const promotion: Promotion | undefined = promotionId
      ? this.promotions.find((candidate: Promotion) => candidate.id === promotionId)
      : undefined;
    if (promotionId && !promotion) {
      throw new Error('La promoción seleccionada no está disponible.');
    }

    const reward: Reward | undefined = rewardId
      ? this.rewards.find((candidate: Reward) => candidate.id === rewardId)
      : undefined;
    if (rewardId && !reward) {
      throw new Error('La recompensa seleccionada no está disponible.');
    }
    if (reward && (
      !customer
      || customer.points < reward.pointsCost
      || !items.some((item: OrderLineInput) => item.productId === reward.productId)
    )) {
      throw new Error('El cliente no puede realizar el canje seleccionado.');
    }

    const lines: OrderQuoteLine[] = items.map((item: OrderLineInput) => {
      const product: Product | undefined = this.products.find(
        (candidate: Product) => candidate.id === item.productId
      );
      if (!product) {
        throw new Error('El pedido contiene un producto no válido.');
      }
      const subtotalCents: number = product.unitPriceCents * item.quantity;
      const discounts: OrderDiscountLine[] = [];
      const rewardApplies: boolean = reward?.productId === product.id;
      const rewardDiscountCents: number = rewardApplies
        ? Math.min(product.unitPriceCents, subtotalCents)
        : 0;
      if (reward && rewardApplies) {
        discounts.push({
          name: reward.name,
          amountCents: rewardDiscountCents,
          kind: 'reward',
          pointsCost: reward.pointsCost
        });
      }

      const remainingQuantity: number = item.quantity - (rewardApplies ? 1 : 0);
      const remainingCents: number = subtotalCents - rewardDiscountCents;
      const promotionDiscountCents: number = this.calculateProductPromotionDiscount(
        product,
        remainingQuantity,
        remainingCents,
        promotion
      );
      if (promotion && promotionDiscountCents > 0) {
        discounts.push({
          name: promotion.name,
          amountCents: promotionDiscountCents,
          kind: 'promotion',
          pointsCost: null
        });
      }

      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPriceCents: product.unitPriceCents,
        subtotalCents,
        discounts,
        totalCents: Math.max(0, remainingCents - promotionDiscountCents)
      };
    });

    const subtotalCents: number = lines.reduce(
      (total: number, line: OrderQuoteLine) => total + line.subtotalCents,
      0
    );
    const rewardDiscountCents: number = lines.reduce(
      (total: number, line: OrderQuoteLine) => total + line.discounts
        .filter((discount: OrderDiscountLine) => discount.kind === 'reward')
        .reduce((lineTotal: number, discount: OrderDiscountLine) => lineTotal + discount.amountCents, 0),
      0
    );
    const linePromotionDiscountCents: number = lines.reduce(
      (total: number, line: OrderQuoteLine) => total + line.discounts
        .filter((discount: OrderDiscountLine) => discount.kind === 'promotion')
        .reduce((lineTotal: number, discount: OrderDiscountLine) => lineTotal + discount.amountCents, 0),
      0
    );
    const postRewardCents: number = subtotalCents - rewardDiscountCents;
    const orderDiscountCents: number = promotion?.kind === 'orderPercentage'
      ? Math.min(postRewardCents, Math.round(postRewardCents * promotion.discountPercent / 100))
      : 0;
    const promotionDiscountCents: number = linePromotionDiscountCents + orderDiscountCents;
    const totalDiscountCents: number = rewardDiscountCents + promotionDiscountCents;
    const totalCents: number = Math.max(0, subtotalCents - totalDiscountCents);
    const pointsEarned: number = customer ? Math.floor(totalCents / 100) : 0;
    const customerPointsAfterOrder: number | null = customer
      ? Math.max(0, customer.points - (reward?.pointsCost ?? 0)) + pointsEarned
      : null;

    return {
      lines,
      subtotalCents,
      orderDiscountCents,
      orderDiscountName: orderDiscountCents > 0 ? promotion?.name ?? null : null,
      promotionDiscountCents,
      rewardDiscountCents,
      totalDiscountCents,
      totalCents,
      pointsEarned,
      customerPointsAfterOrder
    };
  }

  sendOrder(request: OrderSubmission): Observable<OrderReceipt> {
    if (!request.waiterId || request.items.length === 0) {
      return throwError(() => new Error('Selecciona al menos un producto antes de enviar el pedido.'));
    }
    if (request.items.some((item) =>
      !this.products.some((product: Product) => product.id === item.productId)
      || !Number.isInteger(item.quantity)
      || item.quantity <= 0
    )) {
      return throwError(() => new Error('El pedido contiene productos o cantidades no válidas.'));
    }
    if (new Set(request.items.map((item: OrderLineInput) => item.productId)).size !== request.items.length) {
      return throwError(() => new Error('El pedido contiene productos repetidos en distintas líneas.'));
    }
    const waiter: Waiter | undefined = this.waiters.find(
      (candidate: Waiter) => candidate.id === request.waiterId
    );
    if (!waiter) {
      return throwError(() => new Error('No se encuentra el camarero seleccionado.'));
    }
    const store: Store | undefined = this.stores.find(
      (candidate: Store) => candidate.id === waiter.storeId
    );
    if (!store) {
      return throwError(() => new Error('No se encuentra el local del camarero seleccionado.'));
    }

    const customer: Customer | null = request.customerId
      ? this.customers.find((candidate: Customer) => candidate.id === request.customerId) ?? null
      : null;
    if (request.customerId && !customer) {
      return throwError(() => new Error('No se encuentra el cliente seleccionado.'));
    }

    let quote: OrderQuote;
    try {
      quote = this.quoteOrder(
        request.items,
        request.promotionId,
        request.rewardId,
        customer
      );
    } catch (error: unknown) {
      return throwError(() => error instanceof Error
        ? error
        : new Error('No se ha podido calcular el pedido.'));
    }
    if (customer) {
      customer.points = quote.customerPointsAfterOrder ?? customer.points;
    }

    const receipt: OrderReceipt = {
      id: `order-${this.nextOrderNumber++}`,
      waiterId: waiter.id,
      quote,
      totalCents: quote.totalCents,
      pointsEarned: quote.pointsEarned,
      customerPointsAfterOrder: quote.customerPointsAfterOrder,
      status: store.posAvailable ? 'sent' : 'posUnavailable'
    };
    this.receipts.set(receipt.id, receipt);
    return of(receipt);
  }

  retryOrder(receiptId: string): Observable<OrderReceipt> {
    const receipt: OrderReceipt | undefined = this.receipts.get(receiptId);
    if (!receipt) {
      return throwError(() => new Error('No se encuentra el pedido guardado para reintentar el envío.'));
    }
    const waiter: Waiter | undefined = this.waiters.find(
      (candidate: Waiter) => candidate.id === receipt.waiterId
    );
    const store: Store | undefined = waiter
      ? this.stores.find((candidate: Store) => candidate.id === waiter.storeId)
      : undefined;
    if (!store) {
      return throwError(() => new Error('No se encuentra el local para reintentar el envío.'));
    }
    receipt.status = store.posAvailable ? 'sent' : 'posUnavailable';
    return of({ ...receipt, quote: this.copyQuote(receipt.quote) });
  }

  printTicket(receiptId: string): Observable<void> {
    if (!this.receipts.has(receiptId)) {
      return throwError(() => new Error('No se encuentra el pedido para imprimir el ticket.'));
    }
    return of(void 0);
  }

  private validateQuoteItems(items: OrderLineInput[]): void {
    if (items.some((item: OrderLineInput) =>
      !this.products.some((product: Product) => product.id === item.productId)
      || !Number.isInteger(item.quantity)
      || item.quantity <= 0
    )) {
      throw new Error('El pedido contiene productos o cantidades no válidas.');
    }
  }

  private calculateProductPromotionDiscount(
    product: Product,
    remainingQuantity: number,
    remainingCents: number,
    promotion: Promotion | undefined
  ): number {
    if (!promotion || promotion.kind === 'orderPercentage' || promotion.productId !== product.id) {
      return 0;
    }
    if (promotion.kind === 'twoForOne') {
      return Math.min(
        remainingCents,
        Math.floor(remainingQuantity / 2) * product.unitPriceCents
      );
    }
    return Math.min(
      remainingCents,
      Math.round(product.unitPriceCents * promotion.discountPercent / 100) * remainingQuantity
    );
  }

  private copyQuote(quote: OrderQuote): OrderQuote {
    return {
      ...quote,
      lines: quote.lines.map((line: OrderQuoteLine) => ({
        ...line,
        discounts: line.discounts.map((discount: OrderDiscountLine) => ({ ...discount }))
      }))
    };
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  private copyCustomer(customer: Customer | null): Customer | null {
    return customer ? { ...customer, favoriteProductNames: [...customer.favoriteProductNames] } : null;
  }
}
