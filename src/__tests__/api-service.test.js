import {
  fetchAllCountries,
  searchCountriesByName,
  fetchCountriesByRegion,
  fetchCountryByCode,
} from "../services/api";

import { vi, describe, it, expect, afterEach } from "vitest";

// Mocking fetch
globalThis.fetch = vi.fn();

describe("Country API Service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetchAllCountries - should return all countries", async () => {
    const mockData = [{ name: "Sri Lanka" }, { name: "India" }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchAllCountries();
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/all"));
  });

  it("searchCountriesByName - returns matched countries", async () => {
    const mockData = [{ name: "India" }];
    fetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await searchCountriesByName("India");
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/name/India"));
  });

  it("searchCountriesByName - returns empty array for 404", async () => {
    fetch.mockResolvedValueOnce({
      status: 404,
      ok: false,
    });

    const result = await searchCountriesByName("UnknownCountry");
    expect(result).toEqual([]);
  });

  it("fetchCountriesByRegion - should return countries from region", async () => {
    const mockData = [{ name: "Germany" }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchCountriesByRegion("Europe");
    expect(result).toEqual(mockData);
  });

  it("fetchCountryByCode - returns single country", async () => {
    const mockData = [{ name: "Japan" }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchCountryByCode("JP");
    expect(result).toEqual(mockData[0]);
  });
});
