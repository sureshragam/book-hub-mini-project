import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', showErrorMsg: ''}

  onLoginSuccess = token => {
    Cookies.set('jwt_token', token, {expires: 30})
    this.setState({
      username: '',
      password: '',
      errorMsg: '',
      showErrorMsg: false,
    })
    const {history} = this.props
    history.replace('/')
  }

  onLoginFailure = msg => {
    this.setState({
      username: '',
      password: '',
      errorMsg: msg,
      showErrorMsg: true,
    })
  }

  onLogin = async event => {
    console.log('onLogin')

    event.preventDefault()
    const {username, password} = this.state
    const url = 'https://apis.ccbp.in/login'
    const userDetails = {
      username,
      password,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    console.log(response)

    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      this.onLoginSuccess(data.jwt_token)
    } else {
      const data = await response.json()
      this.onLoginFailure(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {showErrorMsg, errorMsg, username, password} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <div className="image-container">
          <img
            className="desktop-image"
            src="https://res.cloudinary.com/rs-server/image/upload/v1686227225/BookHub/Rectangle_14671x_euh6fv.jpg"
            alt="website login"
          />
          <img
            className="mobile-image"
            src="https://res.cloudinary.com/rs-server/image/upload/v1686235720/BookHub/Ellipse_99_ogtegv.png"
            alt="website login"
          />
        </div>
        <form className="form-container" onSubmit={this.onLogin}>
          <img
            src="https://res.cloudinary.com/rs-server/image/upload/v1686230648/BookHub/Group_7731_feemmn.svg"
            alt="login website logo"
          />
          <label htmlFor="username">Username*</label>
          <input
            type="text"
            placeholder="Username"
            id="username"
            value={username}
            onChange={this.onChangeUsername}
          />
          <label htmlFor="password">Password*</label>
          <input
            type="password"
            placeholder="Password"
            id="password"
            value={password}
            onChange={this.onChangePassword}
          />
          {showErrorMsg && <p className="error-msg">{errorMsg}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    )
  }
}
export default Login
