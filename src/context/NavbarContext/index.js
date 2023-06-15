import {createContext} from 'react'

const NavbarContext = createContext({
  activeRoute: '',
  onChangeActiveRoute: () => {},
})

export default NavbarContext
