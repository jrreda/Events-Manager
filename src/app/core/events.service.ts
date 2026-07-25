import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { DevFestEvent } from '../models/event.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/events';

  getEvenetsResource(query: Signal<string>) {
    return httpResource<DevFestEvent[]>(() => {
      const q = query();
      return q ? `${this.apiUrl}?q=${q}` : this.apiUrl;
    });
  }

  getEventResource(id: Signal<string>) {
    return httpResource<DevFestEvent>(() => {
      const eventId = id();

      if (!eventId) return undefined;

      return `${this.apiUrl}/${eventId}`;
    });
  }

  createEvent(event: Omit<DevFestEvent, 'id'>): Observable<DevFestEvent> {
    return this.http.post<DevFestEvent>(this.apiUrl, event);
  }

  deleteEvent(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
