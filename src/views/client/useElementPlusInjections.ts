import { inject, provide } from 'vue';
import { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus';

type IdContext = {
  prefix: number;
  current: number;
};

type ZIndexContext = {
  current: number;
};

const createIdContext = (): IdContext => ({
  prefix: 1024,
  current: 0,
});

const createZIndexContext = (): ZIndexContext => ({
  current: 0,
});

export const useElementPlusInjections = () => {
  const idInjection = inject<IdContext | null>(ID_INJECTION_KEY, null);
  if (!idInjection) {
    provide(ID_INJECTION_KEY, createIdContext());
  }

  const zIndexInjection = inject<ZIndexContext | null>(ZINDEX_INJECTION_KEY, null);
  if (!zIndexInjection) {
    provide(ZINDEX_INJECTION_KEY, createZIndexContext());
  }
};

export default useElementPlusInjections;
