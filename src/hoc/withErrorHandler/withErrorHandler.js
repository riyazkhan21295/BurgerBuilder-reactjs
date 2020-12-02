import * as React from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary';

const withErrorHandler = (WrappedComponent, axiosInstance) => {
	return class extends React.Component {
		constructor(props) {
			super(props);

			this.state = {
				error: null,
			};
		}

		render() {
			return (
				<Aux>
					<Modal show={this.state.error} modalClosed={this.errorConfirmedHandler}>
						{this.state.error ? this.state.error.message : null}
					</Modal>
					<WrappedComponent {...this.props} />
				</Aux>
			);
		}

		componentWillMount() {
			this.requestInterceptors = axiosInstance.interceptors.request.use(request => {
				this.setState({
					error: null,
				});

				return request;
			});
			this.responseInterceptors = axiosInstance.interceptors.response.use(
				response => response,
				error => {
					this.setState({
						error: error,
					});
				}
			);
		}

		componentWillUnmount() {
			axiosInstance.interceptors.request.eject(this.requestInterceptors);
			axiosInstance.interceptors.response.eject(this.responseInterceptors);
		}

		errorConfirmedHandler = () => {
			this.setState({
				error: null,
			});
		};
	};
};

export default withErrorHandler;
