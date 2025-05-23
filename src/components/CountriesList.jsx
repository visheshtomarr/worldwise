import Spinner from "./Spinner";
import styles from "./CountriesList.module.css";
import CountryItem from "./CountryItem";
import Message from "./Message";

function CountriesList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking a city on the map" />
    );

  const countryMap = new Map();
  cities.forEach((city) => {
    if (!countryMap.has(city.country)) {
      countryMap.set(city.country, {
        country: city.country,
        emoji: city.emoji,
      });
    }
  });
  const countries = Array.from(countryMap.values());

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountriesList;
