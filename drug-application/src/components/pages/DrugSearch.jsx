import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../pages/Header.jsx";

const API_URL = "https://rxnav.nlm.nih.gov/REST/";

const DrugSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const drugSearch = async () => {
    try {
      const response = await fetch(
        `${API_URL}drugs?name=${encodeURIComponent(query)}`
      );
      const xmlText = await response.text();

      // Parse XML using DOMParser
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");

      // Check if the XML contains conceptGroup
      const conceptGroups = xmlDoc.getElementsByTagName("conceptGroup");
      if (conceptGroups.length > 0) {
        const conceptGroup = conceptGroups[0];
        const conceptGroupData = parseConceptGroup(conceptGroup);
        setResults(conceptGroupData);
        setSuggestions([]);
        setError("");
      } else {
        // If no conceptGroup, fetch spelling suggestions
        const suggestionsResponse = await fetch(
          `${API_URL}spellingsuggestions?name=${encodeURIComponent(query)}`
        );
        const suggestionsData = await suggestionsResponse.text();
        const suggestionXML = parser.parseFromString(
          suggestionsData,
          "text/xml"
        );

        if (
          suggestionXML.suggestionGroup &&
          suggestionXML.suggestionGroup.suggestionList &&
          suggestionXML.suggestionGroup.suggestionList.suggestion
        ) {
          setSuggestions(
            suggestionsData.suggestionGroup.suggestionList.suggestion
          );
          setError("");
          setResults([]);
        } else {
          setResults([]);
          setSuggestions([]);
          setError("No results found.");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data. Please try again.");
    }
  };

  const parseConceptGroup = (conceptGroup) => {
    const conceptGroupData = [];
    const concepts = conceptGroup.getElementsByTagName("conceptProperties");

    for (let i = 0; i < concepts.length; i++) {
      const concept = concepts[i];
      const rxcui = concept.getElementsByTagName("rxcui")[0]?.textContent || "";
      const name = concept.getElementsByTagName("name")[0]?.textContent || "";
      const synonym =
        concept.getElementsByTagName("synonym")[0]?.textContent || "";

      conceptGroupData.push({ rxcui, name, synonym });
    }

    return conceptGroupData;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    drugSearch();
  };
  const navigateToDrugDetail = () => {
    navigate(`/drugs/${encodeURIComponent(query)}`);
  };

  return (
    <>
      <Header title="Drug Search" />
      <div className="main-container">
        <div className="drugSearch-container">
        <section id="search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search drug name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Search Drug</button>
          </form>
        </section>
        {error && <p>{error}</p>}
        <section id='search-results'>
          <ul>
            {results.map((result) => (
              <li key={result.rxcui}>
                <p>{result.name}</p>
                <button onClick={navigateToDrugDetail}>View Details</button>
              </li>
            ))}
          </ul>
        </section>

        <section id="search-results">
          <ul>
            {suggestions.map((suggestion) => (
              <li key={suggestion}>
                <p>{suggestion}</p>
              </li>
            ))}
          </ul>
        </section>
        </div>
        
      </div>
    </>
  );
};

export default DrugSearch;
