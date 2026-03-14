import { Component } from '@angular/core';
import { NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgForOf, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
  readonly links = [
    { label: 'About', path: '/profile' },
    { label: 'Careers', path: '/home' },
    { label: 'Help & Support', path: '/orders' },
    { label: 'Partner with us', path: '/restaurants' },
  ];
}
