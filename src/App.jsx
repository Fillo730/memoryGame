import React, { useState, useEffect } from "react";
import './App.css';
import _ from 'lodash';

const images = [
    "https://images.unsplash.com/photo-1626808642875-0aa545482dfb",
    "https://images.unsplash.com/photo-1546842931-886c185b4c8c",
    "https://images.unsplash.com/photo-1520763185298-1b434c919102",
    "https://images.unsplash.com/photo-1442458017215-285b83f65851",
    "https://images.unsplash.com/photo-1496483648148-47c686dc86a8",
    "https://images.unsplash.com/photo-1591181520189-abcb0735c65d",
];

const placeholder = "https://img.freepik.com/free-photo/gray-painted-background_53876-94041.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1727654400&semt=ais_hybrid";

function App() {
    const [shuffledImages, setShuffledImages] = useState(_.shuffle(images.concat(images)));
    const [placeholderArray, setPlaceHolderArray] = useState(new Array(shuffledImages.length).fill(placeholder));
    const [selectedImages, setSelectedImages] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]); 
    const [moves, setMoves] = useState(0);

    
    function handleImageClick(index) {
        if (selectedImages.length === 2 || matchedPairs.includes(index) || selectedImages.includes(index)) {
            return; 
        }

        const newPlaceholders = [...placeholderArray];
        newPlaceholders[index] = shuffledImages[index];
        setPlaceHolderArray(newPlaceholders);

        
        const newSelectedImages = [...selectedImages, index];
        setSelectedImages(newSelectedImages);

       
        if (newSelectedImages.length === 2) {
            setMoves(moves + 1); 
            if (shuffledImages[newSelectedImages[0]] === shuffledImages[newSelectedImages[1]]) {
                setMatchedPairs([...matchedPairs, ...newSelectedImages]);
                setSelectedImages([]); 
            } else {
                setTimeout(() => {
                    const resetPlaceholders = [...placeholderArray];
                    resetPlaceholders[newSelectedImages[0]] = placeholder;
                    resetPlaceholders[newSelectedImages[1]] = placeholder;
                    setPlaceHolderArray(resetPlaceholders);
                    setSelectedImages([]);
                }, 1000);
            }
        }
    }

    function resetGame() {
        setShuffledImages(_.shuffle(images.concat(images))); 
        setPlaceHolderArray(new Array(images.length * 2).fill(placeholder)); 
        setSelectedImages([]); 
        setMatchedPairs([]); 
        setMoves(0); 
    }
    
    const allImagesMatched = matchedPairs.length === shuffledImages.length;

    return (
        <>
            <div className="div-title">
                <h1 className="div-h1-title">Memory Game</h1>
            </div>
            <div className="div-images">
                <ul className="div-ul-images">
                    {placeholderArray.map((image, index) => (
                        <li className="div-ul-li-images" key={index}>
                            <img src={image} alt="memory" onClick={() => handleImageClick(index)} />
                        </li>
                    ))}
                </ul>
            </div>
            {allImagesMatched && (
                <div className="div-reset">
                    <h2 className="div-reset-h2">Congratulations! You completed the game in {moves} moves.</h2>
                    <button className="div-reset-button" onClick={resetGame}>Reset Game</button>
                </div>
            )}
        </>
    );
}

export default App;
