import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupportService } from '@core/services/support.service';
import { SupportMessage } from '@models/support.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [NgForOf, ReactiveFormsModule, AsyncPipe, DatePipe, NgIf],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportComponent {
  private readonly supportService = inject(SupportService);
  private readonly fb = inject(FormBuilder);
  private readonly notifications = inject(NotificationService);

  readonly faqs$ = this.supportService.getFaq();
  readonly contactReasons$ = this.supportService.getContactReasons();
  readonly chatForm = this.fb.group({
    message: ['', Validators.required],
  });
  readonly issueForm = this.fb.group({
    orderId: ['', Validators.required],
    description: ['', Validators.required],
  });
  readonly contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    topic: ['', Validators.required],
    channel: ['chat', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  messages: SupportMessage[] = [];
  sending = false;

  constructor() {
    this.supportService.getInitialMessages().subscribe((msgs) => (this.messages = msgs));
  }

  sendChat(): void {
    if (this.chatForm.invalid) {
      this.chatForm.markAllAsTouched();
      return;
    }
    const text = this.chatForm.value.message ?? '';
    const userMessage: SupportMessage = {
      id:
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : Date.now().toString(),
      from: 'user',
      text,
      timestamp: new Date().toISOString(),
    };
    this.messages = [...this.messages, userMessage];
    this.sending = true;
    this.supportService.sendMessage(text).subscribe({
      next: (reply) => {
        this.messages = [...this.messages, reply];
        this.chatForm.reset();
        this.sending = false;
        this.notifications.info('Agent replied in chat');
      },
      error: () => {
        this.sending = false;
        this.notifications.error('Unable to send message. Please retry.');
      },
    });
  }

  reportIssue(): void {
    if (this.issueForm.invalid) {
      this.issueForm.markAllAsTouched();
      return;
    }
    this.supportService
      .reportIssue({
        orderId: this.issueForm.value.orderId ?? '',
        message: this.issueForm.value.description ?? '',
      })
      .subscribe({
        next: ({ ticketId }) => {
          this.notifications.success(`Issue logged  -  ${ticketId}`);
          this.issueForm.reset();
        },
        error: () => this.notifications.error('Unable to log issue right now.'),
      });
  }

  contactSupport(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.supportService
      .contactSupport({
        name: this.contactForm.value.name ?? '',
        email: this.contactForm.value.email ?? '',
        topic: this.contactForm.value.topic ?? '',
        channel: this.contactForm.value.channel ?? 'chat',
        message: this.contactForm.value.message ?? '',
      })
      .subscribe({
        next: ({ ticketId }) => {
          this.notifications.success(`Support ticket created  -  ${ticketId}`);
          this.contactForm.reset({ channel: 'chat' });
        },
        error: () =>
          this.notifications.error('Could not create a ticket. Try again in a minute.'),
      });
  }

  fieldInvalid(group: 'issue' | 'contact', control: string): boolean {
    const form: FormGroup = group === 'issue' ? this.issueForm : this.contactForm;
    const ctrl = form.get(control);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  errorCopy(group: 'issue' | 'contact', control: string): string {
    const form: FormGroup = group === 'issue' ? this.issueForm : this.contactForm;
    const ctrl = form.get(control);
    if (!ctrl || !ctrl.errors) {
      return '';
    }
    if (ctrl.errors['required']) {
      return 'Required';
    }
    if (ctrl.errors['email']) {
      return 'Invalid email';
    }
    if (ctrl.errors['minlength']) {
      return `Add at least ${ctrl.errors['minlength'].requiredLength} characters`;
    }
    return 'Invalid value';
  }

  prefillContact(topic: string, channel: 'chat' | 'call' | 'email' = 'chat'): void {
    this.contactForm.patchValue({ topic, channel });
    this.notifications.info('Contact form updated. Submit to raise a ticket.');
  }
}
