import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsFillStarFill} from 'react-icons/bs'

import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstrains = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class BooksDetails extends Component {
  state = {bookDetails: {}, apiStatus: apiStatusConstrains.initial}

  componentDidMount() {
    this.getBookDetails()
  }

  onFetchSuccess = data => {
    const modifiedData = {
      aboutAuthor: data.about_author,
      aboutBook: data.about_book,
      authorName: data.author_name,
      coverPic: data.cover_pic,
      id: data.id,
      rating: data.rating,
      readStatus: data.read_status,
      title: data.title,
    }
    this.setState({
      bookDetails: modifiedData,
      apiStatus: apiStatusConstrains.success,
    })
  }

  onFetchFailure = msg => {
    console.log(msg)
    this.setState({apiStatus: apiStatusConstrains.failure})
  }

  getBookDetails = async () => {
    this.setState({apiStatus: apiStatusConstrains.initial})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/book-hub/books/${id}`
    const token = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `bearer ${token}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      this.onFetchSuccess(data.book_details)
    } else {
      const data = await response.json()
      this.onFetchFailure(data.error_msg)
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader
        type="TailSpin"
        color="#0284C7"
        height={50}
        width={50}
        className="loader"
      />
    </div>
  )

  renderSuccessView = () => {
    const {bookDetails} = this.state
    const {
      coverPic,
      title,
      authorName,
      rating,
      readStatus,
      aboutAuthor,
      aboutBook,
    } = bookDetails
    return (
      <div className="success-view-container">
        <div>
          <img src={coverPic} alt={title} />
          <div>
            <h1 className="title">{title}</h1>
            <p className="author-name">{authorName}</p>
            <div className="rating-container">
              <p className="avg-rating">Avg Rating </p>
              <BsFillStarFill className="star-logo" />
              <p className="avg-rating">{rating}</p>
            </div>
            <p>
              Status: <span>{readStatus}</span>
            </p>
          </div>
        </div>
        <hr />
        <h1>About Author</h1>
        <p>{aboutAuthor}</p>
        <h1>About Book</h1>
        <p>{aboutBook}</p>
      </div>
    )
  }

  onClickRetry = () => {
    this.getBookDetails()
  }

  renderFailureView = () => {
    const failureImage =
      'https://res.cloudinary.com/rs-server/image/upload/v1686304429/BookHub/Group_7522_uwlaey.png'
    return (
      <div className="failure-view-container">
        <img
          src={failureImage}
          alt="failure view"
          className="failure-view-image"
        />
        <p>Something went wrong, Please try again.</p>
        <button type="button" onClick={this.onClickRetry}>
          Try Again
        </button>
      </div>
    )
  }

  renderSomething = apiStatus => {
    switch (apiStatus) {
      case apiStatusConstrains.initial:
        return this.renderLoadingView()
      case apiStatusConstrains.success:
        return this.renderSuccessView()
      case apiStatusConstrains.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    const {apiStatus} = this.state
    return (
      <div className="books-details-container">
        <Header />
        <div className="books-details-content-container">
          {this.renderSomething(apiStatus)}
        </div>
        <Footer />
      </div>
    )
  }
}

export default BooksDetails
