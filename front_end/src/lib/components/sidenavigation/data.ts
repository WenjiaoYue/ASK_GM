import HomeIcon from './icons/HomeIcon.svelte';
import ServersIcon from './icons/ServersIcon.svelte';
import DocumentationIcon from './icons/DocumentationIcon.svelte';

interface MenuItem {
  title: string;
  icon: typeof import('*.svelte').default;
  link: string;
  admin: boolean;
}

const data: MenuItem[] = [
  {
    title: 'ASK GM',
    icon: HomeIcon,
    link: '/',
    admin: false
  },
  {
    title: 'Documentation',
    icon: DocumentationIcon,
    link: '/document',
    admin: false
  },
  {
    title: 'Knowledge Base',
    icon: ServersIcon,
    link: '/knowledge',
    admin: true
  }
];

export default data;
