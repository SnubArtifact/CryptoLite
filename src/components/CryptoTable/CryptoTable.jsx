'use client'
import { useState, useEffect } from 'react'

export default function CryptoTable({ coins = [], darkMode, onRowClick }) {
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap', direction: 'desc' })

  // coin sort
  const sortedCoins = [...coins].sort((a, b) => {
    if (!a[sortConfig.key] || !b[sortConfig.key]) return 0 // Ensure keys exist

    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1
    }
    return 0
  })

  // column sort
  const requestSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  return (
    <div className={`overflow-x-auto ${darkMode ? 'dark' : ''}`}>
      {coins.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No data available
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          
          <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
            <tr>
              {['name', 'current_price', 'price_change_24h', 'market_cap', 'total_volume'].map((key) => (
                <th 
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort(key)}
                >
                  <div className="flex items-center">
                    {key.replace('_', ' ')}
                    {sortConfig.key === key && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          
          <tbody className={darkMode ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'}>
            {sortedCoins.map((coin) => (
              <tr 
                key={coin.id} 
                className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => onRowClick && onRowClick(coin.id)} // Ensure onRowClick is defined
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-8 w-8 mr-3" src={coin.image} alt={coin.name} />
                    <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                      {coin.name} ({coin.symbol?.toUpperCase()})
                    </span>
                  </div>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${coin.current_price?.toLocaleString() || 'N/A'}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${
                  coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {coin.price_change_percentage_24h?.toFixed(2) || 'N/A'}%
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${coin.market_cap?.toLocaleString() || 'N/A'}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${coin.total_volume?.toLocaleString() || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
