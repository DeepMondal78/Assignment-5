import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          "https://api.escuelajs.co/api/v1/products?limit=30"
        );

        if (!response.ok) {
          throw new Error("Request failed");
        }

        const data = await response.json();
        setProductList(data);
      } catch {
        setErrorMsg("Unable to load products. Try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (isLoading) {
    return <p className="status-text">Loading products...</p>;
  }

  if (errorMsg) {
    return <p className="error-text">{errorMsg}</p>;
  }

  return (
    <div className="app">
      <h1 className="title">Product List</h1>

      <div className="product-grid">
        {productList.map((product) => {
          const imageUrl =
            product.images && product.images[0]
              ? product.images[0].replace("http://", "https://")
              : "https://placehold.co/300x200";

          return (
            <div className="card" key={product.id}>
              <img src={imageUrl} alt={product.title} />
              <h3>{product.title}</h3>
              <p className="price">${product.price}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
