import PropTypes from 'prop-types'

import MovieCard from '../MovieCard'
import './MovieList.css'

function MovieList(props) {
  MovieList.defaultProps = {
    movies: [],
  }
  MovieList.propTypes = {
    movies: PropTypes.arrayOf(PropTypes.object),
  }
  const { movies, addRating } = props
  return (
    <ul className="movie-list">
      {movies.map((movie) => {
        return (
          <li key={movie.id}>
            <MovieCard movie={movie} addRating={addRating} />
          </li>
        )
      })}
    </ul>
  )
}

export default MovieList
