import PropTypes from 'prop-types'

import './SearchFiled.css'

function SearchFiled(props) {
  const { onInputChange, inputValue } = props
  SearchFiled.defaultProps = {
    inputValue: '',
    onInputChange: () => {},
  }
  SearchFiled.propTypes = {
    inputValue: PropTypes.string,
    onInputChange: PropTypes.func,
  }
  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <label>
        <input
          type="text"
          value={inputValue}
          className="search-field"
          placeholder="Type to search..."
          onChange={onInputChange}
          autoFocus
        />
      </label>
    </form>
  )
}

export default SearchFiled
