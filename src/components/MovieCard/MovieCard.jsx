import { Rate } from 'antd'
import PropTypes from 'prop-types'

import { Consumer } from '../../context/contextMovies'
import './MovieCard.css'

function MovieGenres(props) {
  const { movie, genres } = props
  MovieGenres.defaultProps = {
    movie: {},
    genres: [],
  }
  MovieGenres.propTypes = {
    movie: PropTypes.object,
    genres: PropTypes.array,
  }
  return genres.map((genreItem) => {
    return movie.genre.includes(genreItem.id) ? (
      <button key={genreItem.id} type="button">
        {genreItem.name}
      </button>
    ) : null
  })
}

function MovieCard(props) {
  const { movie, addRating } = props
  MovieCard.defaultProps = {
    movie: {},
    addRating: () => {},
  }
  MovieCard.propTypes = {
    movie: PropTypes.object,
    addRating: PropTypes.func,
  }
  // const imageWidth = 183
  // const imageHeight = 281
  const raitingColor = (raiting) => {
    let color
    if (raiting > 7) {
      color = 'movie-card__raiting color-great'
    } else if (raiting > 5 && raiting < 8) {
      color = 'movie-card__raiting color-good'
    } else if (raiting > 3 && raiting < 6) {
      color = 'movie-card__raiting color-middling'
    } else if (raiting < 4) {
      color = 'movie-card__raiting color-bad'
    }
    return color
  }

  return (
    <Consumer>
      {({ genres }) => (
        <div className="movie-card">
          <img className="movie-card__img" src={movie.imageUrl} alt="Poster" />
          <p className="movie-card__name">{movie.name}</p>
          <p className="movie-card__date">{movie.date}</p>
          <p className="movie-card__genre">
            <MovieGenres genres={genres} movie={movie} />
          </p>
          <p className="movie-card__description">{movie.description}</p>
          <div className="movie-card__star-raiting">
            <Rate
              className="movie-card__stars"
              allowHalf={true}
              count={10}
              onChange={(value) => addRating(value, movie.id)}
              defaultValue={movie.userRating}
            />
          </div>
          <p className={raitingColor(movie.raiting)}>{movie.raiting}</p>
        </div>
      )}
    </Consumer>
  )
}

export default MovieCard
