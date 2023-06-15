import {Component} from 'react'
import {Link} from 'react-router-dom'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {BsFillStarFill, BsSearch} from 'react-icons/bs'

import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

const apiStatusConstrains = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class BookShelf extends Component {
  state = {
    activeTab: bookshelvesList[0].value,
    booksList: [],
    inputValue: '',
    apiStatus: apiStatusConstrains.initial,
  }

  componentDidMount() {
    this.getBooksList()
  }

  onFetchSuccess = data => {
    const modifiedData = data.map(eachBook => ({
      id: eachBook.id,
      authorName: eachBook.author_name,
      coverPic: eachBook.cover_pic,
      rating: eachBook.rating,
      readStatus: eachBook.read_status,
      title: eachBook.title,
    }))
    this.setState({
      booksList: modifiedData,
      apiStatus: apiStatusConstrains.success,
    })
  }

  onFetchFailure = msg => {
    console.log(msg)
    this.setState({apiStatus: apiStatusConstrains.failure})
  }

  getBooksList = async () => {
    this.setState({apiStatus: apiStatusConstrains.initial})
    const {activeTab, inputValue} = this.state
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/book-hub/books?shelf=${activeTab}&search=${inputValue}`

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

  onChangeActiveTab = value => {
    console.log(value)
    this.setState({activeTab: value}, this.getBooksList)
  }

  onChangeInput = event => {
    this.setState({inputValue: event.target.value})
  }

  onSearch = () => {
    this.getBooksList()
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
    const {booksList, inputValue} = this.state
    if (booksList.length < 1) {
      return (
        <div className="search-not-found-container ">
          <img
            src="https://res.cloudinary.com/rs-server/image/upload/v1686798995/BookHub/Group_hdujcs.png"
            alt="no books"
          />
          <p>Your search for {inputValue} did not find any matches.</p>
        </div>
      )
    }
    return (
      <ul className="books-lists">
        {booksList.map(eachBook => {
          const {id, coverPic, title, rating, authorName, readStatus} = eachBook
          return (
            <li key={id} className="book">
              <Link to={`/books/${id}`} className="link">
                <img src={coverPic} alt={title} className="book-image" />
                <div className="book-content">
                  <h1 className="title">{title}</h1>
                  <p className="author-name">{authorName}</p>
                  <div className="rating-container">
                    <p className="avg-rating">Avg Rating</p>
                    <BsFillStarFill className="star-logo" />
                    <p className="avg-rating">{rating}</p>
                  </div>

                  <p className="read-status">
                    Status: <span>{readStatus}</span>
                  </p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    )
  }

  onClickRetry = () => {
    this.getBooksList()
  }

  renderFailureView = () => {
    const failureImage =
      'https://res.cloudinary.com/rs-server/image/upload/v1686304429/BookHub/Group_7522_uwlaey.png'
    return (
      <div className="bookshelf-failure-view-container">
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
    const {activeTab, apiStatus, inputValue} = this.state
    const index = bookshelvesList.findIndex(
      eachObj => eachObj.value === activeTab,
    )
    const labelName = bookshelvesList[index].label

    return (
      <div className="bookshelf-container">
        <Header />
        <div className="bookshelf-content">
          <div className="sidebar">
            <h1 className="heading">Bookshelves</h1>
            <ul className="tabs-list-desktop">
              {bookshelvesList.map(eachOption => {
                const {id, value, label} = eachOption
                const onClickButton = () => {
                  this.onChangeActiveTab(value)
                }
                const className =
                  activeTab === value ? 'active-tab-button' : 'tab-button'
                return (
                  <li key={id} className="tab">
                    <button
                      type="button"
                      onClick={onClickButton}
                      className={className}
                    >
                      {label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="content">
            <div className="search-container">
              <input
                type="search"
                placeholder="Search"
                value={inputValue}
                onChange={this.onChangeInput}
              />
              <button
                className="search-button"
                type="button"
                onClick={this.onSearch}
                testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <h1 className="content-heading">Bookshelves</h1>
            <h1 className="shelf-name">{labelName} Books</h1>

            <ul className="tabs-list-mobile">
              {bookshelvesList.map(eachOption => {
                const {id, value, label} = eachOption

                const onClickButton = () => {
                  this.onChangeActiveTab(value)
                }
                const className =
                  activeTab === value ? 'active-tab-button' : 'tab-button'
                return (
                  <li key={id} className="tab">
                    <button
                      type="button"
                      onClick={onClickButton}
                      className={className}
                    >
                      {label}
                    </button>
                  </li>
                )
              })}
            </ul>
            {this.renderSomething(apiStatus)}
            <Footer />
          </div>
        </div>
      </div>
    )
  }
}

export default BookShelf
