import * as React from 'react';

export const AppStyleContext = React.createContext({
	items: {
		mainPage:{
			containerBox: { display: 'flex', width: '100%' }
		},
		containerBox: { 	flexGrow: 1, display: 'block',
			width: '100%',
			height: '100%',
			bgcolor: '#7F4FD4',
			flexWrap: 'wrap',
		},
		headingBox: {
			flexGrow: 1, display: 'flex',
			width: '100%',
			height: '100%',
			bgcolor: 'pink',
			justifyContent: 'center',
			alignItems: 'center',
			pt: 6, px: 3,
		},
		headingTypography: {
			justifyContent: 'flex-start',
			alignContent: 'flex-start',
			pt:4,
		},
		filterSortBox: {
			justifyContent: 'flex-end',
			flexGrow: 1, display: 'flex',
			pt:4,
		}
	}

});

export const ItemStyleContext = React.createContext({
	mainPage:{
		baseContainerBox: { display: 'flex', width: '100%' },
		mainBox: {
			flexGrow: 1,
			flexWrap: 'wrap',
			width: '100%',
			height: '100%',
			display: 'block',
			bgcolor: '#7F4FD4',
		},
		filterSortBox: {
			justifyContent: 'flex-end',
			flexGrow: 1, display: 'flex',
			pt:4,
		},
		headingBox: {
			flexGrow: 1, display: 'flex',
			width: '100%',
			height: '100%',
			bgcolor: 'pink',
			justifyContent: 'center',
			alignItems: 'center',
			pt: 6, px: 3,
		},
		headingTypography: {
			justifyContent: 'flex-start',
			alignContent: 'flex-start',
			pt:4,
		},

	},
});
