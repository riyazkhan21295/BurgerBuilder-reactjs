import * as React from 'react';

import Layout from './components/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';

const App = props => {
	return (
		<Layout>
			<BurgerBuilder />
		</Layout>
	);
};

export default App;
