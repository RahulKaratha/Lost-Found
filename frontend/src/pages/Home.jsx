import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import ItemCard from "../components/ItemCard";

const categories = [
  { value: "", label: "All Categories" },
  { value: "electronics", label: "Electronics" },
  { value: "documents", label: "Documents" },
  { value: "clothing", label: "Clothing" },
  { value: "accessories", label: "Accessories" },
  { value: "bags", label: "Bags" },
  { value: "keys", label: "Keys" },
  { value: "other", label: "Other" }
];

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    search: "",
    status: "open"
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = {};
      Object.keys(filters).forEach(key => {
        if (filters[key]) params[key] = filters[key];
      });
      
      const res = await API.get("/items", { params });
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    fetchItems();
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
        <h1 className="text-4xl font-bold mb-4">Lost & Found Portal</h1>
        <p className="text-xl mb-6">Help reunite people with their belongings</p>
        <Link 
          to="/add" 
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Report an Item
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search items, locations..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="input-field pr-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="input-field"
            >
              <option value="">All Types</option>
              <option value="lost">Lost Items</option>
              <option value="found">Found Items</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="input-field"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="input-field"
            >
              <option value="open">Available</option>
              <option value="claimed">Claimed</option>
              <option value="closed">Closed</option>
              <option value="">All Status</option>
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="btn-primary flex items-center space-x-2"
          >
            <FunnelIcon className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Recently Claimed Items */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recently Claimed Items</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.filter(item => item.status === 'claimed').slice(0, 6).map(item => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
        {items.filter(item => item.status === 'claimed').length === 0 && !loading && (
          <p className="text-gray-500 text-center py-8">No recently claimed items.</p>
        )}
      </div>

      {/* Results */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {filters.type ? `${filters.type.charAt(0).toUpperCase() + filters.type.slice(1)} Items` : 'Available Items'}
          </h2>
          <span className="text-gray-600">
            {(() => {
              let count = items.length;
              if (filters.type) count = items.filter(item => item.type === filters.type).length;
              if (filters.category) count = items.filter(item => item.category === filters.category).length;
              if (filters.status) count = items.filter(item => item.status === filters.status).length;
              return count;
            })()} items found
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (() => {
          let filteredItems = items;
          
          if (filters.type) {
            filteredItems = filteredItems.filter(item => item.type === filters.type);
          }
          if (filters.category) {
            filteredItems = filteredItems.filter(item => item.category === filters.category);
          }
          if (filters.status) {
            filteredItems = filteredItems.filter(item => item.status === filters.status);
          }
          if (filters.search) {
            filteredItems = filteredItems.filter(item => 
              item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
              item.description.toLowerCase().includes(filters.search.toLowerCase()) ||
              item.location.toLowerCase().includes(filters.search.toLowerCase())
            );
          }
          
          return filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No items found matching your criteria.</p>
              <Link to="/add" className="text-blue-600 hover:underline mt-2 inline-block">
                Be the first to report an item
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}