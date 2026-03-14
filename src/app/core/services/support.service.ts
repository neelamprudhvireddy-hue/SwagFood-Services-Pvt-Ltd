import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SupportMessage } from '@models/support.model';
import { initialMessages, supportContactReasons, supportFaq } from '@core/data/mock-support';

@Injectable({
  providedIn: 'root',
})
export class SupportService {
  getFaq(): Observable<{ question: string; answer: string }[]> {
    return of(supportFaq).pipe(delay(400));
  }

  getInitialMessages(): Observable<SupportMessage[]> {
    return of(initialMessages).pipe(delay(200));
  }

  getContactReasons(): Observable<{ label: string; value: string; sla: string }[]> {
    return of(supportContactReasons).pipe(delay(200));
  }

  sendMessage(text: string): Observable<SupportMessage> {
    const reply: SupportMessage = {
      id:
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : Date.now().toString(),
      from: 'agent',
      text: `Thanks! We are looking into "${text}" right away.`,
      timestamp: new Date().toISOString(),
    };
    return of(reply).pipe(delay(900));
  }

  reportIssue(payload: {
    orderId: string;
    message: string;
  }): Observable<{ ticketId: string }> {
    const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    return of({ ticketId }).pipe(delay(700));
  }

  contactSupport(payload: {
    name: string;
    email: string;
    channel: string;
    topic: string;
    message: string;
  }): Observable<{ ticketId: string }> {
    const ticketId = `SUP-${Math.floor(1000 + Math.random() * 9000)}`;
    return of({ ticketId }).pipe(delay(800));
  }
}
