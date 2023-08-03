import eventBus from '@/eventBus';
import {
  BROADCAST_TO_UI_EVENTS,
  BROADCAST_TO_UI_EVENTS_PAYLOAD,
  IDisposeFunc,
} from '@/utils/broadcastToUI';

export function onBroadcastToUI<T extends BROADCAST_TO_UI_EVENTS>(
  event: T,
  listener: (payload: BROADCAST_TO_UI_EVENTS_PAYLOAD[T]) => void
): IDisposeFunc {
  eventBus.addEventListener(event, listener);

  return () => {
    eventBus.removeEventListener(event, listener);
  };
}

type AllBackgroundStores = {
  contactBook: import('@/background/service/contactBook').ContactBookStore;
  preference: import('@/background/service/preference').PreferenceStore;
};

// type StoreRootModel = import('@/ui/models').RootModel;
export function onBackgroundStoreChangedStore<
  S extends keyof AllBackgroundStores
>(
  bgStoreName: S,
  listener: (
    payload: Omit<
      BROADCAST_TO_UI_EVENTS_PAYLOAD['storeChanged'],
      'partials'
    > & {
      bgStoreName: S;
      partials: Partial<AllBackgroundStores[S]>;
    }
  ) => void
) {
  return onBroadcastToUI(BROADCAST_TO_UI_EVENTS.storeChanged, (payload) => {
    if (payload?.bgStoreName !== bgStoreName) return;

    listener?.(payload as any);
  });
}
