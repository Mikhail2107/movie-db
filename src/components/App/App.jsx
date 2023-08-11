import { Component } from 'react'
import { format } from 'date-fns'
import { debounce } from 'lodash'
import { Spin, Alert, Pagination } from 'antd'

import Tabs from '../Tabs'
import SearchField from '../SearchFiled'
import MovieList from '../MovieList'
import movieApi from '../../services/TmdbMovieApi'
import { Provider } from '../../context/contextMovies'
import defaultPoster from '../../assets/images/poster.png'

import './App.css'

class App extends Component {
  tabs = [
    {
      value: 'Search',
      id: 1,
    },
    {
      value: 'Rated',
      id: 2,
    },
  ]

  posterPath = 'https://image.tmdb.org/t/p/w500/'

  errorMessage = {
    loading: 'Карамба!!! Нужно перезагрузить страницу',
    noMovies: 'Бугагашенька!Нет такого фильма',
    noRatedMovies: 'Упс! Рейтинговых фильмов нет',
  }

  debouncedGetMovies = debounce((value, page = 1) => {
    movieApi.searchMovie(value, page, this.onError).then((response) => {
      this.setState((prevState) => ({
        ...prevState,
        currentPage: page,
        totalResults: response.total_results,
        isLoading: true,
        isError: false,
      }))
      const newMovieList = this.onRenderMovieList(response.results)
      this.onUpdateMovieList(newMovieList)
    })
  }, 1000)

  constructor(props) {
    super(props)
    this.state = {
      genres: [],
      inputValue: '',
      isLoading: false,
      isError: false,
      isErrorMovies: false,
      isErrorRated: false,
      isRated: false,
      isSearch: true,
      currentPage: 1,
      currentRatedPage: 1,
      totalResults: '',
      totalRatedResults: '',
      movies: [],
    }
    this.onInputChange = this.onInputChange.bind(this)
    this.onUpdateMovieList = this.onUpdateMovieList.bind(this)
    this.onChangeTabs = this.onChangeTabs.bind(this)
    this.onRenderMovieList = this.onRenderMovieList.bind(this)
    this.onTextClipping = this.onTextClipping.bind(this)
    this.onError = this.onError.bind(this)
    this.onPaginationClick = this.onPaginationClick.bind(this)
    this.onAddRating = this.onAddRating.bind(this)
    this.onChangeMovieList = this.onChangeMovieList.bind(this)
    this.onGetRatedMovieList = this.onGetRatedMovieList.bind(this)
    this.onGetMovieList = this.onGetMovieList.bind(this)
  }

  componentDidMount() {
    movieApi
      .getGenres()
      .then((response) => {
        this.setState({ genres: response.genres })
      })
      .catch((error) => this.onError(error))
    this.setState((prevState) => ({ ...prevState, isLoading: true }))
    this.onGetMovieList()
    if (!localStorage.getItem('guestSessionId')) {
      movieApi
        .createGuestSession()
        .then((response) => {
          localStorage.setItem('guestSessionId', response.guest_session_id)
          localStorage.setItem('ratedMovies', '[]')
        })
        .catch((error) => this.onError(error))
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const value = this.state.inputValue.trim() || 'star'
    if (value && this.state.inputValue !== prevState.inputValue) {
      try {
        this.debouncedGetMovies(value, 1)
      } catch (error) {
        this.onError(error)
      }
    }
    if (this.state.currentPage !== prevState.currentPage) {
      this.onGetMovieList()
    }
    if (this.state.currentRatedPage !== prevState.currentRatedPage) {
      this.onGetRatedMovieList()
    }
  }

  componentDidCatch(error) {
    this.onError(error.message)
  }

  onInputChange(event) {
    this.setState((prevSatate) => {
      return {
        ...prevSatate,
        inputValue: event.target.value,
        isErrorMovies: false,
        isLoading: true,
      }
    })
  }

  onRenderMovieList(movieList) {
    const ratedList =
      JSON.parse(localStorage.getItem('ratedMovies')) !== null ? JSON.parse(localStorage.getItem('ratedMovies')) : []
    const newMovieList = movieList.map((movie) => {
      const url = movie.poster_path === null ? defaultPoster : `${this.posterPath}${movie.poster_path}`
      const dateRelease = movie.release_date ? format(new Date(movie.release_date), 'MMMM dd, yyyy') : 'No release date'
      const [starRating] = ratedList.length ? ratedList.filter((ratedItem) => ratedItem.id === movie.id) : ''
      return {
        imageUrl: url,
        id: movie.id,
        name: this.onTextClipping(movie.title, 19),
        date: dateRelease,
        genre: movie.genre_ids,
        description: this.onTextClipping(movie.overview, 180),
        raiting: (+movie.vote_average).toFixed(1),
        userRating: movie.rating || starRating?.gradeValue || '',
      }
    })
    return newMovieList
  }

  onUpdateMovieList(newMovieList) {
    if (!newMovieList.length) {
      this.setState((prevState) => {
        return {
          ...prevState,
          isErrorMovies: true,
          isLoading: false,
          movies: [],
        }
      })
    } else {
      this.setState((prevState) => {
        return { ...prevState, movies: newMovieList, isLoading: false }
      })
    }
  }

  onTextClipping(text, symbolCount) {
    if (text.length < symbolCount) {
      return text
    } else {
      const newText = text.slice(0, symbolCount)
      return newText.replace(/\s[\w:;,!?.]+$/, '...')
    }
  }

  onError(error) {
    this.setState({ isLoading: false, isError: true })
    return error
  }

  onChangeTabs() {
    this.setState((prevState) => ({
      ...prevState,
      isLoading: true,
      isSearch: !prevState.isSearch,
      isRated: !prevState.isRated,
      isErrorRated: false,
      isError: false,
    }))
  }

  onChangeMovieList() {
    this.onChangeTabs()
    if (!this.state.isRated) {
      this.onGetRatedMovieList()
    } else {
      this.onGetMovieList()
    }
  }

  onPaginationClick(page) {
    if (!this.state.isRated) {
      this.setState((prevState) => ({
        ...prevState,
        currentPage: page,
        isLoading: true,
      }))
    } else {
      this.setState((prevState) => ({
        ...prevState,
        currentRatedPage: page,
        isLoading: true,
      }))
    }
  }

  onAddRating(gradeValue, id) {
    const guestSessionId = localStorage.getItem('guestSessionId')
    const ratedMovies = JSON.parse(localStorage.getItem('ratedMovies'))
    const newRatedList = []
    const newRatedItem = { id, gradeValue }
    const index = ratedMovies.findIndex((ratedItem) => ratedItem.id === id)
    if (index !== -1) {
      newRatedList.push(...ratedMovies.slice(0, index), newRatedItem, ...ratedMovies.slice(index + 1))
    } else {
      ratedMovies.push(newRatedItem)
      newRatedList.push(...ratedMovies)
    }
    localStorage.setItem('ratedMovies', JSON.stringify(newRatedList))
    movieApi.sendRatedMovie(gradeValue, id, guestSessionId)
  }

  onGetRatedMovieList() {
    const guestSessionId = localStorage.getItem('guestSessionId')
    movieApi
      .getRatedMovies(guestSessionId, this.state.currentRatedPage)
      .then((response) => {
        if (!response.results.length) {
          this.setState((prevState) => ({
            ...prevState,
            isErrorRated: true,
          }))
        }
        this.setState((prevState) => ({
          ...prevState,
          movies: this.onRenderMovieList(response.results),
          isLoading: false,
          totalRatedResults: response.total_results,
        }))
      })
      .catch((error) => {
        this.onError(error)
      })
  }

  onGetMovieList() {
    movieApi
      .searchMovie(this.state.inputValue || 'star', this.state.currentPage)
      .then((response) => {
        this.setState((prevState) => ({
          ...prevState,
          movies: this.onRenderMovieList(response.results),
          isLoading: false,
          totalResults: response.total_results,
        }))
      })
      .catch((error) => this.onError(error))
  }

  render() {
    const {
      isLoading,
      isError,
      isErrorMovies,
      isErrorRated,
      movies,
      currentPage,
      currentRatedPage,
      totalResults,
      totalRatedResults,
      isRated,
      isSearch,
    } = this.state
    return (
      <div className="container-margin">
        <div className="container">
          <Tabs tabs={this.tabs} changeMovieList={this.onChangeMovieList} isRated={isRated} isSearch={isSearch} />
          {!isRated ? (
            <SearchField onInputChange={this.onInputChange} onSubmit={() => {}} inputValue={this.state.inputValue} />
          ) : null}
          {isLoading ? <Spin size="large" /> : null}
          {isError && !isLoading ? <Alert description={this.errorMessage.loading} type="error" /> : null}
          {isErrorMovies ? <Alert description={this.errorMessage.noMovies} type="error" /> : null}
          {isErrorRated && !isLoading && !movies.length ? (
            <Alert description={this.errorMessage.noRatedMovies} type="error" />
          ) : null}
          <Provider value={{ genres: this.state.genres }}>
            {movies.length && !isLoading && !isError ? (
              <MovieList movies={movies} isRated={isRated} addRating={this.onAddRating} />
            ) : null}
          </Provider>
          {isErrorRated || isError ? null : movies.length && !isLoading ? (
            <Pagination
              pageSize={20}
              showSizeChanger={false}
              onChange={(page) => this.onPaginationClick(page)}
              current={isRated ? currentRatedPage : currentPage}
              total={isRated ? totalRatedResults : totalResults}
            />
          ) : null}
        </div>
      </div>
    )
  }
}

export default App
