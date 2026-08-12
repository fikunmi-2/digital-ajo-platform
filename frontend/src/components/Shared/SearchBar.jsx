const SearchBar = ({ placeholder = "Search..." }) => {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-border rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  )
}

export default SearchBar