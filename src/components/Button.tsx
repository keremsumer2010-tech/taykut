import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import s from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost';

interface Common {
  variant?: Variant;
  size?: 'default' | 'small';
  icon?: IconName;
  children: ReactNode;
}

type AsLink = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type AsButton = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

/** Birincil (turuncu), ikincil (çerçeveli) veya hayalet düğme. `href` verilirse bağlantı olur. */
export function Button(props: AsLink | AsButton) {
  const { variant = 'primary', size = 'default', icon, children, className, ...rest } = props;
  const cls = [s.button, s[variant], size === 'small' ? s.small : '', className ?? ''].join(' ').trim();
  const content = (
    <>
      <span>{children}</span>
      {icon && <Icon name={icon} size={18} />}
    </>
  );
  if ('href' in rest && rest.href !== undefined) {
    return (
      <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
