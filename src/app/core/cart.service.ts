import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TICKETS_URL } from './tokens';

// Shape of data from json-server
interface TicketEntry {
  id: string; // database ID
  eventId: string; // our actual event ID
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly httpClient = inject(HttpClient);
  private readonly ticketsUrl = inject(TICKETS_URL);
  private readonly ticketIds = signal<string[]>([]);

  readonly count = computed(() => this.ticketIds().length);

  constructor() {
    this.loadTickets();
  }

  private loadTickets() {
    this.httpClient.get<TicketEntry[]>(this.ticketsUrl).subscribe({
      next: (data) => {
        const ids = data.map((t) => t.eventId);
        this.ticketIds.set(ids);
      },
      error: (err) => console.error('Failed to load cart', err),
    });
  }

  addTicket(eventId: string) {
    const previousIds = this.ticketIds();

    // Optimistically update UI
    this.ticketIds.update((ids) => [...ids, eventId]);

    this.httpClient.post(this.ticketsUrl, { eventId }).subscribe({
      next: () => console.log('Tickets synced to backend'),
      error: (err) => {
        console.error('Sync failed, reverting state', err);
        // Revert on Error
        this.ticketIds.set(previousIds);
        alert('Failed to add ticket to cart.');
      },
    });
  }
}
