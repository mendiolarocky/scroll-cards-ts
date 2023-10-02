import { useState, useEffect } from "react";
import Footer from "./footer.tsx";
import logo from "./assets/magic-logo.png";
import cardsNotAvailable from "./assets/cards-not-available.jpg";
import "./App.css";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

type Card = {
  name: string;
  imageUrl: string;
  text: string;
  type: string;
};

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [cardsCurrentCount, setCardsCurrentCount] = useState(0);
  const [cardsTotal, setCardsTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
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

      if (scrollAtBottom && !loading && cardsCurrentCount == pageSize) {
        loadMoreCards();
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  useEffect(() => {
    if (searchTermSubmitted) {
      setLoading(true);
      setCards([]);
      setCurrentPage(1);
      setSearchTermSubmitted("");
    }
  }, [searchTerm]);

  const loadMoreCards = () => {
    if (!loading) {
      setLoading(true);
      setCurrentPage(currentPage + 1);
    }
  };

  const fetchCards = (url: string) => {
    console.log("fetchCards", url, loading);
    fetch(url, {
      method: "GET",
      credentials: "same-origin",
    })
      .then((response) => {
        const totalCountHeader = response.headers.get("Total-Count");
        const currentCountHeader = response.headers.get("Count");
        const totalCount = totalCountHeader
          ? parseInt(totalCountHeader, 10)
          : 0;
        const currentCount = currentCountHeader
          ? parseInt(currentCountHeader, 10)
          : 0;
        setCardsCurrentCount(currentCount);
        setCardsTotal(totalCount);
        return response.json();
      })
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

  const handleSearch = () => {
    if (searchTerm !== searchTermSubmitted) {
      setLoading(true);
      setCards([]);
      setCurrentPage(1);
      setSearchTermSubmitted(searchTerm);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="wrapper">
      <header className="fixed-header">
        <div className="header-items">
          <div className="image-container">
            <img src={logo} alt="Magic Logo" />
          </div>
          <span className="action-items">
            <span>
              <p className="cards-count">
                Cards displayed: {cards.length}/{cardsTotal}
              </p>
            </span>
            <span className="action-item">
              <MDBInput
                size="sm"
                type="text"
                label="Search by Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </span>
            <span className="action-item">
              <MDBBtn size="sm" onClick={handleSearch}>
                Search
              </MDBBtn>
            </span>
            <span className="action-item">
              <MDBBtn size="sm" color="danger" onClick={clearSearch}>
                X
              </MDBBtn>
            </span>
          </span>
        </div>
      </header>
      <div className="main">
        <div className="cards-tray">
          {cards.map((card, index) => (
            <div className="card" key={index}>
              <div className="card-image-wrapper">
                <img
                  src={card.imageUrl ? card.imageUrl : cardsNotAvailable}
                  alt={card.name}
                />
              </div>
              <p>
                <strong>{card.name}</strong>
              </p>
              <div className="card-details-wrapper">
                <ul>
                  <li>{card.type}</li>
                  <li>{card.text}</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="alerts">
          {loading && <p>Loading...</p>}
          {cardsCurrentCount == 0 && !loading && <p>No Cards Found</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
