import React, { Component } from 'react';
import { Link } from 'react-router';
import Nav from '../Nav.react';
import { connect } from 'react-redux';

class HomePage extends Component {
	render() {
    const dispatch = this.props.dispatch;
    const { loggedIn } = this.props.data;

    return (
			<article>
				<div>
					<section className="text-section">
						{loggedIn ? (
							<h1>Welcome to POC</h1>
						) : (
							<h1>Welcome to POC</h1>
						)}
						
						{loggedIn ? (
							<Link to="/dashboard" className="btn btn--dash">Dashboard</Link>
						) : (
							<div>
								<Link to="/login" className="btn btn--login">Login</Link>
								<Link to="/register" className="btn btn--register">Register</Link>
							</div>
						)}
					</section>
					
				</div>
			</article>
		);
  }
}

// Which props do we want to inject, given the global state?
function select(state) {
  return {
    data: state
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(HomePage);
