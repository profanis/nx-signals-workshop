import { inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  BehaviorSubject,
  filter,
  distinctUntilChanged,
  debounceTime,
  map,
} from 'rxjs';

type ParamKind = 'string' | 'number' | 'boolean' | 'object' | 'array';

const paramParser: Record<
  ParamKind,
  {
    fromQueryParamsToType: (v: unknown) => unknown;
    toQueryParamsFromType: (v: unknown) => string;
  }
> = {
  string: {
    fromQueryParamsToType: (v: unknown): string | null =>
      v !== null ? String(v) : null,
    toQueryParamsFromType: (v: unknown): string => String(v ?? ''),
  },
  number: {
    fromQueryParamsToType: (v: unknown): number => {
      const n = Number(v);
      return Number.isNaN(n) ? 0 : n;
    },
    toQueryParamsFromType: (v: unknown): string => String(v),
  },
  boolean: {
    fromQueryParamsToType: (v: unknown): boolean => v === 'true' || v === true,
    toQueryParamsFromType: (v: unknown): string => String(v),
  },
  object: {
    fromQueryParamsToType: <T>(v: unknown): T | null => {
      try {
        return JSON.parse(String(v)) as T;
      } catch {
        return null;
      }
    },
    toQueryParamsFromType: <T>(v: T): string => JSON.stringify(v),
  },
  array: {
    fromQueryParamsToType: (v: unknown): string[] => {
      if (v !== null && v !== undefined) {
        return v
          .toString()
          .split(',')
          .filter((s) => s.length > 0);
      }
      return [];
    },
    toQueryParamsFromType: (v: unknown): string => {
      if (Array.isArray(v)) {
        return v.join(',');
      }

      return '';
    },
  },
} as const;

export type ParserMap<T extends object> = {
  [K in keyof T]: ParamKind;
};

function fromQueryParamsToType<T extends object>(
  params: Params,
  parsers: ParserMap<T>,
): T {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      // This is verbose but easy to read and understand.
      const kind = parsers[key as keyof T];
      switch (kind) {
        case 'string':
          return [key, paramParser.string.fromQueryParamsToType(value)];
        case 'number':
          return [key, paramParser.number.fromQueryParamsToType(value)];
        case 'boolean':
          return [key, paramParser.boolean.fromQueryParamsToType(value)];
        case 'object':
          return [key, paramParser.object.fromQueryParamsToType(value)];
        case 'array':
          return [key, paramParser.array.fromQueryParamsToType(value)];
      }
    }),
  ) as T;
}

function toQueryParamsFromType<T extends object>(
  objectType: T,
  parsers: ParserMap<T>,
): Params {
  return Object.fromEntries(
    Object.entries(objectType).map(([key, value]) => {
      const kind = parsers[key as keyof T];

      // This is verbose but easy to read and understand.
      switch (kind) {
        case 'string':
          return [key, paramParser.string.toQueryParamsFromType(value)];
        case 'number':
          return [key, paramParser.number.toQueryParamsFromType(value)];
        case 'boolean':
          return [key, paramParser.boolean.toQueryParamsFromType(value)];
        case 'object':
          return [key, paramParser.object.toQueryParamsFromType(value)];
        case 'array':
          return [key, paramParser.array.toQueryParamsFromType(value)];
      }
    }),
  ) as Params;
}

export function injectQueryParamsAdapter<T extends object>(
  parsers: ParserMap<Partial<T>>,
) {
  const activatedRoute = inject(ActivatedRoute);
  const router = inject(Router);

  const pendingParams$ = new BehaviorSubject<Params | null>(null);

  pendingParams$
    .pipe(
      filter((params): params is Params => params !== null),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      debounceTime(0),
      takeUntilDestroyed(),
    )
    .subscribe((params) => {
      router.navigate([], {
        queryParams: params,
        queryParamsHandling: 'merge',
      });
      // Reset so the next `set()` call starts clean
      pendingParams$.next(null);
    });

  const set = (objectType: Partial<T>) => {
    const newParams = toQueryParamsFromType(objectType, parsers);

    // Default falsy values to `null` so Angular's merge removes them from the URL.
    const sanitizedParams = Object.fromEntries(
      Object.entries(newParams).map(([key, value]) => [key, value || null]),
    ) as Params;

    // Merge into any already-pending params from earlier synchronous set() calls.
    const current = pendingParams$.getValue() ?? {};
    pendingParams$.next({ ...current, ...sanitizedParams });
  };

  // Collect query params into a typed signal using the provided parsers
  const value = toSignal(
    activatedRoute.queryParams.pipe(
      map((raw) => fromQueryParamsToType<Partial<T>>(raw, parsers)),
    ),
    { requireSync: true },
  );

  return { value, set };
}
