import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginUser } from '../../actions'; 

class Login extends Component {

    state = {
        email:'',
        password:'',
        error:'',
        success:false
    }

    //changes the state on email input field by what is typed in by user
    handleInputEmail = (event) => {
        this.setState({email: event.target.value})
    }

    //changes the state on email input field by what is typed in by user
    handleInputPassword = (event) => {
        this.setState({password: event.target.value})
    }

    // takes you to /user route if login is successful 
    componentWillReceiveProps(nextProps) {
          if(nextProps.user.login.isAuth) {
              this.props.history.push('/user')
          }
    }

   submitForm = (e) => {
       e.preventDefault();
       //console.log(this.state)
       //triggers the action function called loginUser 
       this.props.dispatch(loginUser(this.state))
   }

    render() {
        let user = this.props.user;
        return (
            <div className="rl_container">
            <form onSubmit={this.submitForm}>
                <h2>Log in here</h2>

                <div className="form_element">
                    <input 
                        type="email"
                        placeholder="Enter your mail"
                        value={this.state.email}
                        onChange={this.handleInputEmail}
                    />
                </div>

                <div className="form_element">
                    <input 
                        type="password"
                        placeholder="Enter your password"
                        value={this.state.password}
                        onChange={this.handleInputPassword}
                    />
                </div>

                <button type="submit">Log in</button>
                     <div className="error">
                        {
                            user.login ? 
                                <div>{user.login.message}</div>
                            :null
                        }
                    </div>
            </form>
        </div>
        )
    }
}

// Gets the global state and targets the state of user from reducers index
function mapStateToProps(state) {
    console.log(state)
    return {
        //user: state.USER - is the same name as reducer index to get access to that state 
        user: state.user 
    }
}

// connects the state with the above component 
export default connect(mapStateToProps)(Login);