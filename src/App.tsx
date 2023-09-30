import { useState, useEffect } from "react";
import Footer from "./footer.tsx";
import logo from "./assets/magic-logo.png";
import "./App.css";

type Card = {
  name: string;
  imageUrl: string;
  text: string;
  type: string;
};

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTermSubmitted, setSearchTermSubmitted] = useState("");

  useEffect(() => {
    const url = `https://api.magicthegathering.io/v1/cards/?page=${currentPage}&pageSize=${pageSize}&name=${searchTermSubmitted}`;
    fetchCards(url);
  }, [currentPage, pageSize, searchTermSubmitted]);

  const fetchCards = (url: string) => {
    fetch(url, {
      method: "GET",
      credentials: "same-origin",
    })
      .then((response) => response.json())
      .then((data) => {
        const newCards: Card[] = data.cards || [];
        if (newCards.length > 0) {
          setCards(newCards);
        } else {
          console.log("No more cards to load!");
        }
      })
      .finally(() => {
        console.log("Done fetching.");
      });
  };

  return (
    <div className="wrapper">
      <div className="main">
        <div className="image-container">
          <img src={logo} alt="Magic Logo" />
        </div>
        <div className="cards-tray">
          {cards.map((card, index) => (
            <div className="card" key={index}>
              <div className="card-image-wrapper">
                <img src={card.imageUrl} alt={card.name} />
              </div>
              <div className="card-details-wrapper">
                <p>
                  <strong>{card.name}</strong>
                </p>
                <p>{card.type}</p>
                <p>{card.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
