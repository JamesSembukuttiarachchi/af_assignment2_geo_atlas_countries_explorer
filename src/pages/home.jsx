import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchAllCountries,
  searchCountriesByName,
  fetchCountriesByRegion,
} from "../services/api";
import { Search, Globe } from "lucide-react";

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        const data = await fetchAllCountries();
        setCountries(data);
        setFilteredCountries(data);
      } catch (err) {
        setError("Failed to load countries. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  useEffect(() => {
    const filterCountries = async () => {
      try {
        setLoading(true);
        let result = [];

        if (searchTerm) {
          result = await searchCountriesByName(searchTerm);
        } else if (selectedRegion && selectedRegion !== "all") {
          result = await fetchCountriesByRegion(selectedRegion);
        } else {
          result = countries;
        }

        setFilteredCountries(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      filterCountries();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm, selectedRegion, countries]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  };

  const formatPopulation = (population) => {
    return new Intl.NumberFormat().format(population);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Globe className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Oops!</h2>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a country..."
            className="pl-8 pr-2 py-2 border border-gray-300 rounded w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <select
          value={selectedRegion}
          onChange={handleRegionChange}
          className="w-full md:w-[180px] px-2 py-2 border border-gray-300 rounded"
        >
          <option value="">Filter by Region</option>
          <option value="all">All Regions</option>
          <option value="africa">Africa</option>
          <option value="americas">Americas</option>
          <option value="asia">Asia</option>
          <option value="europe">Europe</option>
          <option value="oceania">Oceania</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="border rounded shadow p-4 animate-pulse space-y-2"
            >
              <div className="h-40 bg-gray-200 w-full rounded"></div>
              <div className="h-6 bg-gray-200 w-3/4 rounded"></div>
              <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
              <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
              <div className="h-4 bg-gray-200 w-1/3 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredCountries.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <Globe className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Countries Found</h2>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedRegion("");
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCountries.map((country) => (
            <Link to={`/country/${country.cca3}`} key={country.cca3}>
              <div className="border rounded overflow-hidden h-full hover:shadow-lg transition-shadow">
                <div className="h-40 overflow-hidden">
                  <img
                    src={country.flags.svg || country.flags.png}
                    alt={`Flag of ${country.name.common}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {country.name.common}
                  </h3>
                  <p>
                    <strong>Population:</strong>{" "}
                    {formatPopulation(country.population)}
                  </p>
                  <p>
                    <strong>Region:</strong> {country.region}
                  </p>
                  <p>
                    <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
