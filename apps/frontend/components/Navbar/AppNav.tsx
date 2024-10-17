import { Group, Code, ScrollArea, rem } from '@mantine/core';
import {
  IconSalad,
  IconClipboardList,
  IconAdjustments,
  IconShoppingCart,
} from '@tabler/icons-react';
import { UserButton } from '../UserButton/UserButton';
import { LinksGroup } from '../LinksGroup/LinksGroup';
import { Logo } from './Logo';
import classes from './AppNav.module.css';

const appCategories = [
  {
    label: 'Groceries',
    icon: IconShoppingCart,
    initiallyOpened: true,
    links: [
      { label: 'Stores', link: '/grocery/stores' },
      { label: 'Items', link: '/grocery/items' },
      { label: 'Categories', link: '/grocery/category' },
    ],
  },
  {
    label: 'Recipes',
    icon: IconSalad,
    links: [
      { label: 'Nigerian', link: '/recipes/nigerian' },
      { label: 'Indian', link: '/recipes/indian' },
      { label: 'Mexican', link: '/recipes/mexican' },
    ],
  },
  {
    label: 'To-Do',
    icon: IconClipboardList,
    links: [
      { label: 'Nigerian', link: '/recipes/nigerian' },
      { label: 'Indian', link: '/recipes/indian' },
      { label: 'Mexican', link: '/recipes/mexican' },
    ],
  },
  { label: 'Settings', icon: IconAdjustments },
];

export function AppNavbar() {
  const links = appCategories.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between">
          <Logo style={{ width: rem(120) }} />
          <Code fw={700}>v3.1.2</Code>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <UserButton />
      </div>
    </nav>
  );
}
