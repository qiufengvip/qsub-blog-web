import { inject } from 'vue';
import { useSSRContext } from 'vue';

export const SSR_STATE_KEY = Symbol('SSR_STATE_KEY');

export type SSRStateBag = Record<string, unknown>;

function resolveContextState(): SSRStateBag | undefined {
  if (typeof window !== 'undefined') {
    return undefined;
  }
  const context = useSSRContext();
  if (!context) {
    return undefined;
  }
  if (!context.state) {
    context.state = {} as SSRStateBag;
  }
  return context.state as SSRStateBag;
}

export function useSSRStateBag(): SSRStateBag | undefined {
  const provided = inject<SSRStateBag | undefined>(SSR_STATE_KEY, undefined);
  if (provided) {
    if (typeof window === 'undefined') {
      const contextState = resolveContextState();
      if (contextState && contextState !== provided) {
        Object.assign(contextState, provided);
        return contextState;
      }
    }
    return provided;
  }
  return resolveContextState();
}

export function readSSRState<T>(key: string): T | undefined {
  const bag = useSSRStateBag();
  return bag ? (bag[key] as T | undefined) : undefined;
}

export function writeSSRState<T>(key: string, value: T) {
  const bag = useSSRStateBag();
  if (bag) {
    bag[key] = value as unknown;
    return;
  }
  if (typeof window === 'undefined') {
    const contextState = resolveContextState();
    if (contextState) {
      contextState[key] = value as unknown;
    }
  }
}

export function snapshotState<T>(value: T): T {
  if (value === undefined || value === null) {
    return value;
  }
  try {
    return JSON.parse(JSON.stringify(value)) as T;
  } catch (error) {
    return value;
  }
}
