
import React, { useEffect, useState } from "react";
const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://api.escuelajs.co/api/v1/products?limit=30&offset=0")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Something went wrong while fetching products");
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "20px", background: "#111", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ textAlign: "center", color: "#E302F7", fontSize: "35px"}}>Product Catalog</h1>

      {loading && <p>Loading products..</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
        {products.map((item) => (
          <div key={item.id} style={{ background: "#222", padding: "10px", borderRadius: "8px" }}>
            <img
              src={item.images[0]}
              alt={item.title}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
              onError={(e) => {
                e.target.src = "https://placehold.co/300x200";
              }}
            />
            <h3>{item.title}</h3>
            <p>${item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
