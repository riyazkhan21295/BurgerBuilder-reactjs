import * as React from 'react';

const asyncComponent = importComponent => {
    return class extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                component: null,
            };
        }

        render() {
            const C = this.state.component;

            return C ? <C {...this.props} /> : null;
        }

        componentDidMount() {
            importComponent().then(cmp => {
                this.setState({ component: cmp.default });
            });
        }
    };
};

export default asyncComponent;
