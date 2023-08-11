import PropTypes from 'prop-types'

import './Tabs.css'

function Tabs(props) {
  const { tabs, changeMovieList, isSearch, isRated } = props
  Tabs.defaultProps = {
    tabs: [],
    changeMovieList: () => {},
    isSearch: true,
    isRated: false,
  }
  Tabs.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.object),
    changeMovieList: PropTypes.func,
    isSearch: PropTypes.bool,
    isRated: PropTypes.bool,
  }
  const tabClass = (value) => {
    if (isSearch && value === 'Search') {
      return 'tabs__item--active'
    }
    if (isRated && value === 'Rated') {
      return 'tabs__item--active'
    }
    return 'tabs__item'
  }

  return (
    <ul className="tabs">
      {tabs.map((item) => {
        return (
          <li key={item.id}>
            <button
              type="button"
              className={tabClass(item.value)}
              onClick={isSearch && item.id === 2 ? changeMovieList : isRated && item.id === 1 ? changeMovieList : null}
            >
              {item.value}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default Tabs
