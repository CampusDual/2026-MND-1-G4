import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CustomerIdentifyComponent } from './customer-identify.component';
import { Customer, OrderQuote, OrderReceipt, OrderSubmission } from './models/waiter.models';
import { WaiterDataService } from './waiter-data.service';
import { WaiterSessionService } from './waiter-session.service';

describe('WaiterDataService', () => {
  let service: WaiterDataService;

  beforeEach(() => {
    service = new WaiterDataService();
  });

  describe('CustomerIdentifyComponent', () => {
    it('shows customer registration as the first action after waiter selection', async () => {
      await TestBed.configureTestingModule({
        imports: [CustomerIdentifyComponent],
        providers: [provideRouter([])]
      }).compileComponents();
      TestBed.inject(WaiterSessionService).startFor({
        id: 'waiter-lucia',
        name: 'Lucía',
        storeId: 'store-main'
      });

      const fixture = TestBed.createComponent(CustomerIdentifyComponent);
      fixture.detectChanges();

      const firstAction: HTMLButtonElement | null = fixture.nativeElement.querySelector(
        '.waiter-card > button'
      );
      expect(firstAction?.textContent?.trim()).toBe('Inscribir cliente nuevo');
    });
  });

  it('quotes Carmen\'s reward and croissant promotion as separate line discounts', async () => {
    const customer: Customer = await findCustomer('NFC-0001');
    const quote: OrderQuote = service.quoteOrder(
      [
        { productId: 'pastry-croissant', quantity: 2 },
        { productId: 'coffee-milk', quantity: 1 }
      ],
      'promo-pastry-two-for-one',
      'reward-milk-coffee',
      customer
    );

    expect(quote.subtotalCents).toBe(490);
    expect(quote.promotionDiscountCents).toBe(160);
    expect(quote.rewardDiscountCents).toBe(170);
    expect(quote.totalDiscountCents).toBe(330);
    expect(quote.totalCents).toBe(160);
    expect(quote.pointsEarned).toBe(1);
    expect(quote.customerPointsAfterOrder).toBe(71);
    expect(quote.lines[0].discounts[0].name).toBe('Bollería 2x1');
    expect(quote.lines[0].discounts[0].amountCents).toBe(160);
    expect(quote.lines[1].discounts[0].name).toBe('Café con leche gratis');
    expect(quote.lines[1].discounts[0].amountCents).toBe(170);
    expect(quote.lines[1].discounts[0].pointsCost).toBe(50);
  });

  it('does not apply points or rewards to an unidentified order', () => {
    const quote: OrderQuote = service.quoteOrder(
      [{ productId: 'pastry-croissant', quantity: 2 }],
      'promo-pastry-two-for-one',
      null,
      null
    );

    expect(quote.totalCents).toBe(160);
    expect(quote.pointsEarned).toBe(0);
    expect(quote.customerPointsAfterOrder).toBeNull();
    expect(quote.rewardDiscountCents).toBe(0);
  });

  it('does not apply the croissant promotion to another pastry product', () => {
    const quote: OrderQuote = service.quoteOrder(
      [{ productId: 'pastry-chocolate-napolitana', quantity: 2 }],
      'promo-pastry-two-for-one',
      null,
      null
    );

    expect(quote.promotionDiscountCents).toBe(0);
    expect(quote.totalCents).toBe(360);
  });

  it('rejects a reward when Pablo has insufficient points', async () => {
    const pablo: Customer = await findCustomer('NFC-0002');

    expect(() => service.quoteOrder(
      [{ productId: 'coffee-milk', quantity: 1 }],
      null,
      'reward-milk-coffee',
      pablo
    )).toThrowError('El cliente no puede realizar el canje seleccionado.');
  });

  it('saves an offline order and retrying does not duplicate its points', async () => {
    const customer: Customer = await findCustomer('NFC-0001');
    const request: OrderSubmission = {
      waiterId: 'waiter-marta',
      customerId: customer.id,
      items: [
        { productId: 'pastry-croissant', quantity: 2 },
        { productId: 'coffee-milk', quantity: 1 }
      ],
      promotionId: 'promo-pastry-two-for-one',
      rewardId: 'reward-milk-coffee'
    };
    const firstReceipt: OrderReceipt = await firstValueFrom(service.sendOrder(request));

    expect(firstReceipt.status).toBe('posUnavailable');
    expect(firstReceipt.totalCents).toBe(160);
    expect((await findCustomer('NFC-0001')).points).toBe(71);

    const retriedReceipt: OrderReceipt = await firstValueFrom(service.retryOrder(firstReceipt.id));

    expect(retriedReceipt.status).toBe('posUnavailable');
    expect((await findCustomer('NFC-0001')).points).toBe(71);
  });

  async function findCustomer(keyTagCode: string): Promise<Customer> {
    const customer: Customer | null = await firstValueFrom(service.findCustomerByKeyTag(keyTagCode));
    if (customer === null) {
      throw new Error(`No se encontró el cliente de prueba ${keyTagCode}.`);
    }
    return customer;
  }
});
