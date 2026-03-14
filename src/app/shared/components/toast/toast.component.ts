import { Component, DestroyRef } from '@angular/core';
import { NgForOf, NgClass, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NotificationPayload,
  NotificationService,
  NotificationTone,
} from '@core/services/notification.service';

interface ToastMessage extends NotificationPayload {
  expiresAt: number;
  icon: string;
}

const ICONS: Record<NotificationTone, string> = {
  success: 'check_circle',
  info: 'info',
  warning: 'warning',
  error: 'error',
};

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgForOf, NgClass, NgIf],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  toasts: ToastMessage[] = [];

  constructor(
    private readonly notificationService: NotificationService,
    destroyRef: DestroyRef,
  ) {
    this.notificationService.notifications$
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe((notification) => this.push(notification));
  }

  dismiss(id: string): void {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
  }

  private push(payload: NotificationPayload): void {
    const toast: ToastMessage = {
      ...payload,
      expiresAt: Date.now() + 4000,
      icon: ICONS[payload.tone] ?? ICONS.info,
    };
    this.toasts = [...this.toasts, toast];
    const ttl = toast.expiresAt - Date.now();
    setTimeout(() => this.dismiss(toast.id), Math.max(ttl, 1500));
  }
}
