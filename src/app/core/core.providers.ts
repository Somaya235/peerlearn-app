import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

// Core providers that will be available throughout the application
export const coreProviders: EnvironmentProviders[] = [
  // Add any environment-specific providers here
  // For example: provideAuth(), provideFirestore(), etc.
];

export const provideCore = () => makeEnvironmentProviders(coreProviders);
