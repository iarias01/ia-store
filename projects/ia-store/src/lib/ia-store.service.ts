// projects/ia-store/src/lib/ia-store.service.ts
import { Injectable, Inject, InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';

export const ENCRYPTION_KEY = new InjectionToken<string>('ENCRYPTION_KEY');

@Injectable({
  providedIn: 'root',
})
export class IaStoreService {
  private channels = new Map<string, BehaviorSubject<any>>();

  constructor(@Inject(ENCRYPTION_KEY) private encryptionKey: string) {
    window.addEventListener('storage', this.syncData.bind(this));
  }

  private encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
  }

  private decryptData(data: string): string {
    try {
      return CryptoJS.AES.decrypt(data, this.encryptionKey).toString(
        CryptoJS.enc.Utf8
      );
    } catch (error) {
      console.error('Error decrypting data', error);
      return '';
    }
  }

  createChannel(key: string, data: any, isPermanent: boolean = false): void {
    if (this.channels.has(key)) {
      console.warn(`Channel with key ${key} already exists.`);
      return;
    }

    const storedData = localStorage.getItem(key);
    if (storedData) {
      data = JSON.parse(this.decryptData(storedData)); // Convertimos la data desencriptada de cadena a objeto
    }

    const subject = new BehaviorSubject<any>(data);
    this.channels.set(key, subject);

    if (isPermanent && !storedData) {
      const encryptedData = this.encryptData(JSON.stringify(data));
      localStorage.setItem(key, encryptedData);
    }
  }

  getChannelData(key: string): any {
    if (!this.channels.has(key)) {
      console.error(`Channel with key ${key} does not exist.`);
      return null;
    }

    const channel = this.channels.get(key);
    return channel;
  }

  updateChannelData(key: string, data: any): void {
    if (!this.channels.has(key)) {
      console.error(`Channel with key ${key} does not exist.`);
      return;
    }

    const channel = this.channels.get(key);
    channel!.next(data);

    if (localStorage.getItem(key)) {
      const encryptedData = this.encryptData(JSON.stringify(data));
      localStorage.setItem(key, encryptedData);
    }

    this.notifyStorageChange(key, data);
  }

  deleteChannel(key: string, permanent: boolean = false): void {
    if (!this.channels.has(key)) {
      console.error(`Channel with key ${key} does not exist.`);
      return;
    }

    this.channels.delete(key);

    if (permanent) {
      localStorage.removeItem(key);
    }

    this.notifyStorageChange(key, null);
  }

  private notifyStorageChange(key: string, data: any): void {
    const event = new CustomEvent('storage', { detail: { key, data } });
    window.dispatchEvent(event);
  }

  private syncData(event: StorageEvent): void {
    if (event.key && this.channels.has(event.key)) {
      const channel = this.channels.get(event.key);
      const newData = event.newValue
        ? JSON.parse(this.decryptData(event.newValue))
        : null;
      channel!.next(newData);
    }
  }
}
