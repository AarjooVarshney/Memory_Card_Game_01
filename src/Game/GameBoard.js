import React, { useState, useEffect } from "react";
import Data from "./data";
import Card from "./Card";

function GameBoard() {
  const [cardsArray, setCardsArray] = useState([]);
  const [moves, setMoves] = useState(0);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [stopFlip, setStopFlip] = useState(false);
  const [won, setWon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute countdown

  // Shuffle cards and start the game
  useEffect(() => {
    const randomOrderArray = Data.sort(() => 0.5 - Math.random());
    setCardsArray(randomOrderArray);
  }, []);

  // Start the countdown timer when the game starts
  useEffect(() => {
    if (!won && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, won]);

  // Handle card selection
  function handleSelectedCards(item) {
    if (!stopFlip) {
      if (firstCard && firstCard.id === item.id) {
        return;
      }

      if (firstCard !== null && firstCard.id !== item.id) {
        setSecondCard(item);
      } else {
        setFirstCard(item);
      }
    }
  }

  // Check if two selected cards match
  useEffect(() => {
    if (firstCard && secondCard) {
      setStopFlip(true);
      if (firstCard.name === secondCard.name) {
        setCardsArray((prevArray) => {
          return prevArray.map((unit) => {
            if (unit.name === firstCard.name) {
              return { ...unit, matched: true };
            } else {
              return unit;
            }
          });
        });
        setWon(cardsArray.every((card) => card.matched));
        removeSelection();
      } else {
        setTimeout(() => {
          removeSelection();
        }, 1000);
      }
    }
  }, [firstCard, secondCard, cardsArray]);

  // Reset selected cards and enable flipping
  function removeSelection() {
    setFirstCard(null);
    setSecondCard(null);
    setStopFlip(false);
    setMoves((prevValue) => prevValue + 1);
  }

  // Reset the game
  function resetGame() {
    setTimeLeft(60);
    setMoves(0);
    setWon(false);
    const randomOrderArray = Data.sort(() => 0.5 - Math.random());
    setCardsArray(randomOrderArray);
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Memory Game</h1>
      </div>
      <div className="board">
        {cardsArray.map((item) => (
          <Card
            item={item}
            key={item.id}
            handleSelectedCards={handleSelectedCards}
            toggled={item === firstCard || item === secondCard || item.matched}
            stopFlip={stopFlip}
          />
        ))}
      </div>

      <div className="info">
        <div className="moves">Moves: {moves}</div>
        <div className="timer">Time Left: {timeLeft}</div>
      </div>

      {won && (
        <div className="comments">Congratulations! You won in {moves} moves!</div>
      )}

      <button className="button" onClick={resetGame}>
        New Game
      </button>
    </div>
  );
}

export default GameBoard;