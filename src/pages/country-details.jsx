import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  fetchCountryByCode,
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../services/api";
import { useAuth } from "../context/auth-context";
import { ArrowLeft, Heart, Globe, AlertCircle } from "lucide-react";

export default function CountryDetails() {
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchCountryByCode(countryCode);
        if (!data) throw new Error("Country not found");
        setCountry(data);

        if (user) {
          try {
            const favorites = await getFavorites(user.id);
            setIsFavorite(favorites.includes(countryCode));
          } catch (favError) {
            console.error("Failed to fetch favorites:", favError);
          }
        }
      } catch (err) {
        console.error("Error fetching country:", err);
        setError(err.message || "Failed to load country details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [countryCode, user]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      alert("Please login to add countries to favorites.");
      return;
    }

    try {
      setFavoriteLoading(true);

      if (isFavorite) {
        const result = await removeFavorite(user.id, countryCode);
        if (result.success) {
          setIsFavorite(false);
          alert(`${country.name.common} removed from favorites.`);
        } else {
          throw new Error(result.message || "Failed to remove favorite");
        }
      } else {
        const result = await addFavorite(user.id, countryCode);
        if (result.success) {
          setIsFavorite(true);
          alert(`${country.name.common} added to favorites.`);
        } else {
          throw new Error(result.message || "Failed to add favorite");
        }
      }
    } catch (err) {
      console.error("Favorite error:", err);
      alert(err.message || "Failed to update favorites.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const formatPopulation = (population) => {
    return new Intl.NumberFormat().format(population);
  };

  const getLanguages = (languages) => {
    return languages ? Object.values(languages).join(", ") : "N/A";
  };

  const getCurrencies = (currencies) => {
    return currencies
      ? Object.values(currencies)
          .map((currency) => currency.name)
          .join(", ")
      : "N/A";
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-md w-full">
          <div className="flex flex-col items-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Oops!</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                Go Back
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 border px-4 py-2 rounded"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {!loading && country && (
          <button
            onClick={handleFavoriteToggle}
            disabled={favoriteLoading}
            className={`flex items-center gap-2 px-4 py-2 border rounded ${
              isFavorite ? "bg-black text-white" : ""
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="h-80 w-full bg-gray-200 animate-pulse rounded" />
          <div className="space-y-6">
            <div className="h-10 w-3/4 bg-gray-200 animate-pulse rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-6 w-full bg-gray-200 animate-pulse rounded"
                  />
                ))}
              </div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-6 w-full bg-gray-200 animate-pulse rounded"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        country && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="h-auto">
              <img
                src={country.flags.svg || country.flags.png}
                alt={`Flag of ${country.name.common}`}
                className="w-full h-auto object-cover shadow-md"
              />
            </div>

            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{country.name.common}</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Native Name:</span>{" "}
                    {country.name.nativeName
                      ? Object.values(country.name.nativeName)[0].common
                      : country.name.common}
                  </p>
                  <p>
                    <span className="font-semibold">Population:</span>{" "}
                    {formatPopulation(country.population)}
                  </p>
                  <p>
                    <span className="font-semibold">Region:</span>{" "}
                    {country.region}
                  </p>
                  <p>
                    <span className="font-semibold">Sub Region:</span>{" "}
                    {country.subregion || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Capital:</span>{" "}
                    {country.capital?.[0] || "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Top Level Domain:</span>{" "}
                    {country.tld?.[0] || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Currencies:</span>{" "}
                    {getCurrencies(country.currencies)}
                  </p>
                  <p>
                    <span className="font-semibold">Languages:</span>{" "}
                    {getLanguages(country.languages)}
                  </p>
                </div>
              </div>

              {country.borders && country.borders.length > 0 && (
                <div className="pt-4">
                  <h2 className="text-xl font-semibold mb-3">
                    Border Countries:
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {country.borders.map((border) => (
                      <Link to={`/country/${border}`} key={border}>
                        <button className="border px-3 py-1 text-sm rounded">
                          {border}
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
