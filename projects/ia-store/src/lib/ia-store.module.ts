// projects/ia-store/src/lib/ia-store.module.ts
import { NgModule, ModuleWithProviders } from '@angular/core';
import { ENCRYPTION_KEY } from './ia-store.service';

@NgModule({})
export class IaStoreModule {
  static forRoot(encryptionKey: string): ModuleWithProviders<IaStoreModule> {
    return {
      ngModule: IaStoreModule,
      providers: [{ provide: ENCRYPTION_KEY, useValue: encryptionKey }],
    };
  }
}
