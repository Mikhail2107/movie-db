const API_KEY = 'f6b7f35f91abdc4f39911f39ae532b34'
const BASE_URL = 'https://api.themoviedb.org/3'
const SESSION_RESOURSE = '/authentication/guest_session/new'

const movieApi = {
  getResource(url, fn = () => {}, options = null) {
    return fetch(url, options)
      .then((res) => (res.ok ? res : Promise.reject(res)))
      .then((result) => result.json())
      .then((response) => response)
      .catch((error) => {
        fn()
        throw new Error(error.message)
      })
  },

  searchMovie(queryValue, currentPage = 1, fn = () => {}) {
    const url = `${BASE_URL}/search/movie?query=${queryValue}&api_key=${API_KEY}&page=${currentPage}`
    return this.getResource(url, fn)
  },

  getGenres() {
    const url = `${BASE_URL}/genre/movie/list?language=en-EN&api_key=${API_KEY}`
    return this.getResource(url)
  },

  createGuestSession() {
    const url = `${BASE_URL}${SESSION_RESOURSE}?api_key=${API_KEY}`
    return this.getResource(url)
  },

  sendRatedMovie(rating, movieId, guestSessionId, fn = () => {}) {
    const url = `${BASE_URL}/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${guestSessionId}`
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value: rating }),
    }
    return this.getResource(url, fn, options)
  },

  getRatedMovies(guestSessionId, currentPage = 1) {
    const url = `${BASE_URL}/guest_session/${guestSessionId}/rated/movies?api_key=${API_KEY}&page=${currentPage}`
    return this.getResource(url)
  },
}

export default movieApi
