import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import NavbarContext from '../../context/NavbarContext'

import './index.css'

const routeList = [
  {id: 1, displayText: 'Home', routeValue: 'home'},
  {id: 2, displayText: 'Bookshelves', routeValue: 'bookshelves'},
]

class Header extends Component {
  onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  render() {
    return (
      <NavbarContext.Consumer>
        {value => {
          const {activeRoute, onChangeActiveRoute} = value
          return (
            <nav className="navbar">
              <Link to="/" className="link">
                <img
                  src="https://res.cloudinary.com/rs-server/image/upload/v1686230648/BookHub/Group_7731_feemmn.svg"
                  alt="website logo"
                  className="logo"
                />
              </Link>

              <button type="button" className="menu-button">
                <img
                  src="https://res.cloudinary.com/rs-server/image/upload/v1686299157/BookHub/menu_gy7dvt.svg"
                  alt="menu"
                />
              </button>
              <ul className="navbar-options">
                {routeList.map(eachRoute => {
                  const {id, displayText, routeValue} = eachRoute
                  const routePath = routeValue === 'home' ? '/' : '/shelf'
                  const onClickRoute = () => {
                    onChangeActiveRoute(routeValue)

                    const {history} = this.props
                    history.replace(routePath)
                  }
                  const className =
                    activeRoute === routeValue
                      ? 'active-button'
                      : 'inActive-button'

                  return (
                    <li key={id}>
                      <Link
                        to={routePath}
                        className={className}
                        onClick={onClickRoute}
                      >
                        {displayText}
                      </Link>
                    </li>
                  )
                })}
              </ul>
              <button
                className="logout-button"
                type="button"
                onClick={this.onClickLogout}
              >
                Logout
              </button>
            </nav>
          )
        }}
      </NavbarContext.Consumer>
    )
  }
}
export default withRouter(Header)
