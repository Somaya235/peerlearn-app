import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.html',
  styleUrls: ['./empty-state.scss']
})
export class EmptyStateComponent {
  @Input() title: string = 'No data available';
  @Input() description: string = 'There is nothing to show here.';
  @Input() icon: string = '📭';
  @Input() showButton: boolean = false;
  @Input() buttonText: string = 'Get Started';
  @Input() buttonAction: () => void = () => {};
}
