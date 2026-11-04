'use client';

import React from 'react';
import NextLink from 'next/link';
import {
  useRouter as useNextRouter,
  usePathname as useNextPathname,
  useParams as useNextParams,
} from 'next/navigation';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  href?: any;
  children?: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  replace?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, href, children, ...props }, ref) => {
    const destination = to || href || '#';
    return (
      <NextLink ref={ref} href={destination} {...props}>
        {children}
      </NextLink>
    );
  }
);

Link.displayName = 'Link';

export function useNavigate() {
  const router = useNextRouter();
  return (to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === 'number') {
      if (to === -1) router.back();
      else if (to === 1) router.forward();
      return;
    }
    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
}

export function useLocation() {
  const pathname = useNextPathname() || '/';
  const [search, setSearch] = React.useState('');
  const [hash, setHash] = React.useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearch(window.location.search || '');
      setHash(window.location.hash || '');
    }
  }, [pathname]);

  return {
    pathname,
    search,
    hash,
    state: null,
    key: 'default',
  };
}

export function useParams<T extends Record<string, string | string[] | undefined> = Record<string, string>>(): T {
  const params = useNextParams();
  return (params || {}) as T;
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const router = useNextRouter();
  React.useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [to, replace, router]);
  return null;
}
