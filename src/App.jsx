import React, { useState, useEffect } from 'react';

/**
 * A custom hook for fetching data from an API.
 * @param {string} url The API endpoint URL to fetch data from.
 * @returns {{data: any, loading: boolean, error: string | null}} The fetched data, loading state, and any error that occurred.
 */
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // A controller to abort the fetch request if the component unmounts
    const abortController = new AbortController();
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, { signal: abortController.signal });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        // Only set the error if the fetch was not aborted by the cleanup function
        if (err.name !== 'AbortError') {
          setError(err.message || 'An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function to abort the fetch request on component unmount
    return () => abortController.abort();
  }, [url]);

  return { data, loading, error };
};


const App = () => {
  const apiUrl = "https://api.escuelajs.co/api/v1/products?limit=10&offset=0"; 
  const { data: products, loading, error } = useFetch(apiUrl);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sky-500 mb-2">
          Product Catalog
        </h1>
        <p className="text-gray-400 font-light">
          Fetching data from an API using a custom `useFetch` hook.
        </p>
      </header>

      <main className="w-full max-w-5xl">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-t-4 border-gray-400 border-t-sky-500 rounded-full animate-spin"></div>
            <p className="ml-4 text-sky-400 text-lg">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="text-center p-4 bg-red-800 rounded-lg shadow-md border border-red-700">
            <p className="text-red-300 font-bold text-lg mb-2">Error fetching data:</p>
            <p className="text-red-100">{error}</p>
          </div>
        )}

        {products && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-t-xl"
                  onError={(e) => {
                    e.target.onerror = null; // prevents infinite loop
                    e.target.src = `https://placehold.co/600x400/374151/E5E7EB?text=No+Image`;
                  }}
                />
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2">{product.title}</h3>
                  <p className="text-sm font-medium text-sky-400 mb-4">${product.price}</p>
                  <p className="text-sm text-gray-400">{product.description.substring(0, 75)}...</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;