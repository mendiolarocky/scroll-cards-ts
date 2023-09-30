import { useState, useEffect } from "react";
import Header from "./Header.tsx";
import Footer from "./footer.tsx";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `https://api.magicthegathering.io/v1/cards/?page=${currentPage}&pageSize=${pageSize}&name=${searchTermSubmitted}`;
    fetchCards(url);
  }, [currentPage, pageSize, searchTermSubmitted]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = Math.ceil(window.scrollY);
      const windowHeight = Math.ceil(window.innerHeight);
      const documentHeight = Math.ceil(document.documentElement.scrollHeight);

      // Calculate the position when the user is near the bottom (approximately 900px from the bottom)
      const scrollAtBottom =
        scrollPosition + windowHeight >= documentHeight - 900;

      if (scrollAtBottom && !loading) {
        loadMoreCards();
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  const loadMoreCards = () => {
    if (!loading) {
      setLoading(true);
      setCurrentPage(currentPage + 1);
    }
  };

  const fetchCards = (url: string) => {
    fetch(url, {
      method: "GET",
      credentials: "same-origin",
    })
      .then((response) => response.json())
      .then((data) => {
        const newCards: Card[] = data.cards || [];
        if (newCards.length > 0) {
          setCards([...cards, ...newCards]);
        } else {
          console.log("No more cards to load!");
        }
      })
      .finally(() => {
        setLoading(false);
        console.log("Done fetching.", url);
      });
  };

  return (
    <div className="wrapper">
      <Header cardsLength={cards.length} />
      <div className="main">
        <div className="cards-tray">
          {cards.map((card, index) => (
            <div className="card" key={index}>
              <p>
                <strong>
                  {index + 1}. {card.name}
                </strong>
              </p>
              <div className="card-image-wrapper">
                <img src={card.imageUrl} alt={card.name} />
              </div>
              <div className="card-details-wrapper">
                <p>{card.type}</p>
                <p>{card.text}</p>
              </div>
            </div>
          ))}
        </div>
        {loading && <p>Loading...</p>}
      </div>
      <Footer />
    </div>
  );
}

export default App;
