import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useDarkMode } from '../DarkMode/DarkMode'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const navigation = [
  { name: 'Home', href: '/home' },
  { name: 'Market', href: '/home' },
  
  { name: 'Portfolio', href: '/portfolio' },
]

export default function CoinDetail() {
  const { id } = useParams()
  const [coin, setCoin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { darkMode, toggleDarkMode } = useDarkMode()
  const [priceData, setPriceData] = useState(null)
  const [timeRange, setTimeRange] = useState('7')
  const [showAddModal, setShowAddModal] = useState(false)
  const [quantity, setQuantity] = useState('1')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const [coinResponse, chartResponse] = await Promise.all([
          fetch(`https://api.coingecko.com/api/v3/coins/${id}`),
          fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${timeRange}`)
        ])
        const coinData = await coinResponse.json()
        const chartData = await chartResponse.json()
        setCoin(coinData)
        setPriceData(chartData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCoin()
  }, [id, timeRange])

  
 

  const handleAddToPortfolio = () => {
    if (quantity <= 0 || isNaN(quantity)) {
      alert('Please enter a valid quantity')
      return
    }
    navigate(`/portfolio?add=${coin.id}&quantity=${quantity}`)
    setShowAddModal(false)
    setQuantity('1')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
      </div>
    )
  }

  // chart data
  const chartLabels = priceData?.prices.map(price => {
    const date = new Date(price[0])
    return timeRange === '1' ? date.toLocaleTimeString() : date.toLocaleDateString()
  })
  
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Price (USD)',
        data: priceData?.prices.map(price => price[1]),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.1,
        fill: true
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: darkMode ? '#e5e7eb' : '#374151'
        }
      },
      y: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: darkMode ? '#e5e7eb' : '#374151'
        }
      }
    }
  }

  return (
    <div className={`${darkMode ? 'dark bg-gray-900' : 'bg-white'} min-h-screen`}>
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <button onClick={() => navigate('/')} className="-m-1.5 p-1.5">
              <span className="sr-only">CryptoLite</span>
              <img
                className="h-12 w-auto"
                src="https://www.freepnglogos.com/uploads/bitcoin-png/where-can-find-this-bitcoin-logo-transparent-png-2.png"
                alt="CryptoLite"
              />
            </button>
          </div>

          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className="text-sm font-semibold text-gray-900 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className=" ml-10 flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="pl-1 text-sm font-semibold text-gray-900 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </button>
            <button 
        onClick={toggleDarkMode}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {darkMode ? (
          <SunIcon className="h-5 w-5 text-yellow-400" />
        ) : (
          <MoonIcon className="h-5 w-5 text-gray-700" />
        )}
      </button>
          </div>
        </nav>

       
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full bg-white dark:bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:sm:ring-gray-700/10">
            <div className="flex items-center justify-between">
              <button onClick={() => navigate('/')} className="-m-1.5 p-1.5">
                <span className="sr-only">CryptoLite</span>
                <img
                  className="h-11 w-auto"
                  src="https://www.freepnglogos.com/uploads/bitcoin-png/where-can-find-this-bitcoin-logo-transparent-png-2.png"
                  alt="CryptoLite"
                />
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className="block w-full px-3 py-2 text-left text-base font-semibold text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-base font-semibold text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  {darkMode ? (
                    <>
                      <SunIcon className="h-5 w-5 text-yellow-400" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <MoonIcon className="h-5 w-5 text-gray-700" />
                      Dark Mode
                    </>
                  )}
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full rounded-md bg-indigo-600 px-3 py-2 text-white font-semibold hover:bg-indigo-500"
                >
                  Log in
                </button>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 dark:opacity-20 sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%)',
            }}
          />
        </div>

        
        <div className="mx-auto max-w-4xl mt-16 space-y-8">
         
          <div className={`rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border p-8`}>
            <div className="flex items-center gap-4">
              <img src={coin.image.large} alt={coin.name} className="h-16 w-16 rounded-full" />
              <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {coin.name} ({coin.symbol.toUpperCase()})
                </h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Rank #{coin.market_cap_rank}</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Add to Portfolio
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Current Price</p>
                <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${coin.market_data.current_price.usd.toLocaleString()}
                </p>
              </div>
              <div>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Market Cap</p>
                <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${coin.market_data.market_cap.usd.toLocaleString()}
                </p>
              </div>
              <div>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>24h Change</p>
                <p
                  className={`text-lg font-semibold ${
                    coin.market_data.price_change_percentage_24h > 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>24h Volume</p>
                <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${coin.market_data.total_volume.usd.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          
          <div className={`rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border p-8`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Price Chart ({coin.symbol.toUpperCase()}/USD)
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTimeRange('1')}
                  className={`px-3 py-1 rounded-md text-sm ${timeRange === '1' ? 'bg-indigo-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                >
                  24h
                </button>
                <button
                  onClick={() => setTimeRange('7')}
                  className={`px-3 py-1 rounded-md text-sm ${timeRange === '7' ? 'bg-indigo-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                >
                  7d
                </button>
                <button
                  onClick={() => setTimeRange('30')}
                  className={`px-3 py-1 rounded-md text-sm ${timeRange === '30' ? 'bg-indigo-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                >
                  30d
                </button>
                <button
                  onClick={() => setTimeRange('365')}
                  className={`px-3 py-1 rounded-md text-sm ${timeRange === '365' ? 'bg-indigo-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                >
                  365d
                </button>
              </div>
            </div>
            <div className="h-80">
              {priceData && <Line data={chartData} options={chartOptions} />}
            </div>
          </div>

          {/* about coin */}
          <div className={`rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border p-8`}>
            <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              About {coin.name}
            </h2>
            
            <div className="prose dark:prose-invert max-w-none">
              <div 
                className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                dangerouslySetInnerHTML={{ __html: coin.description.en }}
              />
              
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Key Details
                  </h3>
                  <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>
                      <span className="font-medium">Genesis Date:</span> {coin.genesis_date || 'N/A'}
                    </li>
                    <li>
                      <span className="font-medium">Market Cap Rank:</span> #{coin.market_cap_rank}
                    </li>
                    <li>
                      <span className="font-medium">Current Price:</span> ${coin.market_data.current_price.usd.toLocaleString()}
                    </li>
                    <li>
                      <span className="font-medium">All-Time High:</span> ${coin.market_data.ath.usd.toLocaleString()} 
                      {coin.market_data.ath_date.usd && (
                        <span> ({new Date(coin.market_data.ath_date.usd).toLocaleDateString()})</span>
                      )}
                    </li>
                    <li>
                      <span className="font-medium">All-Time Low:</span> ${coin.market_data.atl.usd.toLocaleString()}
                      {coin.market_data.atl_date.usd && (
                        <span> ({new Date(coin.market_data.atl_date.usd).toLocaleDateString()})</span>
                      )}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Blockchain Info
                  </h3>
                  <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>
                      <span className="font-medium">Hashing Algorithm:</span> {coin.hashing_algorithm || 'N/A'}
                    </li>
                    <li>
                      <span className="font-medium">Block Time:</span> {coin.block_time_in_minutes ? `${coin.block_time_in_minutes} mins` : 'N/A'}
                    </li>
                    <li>
                      <span className="font-medium">Total Supply:</span> {coin.market_data.total_supply?.toLocaleString() || 'N/A'}
                    </li>
                    <li>
                      <span className="font-medium">Max Supply:</span> {coin.market_data.max_supply?.toLocaleString() || 'N/A'}
                    </li>
                    <li>
                      <span className="font-medium">Circulating Supply:</span> {coin.market_data.circulating_supply.toLocaleString()}
                    </li>
                  </ul>
                </div>
              </div>

              {coin.links.homepage[0] && (
                <div className="mt-6">
                  <a 
                    href={coin.links.homepage[0]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Official Website →
                  </a>
                </div>
              )}
            </div>
          </div>

          
          <div className={`rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border p-8`}>
            <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Resources & Links
            </h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Community
                </h3>
                <div className="flex flex-wrap gap-3">
                  {coin.links.subreddit_url && (
                    <a
                      href={coin.links.subreddit_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm hover:bg-orange-200 dark:hover:bg-orange-800"
                    >
                      Reddit
                    </a>
                  )}
                  {coin.links.twitter_screen_name && (
                    <a
                      href={`https://twitter.com/${coin.links.twitter_screen_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800"
                    >
                      Twitter
                    </a>
                  )}
                  {coin.links.facebook_username && (
                    <a
                      href={`https://facebook.com/${coin.links.facebook_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800"
                    >
                      Facebook
                    </a>
                  )}
                </div>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Technical
                </h3>
                <div className="flex flex-wrap gap-3">
                  {coin.links.repos_url.github[0] && (
                    <a
                      href={coin.links.repos_url.github[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      GitHub
                    </a>
                  )}
                  {coin.links.blockchain_site.filter(site => site).length > 0 && (
                    <a
                      href={coin.links.blockchain_site[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm hover:bg-purple-200 dark:hover:bg-purple-800"
                    >
                      Blockchain Explorer
                    </a>
                  )}
                  {coin.links.official_forum_url[0] && (
                    <a
                      href={coin.links.official_forum_url[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm hover:bg-green-200 dark:hover:bg-green-800"
                    >
                      Official Forum
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* add to portfolio */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className={`w-full max-w-md rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Add {coin.name} to Portfolio
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={`w-full rounded-md border shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                  }`}
                  min="0"
                  step="0.00000001"
                />
              </div>
              
              <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Current Price: ${coin.market_data.current_price.usd.toLocaleString()}
                </p>
                <p className={`text-lg font-semibold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Total Value: ${(quantity * coin.market_data.current_price.usd).toLocaleString()}
                </p>
              </div>
              
              <button
                onClick={handleAddToPortfolio}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Add to Portfolio
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}