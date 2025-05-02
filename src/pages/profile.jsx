import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { getFavorites, fetchCountryByCode } from "../services/api";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("account");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadFavorites = async () => {
      try {
        setLoading(true);
        const favoritesData = await getFavorites(user.id);

        const countriesDetails = await Promise.all(
          favoritesData.map(async (fav) => {
            try {
              const countryData = await fetchCountryByCode(fav.countryCode);
              return {
                ...fav,
                details: countryData,
              };
            } catch (error) {
              console.error(
                `Error fetching details for ${fav.countryCode}:`,
                error
              );
              return {
                ...fav,
                details: null,
              };
            }
          })
        );

        setFavorites(countriesDetails);
      } catch (error) {
        alert("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user, navigate]);

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <div className="border rounded-lg shadow p-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Profile</h2>
          <p className="text-gray-600">
            Manage your account and view your favorite countries
          </p>
        </div>

        <div className="flex space-x-4 border-b mb-4">
          <button
            onClick={() => setActiveTab("account")}
            className={`px-4 py-2 ${
              activeTab === "account"
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-600"
            }`}
          >
            Account
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-4 py-2 ${
              activeTab === "favorites"
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-600"
            }`}
          >
            Favorites
          </button>
        </div>

        {activeTab === "account" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Name</h3>
              <p className="text-lg">{user?.name}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Email</h3>
              <p className="text-lg">{user?.email}</p>
            </div>
          </div>
        )}

        {activeTab === "favorites" && (
          <div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="border rounded p-4 animate-pulse">
                    <div className="h-32 bg-gray-300 mb-2" />
                    <div className="h-4 bg-gray-300 w-3/4 mb-1" />
                    <div className="h-4 bg-gray-300 w-1/2" />
                  </div>
                ))}
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🌍</div>
                <h2 className="text-xl font-semibold mb-2">No Favorites Yet</h2>
                <p className="text-gray-500 mb-4">
                  You haven't added any countries to your favorites yet.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Explore Countries
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {favorites.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="border rounded overflow-hidden shadow"
                  >
                    {favorite.details ? (
                      <>
                        <div className="h-32 overflow-hidden">
                          <img
                            src={
                              favorite.details.flags.svg ||
                              favorite.details.flags.png
                            }
                            alt={`Flag of ${favorite.details.name.common}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-bold">
                            {favorite.details.name.common}
                          </h3>
                          <p className="text-gray-500">
                            {favorite.details.region}
                          </p>
                          <button
                            onClick={() =>
                              navigate(`/country/${favorite.countryCode}`)
                            }
                            className="mt-4 w-full border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50"
                          >
                            View Details
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-4 flex flex-col items-center justify-center h-48 text-center">
                        <p className="text-gray-500">
                          Country data unavailable
                        </p>
                        <p className="text-sm text-gray-400">
                          {favorite.countryCode}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
