import {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import Login from './components/Login'
import BookHub from './components/BookHub'
import BookShelf from './components/BookShelf'
import BooksDetails from './components/BooksDetails'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

import NavbarContext from './context/NavbarContext'

import './App.css'

// use the below bookshelvesList for rendering read status of book items in Bookshelves Route

class App extends Component {
  state = {activeRoute: 'home'}

  onChangeActiveRoute = route => {
    console.log(route, 'onchange')
    this.setState({activeRoute: route})
  }

  render() {
    const {activeRoute} = this.state
    return (
      <div className="app">
        <NavbarContext.Provider
          value={{activeRoute, onChangeActiveRoute: this.onChangeActiveRoute}}
        >
          <Switch>
            <Route exact path="/login" component={Login} />
            <ProtectedRoute exact path="/" component={BookHub} />
            <ProtectedRoute exact path="/shelf" component={BookShelf} />
            <ProtectedRoute exact path="/books/:id" component={BooksDetails} />
            <Route exact path="/not-found" component={NotFound} />
            <Redirect to="/not-found" />
          </Switch>
        </NavbarContext.Provider>
      </div>
    )
  }
}

export default App
