import { defineStore } from 'pinia';

const STORAGE_KEY = 'wf_weather';

function safeParse(raw) {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useWeatherStore = defineStore('weather', {
  state: () => {
    const saved = safeParse(localStorage.getItem(STORAGE_KEY));
    return {
      currentCity: saved?.currentCity || null,
      favorites: saved?.favorites || [],
      // { [locationId]: { now, fetchedAt } }
      nowCache: saved?.nowCache || {}
    };
  },
  actions: {
    persist() {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            currentCity: this.currentCity,
            favorites: this.favorites,
            nowCache: this.nowCache
          })
        );
      } catch {
        // ignore
      }
    },
    setCity(city) {
      this.currentCity = city;
      this.persist();
    },
    isFavorite(locationId) {
      return this.favorites.some((c) => c.id === locationId);
    },
    toggleFavorite(city) {
      if (!city?.id) return;
      if (this.isFavorite(city.id)) {
        this.favorites = this.favorites.filter((c) => c.id !== city.id);
      } else {
        this.favorites = [city, ...this.favorites];
      }
      this.persist();
    },
    setNowWeather(locationId, now) {
      if (!locationId) return;
      this.nowCache[locationId] = {
        now,
        fetchedAt: Date.now()
      };
      this.persist();
    },
    getNowWeather(locationId, maxAgeMs = 5 * 60 * 1000) {
      const entry = this.nowCache?.[locationId];
      if (!entry) return null;
      if (Date.now() - entry.fetchedAt > maxAgeMs) return null;
      return entry.now;
    }
  }
});

