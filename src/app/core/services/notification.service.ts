import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export type NotificationTone = 'info' | 'success' | 'warning' | 'error';

export interface NotificationPayload {
  id: string;
  message: string;
  tone: NotificationTone;
  createdAt: number;
  meta?: Record<string, unknown>;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly stream = new Subject<NotificationPayload>();

  get notifications$(): Observable<NotificationPayload> {
    return this.stream.asObservable();
  }

  info(message: string, meta?: Record<string, unknown>): string {
    return this.push(message, 'info', meta);
  }

  success(message: string, meta?: Record<string, unknown>): string {
    return this.push(message, 'success', meta);
  }

  warning(message: string, meta?: Record<string, unknown>): string {
    return this.push(message, 'warning', meta);
  }

  error(message: string, meta?: Record<string, unknown>): string {
    return this.push(message, 'error', meta);
  }

  private push(
    message: string,
    tone: NotificationTone,
    meta?: Record<string, unknown>,
  ): string {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${tone}-${Date.now()}`;
    this.stream.next({
      id,
      message,
      tone,
      meta,
      createdAt: Date.now(),
    });
    return id;
  }
}
