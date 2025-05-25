import { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = "http://localhost:8000";

// 1. Create a context.
const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch (error) {
        alert("There is some error loading data!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, []);

  const fetchCurrentCity = async (id) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch (error) {
      alert("There is some error loading data!");
    } finally {
      setIsLoading(false);
    }
  };

  const createCity = async (newCity) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setCities((cities) => [...cities, data]);
    } catch (error) {
      alert("There is some error loading data!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 2. Provide values to our components through the context provider.
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        fetchCurrentCity,
        createCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  // 3. Consuming values from our context.
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext is used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
