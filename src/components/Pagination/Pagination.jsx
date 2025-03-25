
'use client'

export default function Pagination({
  coinsPerPage,
  totalCoins,
  currentPage,
  paginate,
  darkMode,
}) {
  const pageNumbers = []
  const totalPages = Math.ceil(totalCoins / coinsPerPage)

  // show limited pages
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages]
    }
    
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }
    
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between mt-6 px-4 py-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg`}>
      <div className="mb-4 sm:mb-0">
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Showing <span className="font-medium">{(currentPage - 1) * coinsPerPage + 1}</span> to{' '}
          <span className="font-medium">{Math.min(currentPage * coinsPerPage, totalCoins)}</span> of{' '}
          <span className="font-medium">{totalCoins}</span> coins
        </p>
      </div>
      
      <div className="flex items-center space-x-1">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            currentPage === 1
              ? `${darkMode ? 'text-gray-500 bg-gray-700' : 'text-gray-400 bg-gray-200'} cursor-not-allowed`
              : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`
          }`}
        >
          Previous
        </button>

        {getPageNumbers().map((number, index) => (
          number === '...' ? (
            <span key={`ellipsis-${index}`} className={`px-3 py-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              ...
            </span>
          ) : (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                currentPage === number
                  ? `${darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'}`
                  : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`
              }`}
            >
              {number}
            </button>
          )
        ))}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            currentPage === totalPages
              ? `${darkMode ? 'text-gray-500 bg-gray-700' : 'text-gray-400 bg-gray-200'} cursor-not-allowed`
              : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`
          }`}
        >
          Next
        </button>
      </div>
    </div>
  )
}