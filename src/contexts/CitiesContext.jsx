import { createContext, useContext, useEffect, useReducer } from "react";

const BASE_URL = "http://localhost:8000";

// 1. Create a context.
const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(currState, action) {
  switch (action.type) {
    case "loading":
      return {
        ...currState,
        isLoading: true,
      };

    case "cities/loaded":
      return {
        ...currState,
        isLoading: false,
        cities: action.payload,
      };

    case "city/loaded":
      return {
        ...currState,
        isLoading: false,
        currentCity: action.payload,
      };

    case "city/added":
      return {
        ...currState,
        isLoading: false,
        cities: [...currState.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...currState,
        isLoading: false,
        cities: currState.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "rejected":
      return {};

    default:
      throw new Error("Unknown action");
  }
}

function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cities, isLoading, currentCity, error } = state;

  useEffect(() => {
    const fetchCities = async () => {
      dispatch({ type: "loading" });

      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There is some error loading cities!",
        });
      }
    };

    fetchCities();
  }, []);

  const fetchCurrentCity = async (id) => {
    // If the currently active city is clicked again, then we don't
    // need to fetch it again from the api to load it faster. 
    if (Number(id) === currentCity.id) return ;
    
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There is some error in loading city!",
      });
    }
  };

  const createCity = async (newCity) => {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/added", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There is some error in creating city!",
      });
    }
  };

  const deleteCity = async (id) => {
    dispatch({ type: "loading" });

    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There is some error in deleting city!",
      });
    }
  };

  return (
    // 2. Provide values to our components through the context provider.
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        fetchCurrentCity,
        createCity,
        deleteCity,
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
