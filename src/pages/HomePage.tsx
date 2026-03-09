import React from 'react';
import { Link } from 'react-router-dom';
import { useCartContext } from '../contexts/CartContext';
import { useMonthlyPies } from '../hooks/usePies';
import { LoadingSpinner, ErrorMessage } from '../components/shared';
import PieCard from '../components/PieCard/PieCard';
import Hero from '../components/Hero/Hero';
import './HomePage.css';

const HomePage: React.FC = () => {
  const { addToCart } = useCartContext();
  const { pies: monthlyPies, loading, error } = useMonthlyPies();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage title="Failed to load pies of the month" message={error} />;

  return (
    <main className="container">
      <Hero />
      
      <section id="featured" className="featured">
        <h2>Pies of the Month</h2>
        <div className="pies-grid">
          {monthlyPies.map((pie) => (
            <PieCard 
              key={pie.id} 
              pie={pie} 
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </section>

      <section className="shop-cta">
        <h2>Shop by Category</h2>
        <div className="category-links">
          <Link to="/fruit" className="category-link">
            <h3>Fruit Pies</h3>
            <p>Fresh, seasonal fruit pies</p>
          </Link>
          <Link to="/cheesecake" className="category-link">
            <h3>Cheesecakes</h3>
            <p>Rich, creamy cheesecakes</p>
          </Link>
          <Link to="/seasonal" className="category-link">
            <h3>Seasonal</h3>
            <p>Holiday favorites</p>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
