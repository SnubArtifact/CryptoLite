import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Bars3Icon } from '@heroicons/react/24/outline'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'
import { useDarkMode } from '../DarkMode/DarkMode'



export default function Portfolio({  }) {
    const { darkMode, toggleDarkMode } = useDarkMode()
  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem('cryptoPortfolio');
    return saved ? JSON.parse(saved) : [];
  });
  const location = useLocation();
  const navigate = useNavigate();

  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const coinId = params.get('add');
    const quantity = parseFloat(params.get('quantity'));
    
    if (coinId && quantity) {
      handleAddCoin(coinId, quantity);
      
      navigate('/portfolio', { replace: true });
    }
  }, [location.search, navigate]);

  //saving to local storage
  useEffect(() => {
    localStorage.setItem('cryptoPortfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  const handleAddCoin = async (coinId, quantity) => {
    try {
      // checking if coin is already in the portfolio
      const existingCoinIndex = portfolio.findIndex(item => item.id === coinId);
      
      if (existingCoinIndex >= 0) {
        //updating quantity
        const updatedPortfolio = [...portfolio];
        updatedPortfolio[existingCoinIndex].quantity += quantity;
        setPortfolio(updatedPortfolio);
      } else {
        //fetch data
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
        if (!response.ok) throw new Error('Failed to fetch coin data');
        
        const coinData = await response.json();
        const newCoin = {
          id: coinId,
          name: coinData.name,
          symbol: coinData.symbol,
          image: coinData.image?.small || '',
          quantity: quantity,
          priceWhenAdded: coinData.market_data.current_price.usd,
          addedAt: new Date().toISOString()
        };
        
        setPortfolio([...portfolio, newCoin]);
      }
    } catch (error) {
      console.error('Error adding coin to portfolio:', error);
      alert('Failed to add coin to portfolio. Please try again.');
    }
  };

  const removeFromPortfolio = (coinId) => {
    setPortfolio(portfolio.filter(item => item.id !== coinId));
  };

  const calculateTotalValue = () => {
    return portfolio.reduce((total, item) => {
      return total + (item.quantity * item.priceWhenAdded);
    }, 0);
  };

  return (
    <div className={`${darkMode ? 'dark bg-gray-900' : 'bg-white'} min-h-screen`}>
     
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
              onClick={() => navigate('/portfolio')}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            {[
              { name: 'Home', href: '/home' },
              { name: 'Market', href: '/home' },
           
              { name: 'Portfolio', href: '/portfolio' },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className="text-sm font-semibold text-gray-900 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="ml-10 flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-semibold text-gray-900 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </button>
            <div className="ml-4">
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
          </div>
        </nav>
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
            <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              My Portfolio
            </h1>
            
            {portfolio.length === 0 ? (
              <div className={`rounded-lg p-8 text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Your portfolio is empty. Add some coins to get started!
                </p>
                <button
                  onClick={() => navigate('/home')}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Browse Coins
                </button>
              </div>
            ) : (
              <>
                <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Portfolio Summary
                  </h2>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Total Value: <span className="font-bold">${calculateTotalValue().toLocaleString()}</span>
                  </p>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Number of Assets: <span className="font-bold">{portfolio.length}</span>
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                      <tr>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          Coin
                        </th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          Quantity
                        </th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          Price When Added
                        </th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          Current Value
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {portfolio.map((coin) => (
                        <tr key={coin.id} className={darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img 
                                className="h-8 w-8 rounded-full mr-3" 
                                src={coin.image || 'https://via.placeholder.com/32'} 
                                alt={coin.name}
                                onError={(e) => {
                                  e.target.onerror = null; 
                                  e.target.src = 'https://via.placeholder.com/32';
                                }}
                              />
                              <div>
                                <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {coin.name}
                                </div>
                                <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                                  {coin.symbol.toUpperCase()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {coin.quantity}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            ${coin.priceWhenAdded.toLocaleString()}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            ${(coin.quantity * coin.priceWhenAdded).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => removeFromPortfolio(coin.id)}
                              className={`p-1 rounded-full ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}