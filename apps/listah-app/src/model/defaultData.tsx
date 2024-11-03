import SettingsIcon from '@mui/icons-material/Settings';
import Person3Icon from '@mui/icons-material/Person3';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import TaskIcon from '@mui/icons-material/Task';
import NewspaperIcon from '@mui/icons-material/Newspaper';



// Images for services cards.
import groceries from '../../public/assets/groceries.jpeg';
import toDo from '../../public/assets/todo.jpeg';


export const ServicesNav = [
	{
		title: 'Items',
		icon: <LocalGroceryStoreIcon/>,
		link: '/grocery',
		subitems: [
			{title: 'Category', link: '/grocery/category'},
			{title: 'Store', link: '/grocery/store'},
			{title: 'Item', link: '/grocery/item'},
		]
	},
	{
		title: 'Grocery',
		icon: <LocalGroceryStoreIcon/>,
		link: '/grocery',
		subitems: [
			{title: 'Category', link: '/grocery/category'},
			{title: 'Store', link: '/grocery/store'},
			{title: 'Item', link: '/grocery/item'},
		]
	},
	{
		title: 'Task',
		icon: <TaskIcon/>,
		link: '/task',
		subitems: [
			{title: 'Work', link: '/grocery/work'},
			{title: 'Home', link: '/grocery/home'},
			{title: 'Passion', link: '/grocery/passion'},
		]
	},
	{
		title: 'Article',
		icon: <NewspaperIcon/>,
		link: '/article'
	}
]

export const ServiceCard = [
	{
		title: 'Items',
		actions: ["Create New", "View All"],
		content: "",
		mainAction: "/items"
	},
	{
		title: 'Tags',
		actions: ["Create New", "View All"],
		mainAction: "/tags"
	},
	{
		title: 'Curated Tags',
		actions: ["Create New", "View All"],
		mainAction: "/curated-tags"
	}
]


export const ServiceMediaCard = [
	{
		title: 'Grocery',
		url: groceries.src,
		actions: ["Learn More", "See More"],
		height: "240",
		altText: "Image of groceries",
		mainAction: "/grocery"
	},
	{
		title: 'Task',
		url: toDo.src,
		actions: ["Learn More", "See More"],
		height: "240",
		altText: "Image of a task list",
		mainAction: "/task"
	}
]


export const SubDividerMenuItems = [
	{
		title: 'Profile',
		icon: <Person3Icon/>,
		link: '/profile'
	},
	{
		title: 'Settings',
		icon: <SettingsIcon/>,
		link: '/settings'
	}
]

export const DrawerWidth = 240;
