import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://res.cloudinary.com/rs-server/image/upload/v1686827710/BookHub/Group_7484_nca5st.png"
      alt="not found"
    />
    <h1>Page Not Found</h1>
    <p>we are sorry, the page you requested could not be found</p>
    <Link to="/" className="link">
      <button type="button">Go Back to Home</button>
    </Link>
  </div>
)

export default NotFound
