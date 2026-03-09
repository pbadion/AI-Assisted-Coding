import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useCartContext } from '../contexts/CartContext';
import { usePies } from '../hooks/usePies';
import { Pie } from '../types/pie';
import { LoadingSpinner, ErrorMessage } from '../components/shared';
import PieCard from '../components/PieCard/PieCard';
import SearchBar from '../components/SearchBar/SearchBar';
import './CategoryPage.css';

const CATEGORY_TITLES: Record<string, string> = {
  fruit: 'Fruit Pies',
  cheesecake: 'Cheesecakes',
  seasonal: 'Seasonal Pies',
};

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { addToCart } = useCartContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { pies, loading, error } = usePies(category as 'fruit' | 'cheesecake' | 'seasonal');

  const filteredPies = useMemo(() => {
    if (!searchQuery.trim()) return pies;
    
    const query = searchQuery.toLowerCase();
    return pies.filter((pie: Pie) => 
      pie.name.toLowerCase().includes(query) ||
      pie.description.toLowerCase().includes(query)
    );
  }, [pies, searchQuery]);

  const categoryTitle = CATEGORY_TITLES[category ?? ''] ?? 'All Pies';

  if (loading) return <LoadingSpinner message="Loading pies..." />;
  if (error) return <ErrorMessage title="Failed to load pies" message={error} />;

  return (
    <main className="container">
      <section className="page-header">
        <h1>{categoryTitle}</h1>
        <p>Discover our delicious {categoryTitle.toLowerCase()}</p>
      </section>

      <section className="search-section">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={`Search ${categoryTitle.toLowerCase()}...`}
        />
      </section>

      <section className="pies-section">
        <div className="pies-grid">
          {filteredPies.length === 0 ? (
            <div className="no-results">
              <h3>No pies found</h3>
              <p>
                {searchQuery 
                  ? `No pies match "${searchQuery}". Try a different search term.`
                  : 'No pies available in this category.'
                }
              </p>
            </div>
          ) : (
            filteredPies.map((pie: Pie) => (
              <PieCard 
                key={pie.id} 
                pie={pie} 
                onAddToCart={addToCart}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default CategoryPage;
