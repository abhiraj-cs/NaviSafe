'use client';

// A simple, dependency-free event emitter for broadcasting errors.
type Listener = (...args: any[]) => void;

class EventEmitter {
  private events: { [key: string]: Listener[] } = {};

  on(eventName: string, listener: Listener): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  emit(eventName: string, ...args: any[]): void {
    const listeners = this.events[eventName];
    if (listeners) {
      listeners.forEach(listener => listener(...args));
    }
  }

  off(eventName: string, listenerToRemove: Listener): void {
    const listeners = this.events[eventName];
    if (listeners) {
      this.events[eventName] = listeners.filter(
        listener => listener !== listenerToRemove
      );
    }
  }
}

export const errorEmitter = new EventEmitter();
