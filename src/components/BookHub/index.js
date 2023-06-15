import {Component} from 'react'
import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'
import Slider from 'react-slick'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const apiStatusConstrains = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class BookHub extends Component {
  state = {topRatedBooksList: [], apiStatus: apiStatusConstrains.initial}

  componentDidMount() {
    this.getTopRatedBooksList()
  }

  onFetchSuccess = data => {
    const modifiedData = data.map(eachObj => ({
      id: eachObj.id,
      title: eachObj.title,
      coverPic: eachObj.cover_pic,
      authorName: eachObj.author_name,
    }))
    this.setState({
      topRatedBooksList: modifiedData,
      apiStatus: apiStatusConstrains.success,
    })
  }

  onFetchFailure = msg => {
    console.log(msg)
    this.setState({
      apiStatus: apiStatusConstrains.failure,
    })
  }

  getTopRatedBooksList = async () => {
    this.setState({
      apiStatus: apiStatusConstrains.initial,
    })
    const url = 'https://apis.ccbp.in/book-hub/top-rated-books'
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
      this.onFetchSuccess(data.books)
    } else {
      const data = await response.json()
      this.onFetchFailure(data.error_msg)
    }
  }

  onClickRetry = () => {
    this.getTopRatedBooksList()
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
    const {topRatedBooksList} = this.state
    const options = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
      ],
    }
    return (
      <Slider {...options}>
        {topRatedBooksList.map(eachBook => {
          const {id, title, coverPic, authorName} = eachBook
          return (
            <div className="slick-item" key={id}>
              <Link to={`/books/${id}`} className="link">
                <img src={coverPic} alt={title} className="cover-pic" />
                <h1>{title}</h1>
                <p>{authorName}</p>
              </Link>
            </div>
          )
        })}
      </Slider>
    )
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
    const {topRatedBooksList, apiStatus} = this.state
    console.log(topRatedBooksList)

    return (
      <div className="bookHub-container">
        <Header />
        <div className="bookHub-content-container">
          <h1 className="heading">Find Your Next Favorite Books?</h1>
          <p className="para">
            You are in the right place. Tell us what titles or genres you have
            enjoyed in the past, and we will give you surprisingly insightful
            recommendations.
          </p>
          <Link to="/shelf" className="link">
            <button type="button" className="mobile-button">
              Find Books
            </button>
          </Link>

          <div className="card-carousel">
            <h1 className="heading">Top Rated Books</h1>
            <Link to="/shelf" className="link">
              <button type="button" className="desktop-button">
                Find Books
              </button>
            </Link>

            <div className="slick-container">
              {this.renderSomething(apiStatus)}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default BookHub
