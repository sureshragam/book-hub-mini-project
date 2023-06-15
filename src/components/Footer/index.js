import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <footer>
    <button type="button">
      <FaGoogle className="icon" />
    </button>
    <button type="button">
      <FaTwitter className="icon" />
    </button>
    <button type="button">
      <FaInstagram className="icon" />
    </button>
    <button type="button">
      <FaYoutube className="icon" />
    </button>
    <p>Contact Us</p>
  </footer>
)

export default Footer
