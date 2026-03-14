import { Component, DestroyRef } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AsyncPipe, NgIf, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  readonly user$;

  form!: FormGroup;

  constructor(
    private readonly authService: AuthService,
    private readonly fb: FormBuilder,
    destroyRef: DestroyRef,
  ) {
    this.user$ = this.authService.user$;
    this.form = this.fb.group({
      address: [''],
      phone: [''],
    });
    this.user$.pipe(takeUntilDestroyed(destroyRef)).subscribe((user) => {
      if (!user) {
        return;
      }
      this.form.patchValue({
        address: user.address,
        phone: user.phone,
      });
    });
  }

  save(): void {
    const raw = this.form.getRawValue();
    this.authService.updateProfile({
      address: raw.address ?? '',
      phone: raw.phone ?? '',
    });
  }
}
