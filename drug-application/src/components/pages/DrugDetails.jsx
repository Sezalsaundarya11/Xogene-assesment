import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
const API_URL = "https://rxnav.nlm.nih.gov/REST/";

const DrugDetail = () => {
  const { drugName } = useParams();
  const [drugDetails, setDrugDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDrugDetails = async () => {
      try {
        const response = await fetch(
          `${API_URL}drugs?name=${encodeURIComponent(drugName)}`
        );
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        const conceptProperties =
          xmlDoc.getElementsByTagName("conceptProperties")[0];
        const rxcui =
          conceptProperties.getElementsByTagName("rxcui")[0]?.textContent || "";
        const name =
          conceptProperties.getElementsByTagName("name")[0]?.textContent || "";
        const synonym =
          conceptProperties.getElementsByTagName("synonym")[0]?.textContent ||
          "";

        setDrugDetails({ rxcui, name, synonym });
        setLoading(false);
        setError("");
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching drug details. Please try again.");
        setLoading(false);
      }
    };

    fetchDrugDetails();
  }, [drugName]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
    <Header title="Drug Details" />
    <div className="drug-main">
      <div className="drug-detail">
        
        <h2>{drugName}</h2>
        <p><span>RxCUI:</span> {drugDetails.rxcui}</p>
        <p><span>Name:</span> {drugDetails.name}</p>
        <p><span>Synonym:</span> {drugDetails.synonym}</p>
      </div>
    </div>
    </>
    
  );
};

export default DrugDetail;
