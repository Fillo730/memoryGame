//Libraries
import { useState, useEffect } from "react";
import _ from 'lodash';

//utils
import { isLoggedIn } from "../../utils/loginFunctions";
import { getMaxDifficulty } from "../../utils/difficulties";

//Components
import { CustomButton } from "../../components/ComponentsDependencies";
import defaultImages from "../../../public/DefaultImages";
import placeholder from "../../../public/Placeholder";

//Constants
import BACKEND_URL from "../../utils/backendEndpoint";

//CSSFiles
import './MemoryGame.css';

function MemoryGame({difficulty, handleGoBack, handleNextDifficulty}) {
    const cards = difficulty.cards;
    const name = difficulty.name;
    const numPairs = Math.floor(cards / 2);
    const selectedImagesPool = _.sampleSize(defaultImages, numPairs);
    const initialShuffled = _.shuffle([...selectedImagesPool, ...selectedImagesPool]);

    const [shuffledImages, setShuffledImages] = useState(initialShuffled);
    const [placeholderArray, setPlaceHolderArray] = useState(new Array(cards).fill(placeholder));
    const [selectedImages, setSelectedImages] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [moves, setMoves] = useState(0);

    useEffect(() => {
        resetGame();
    }, [cards]);

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
            setMoves(prev => prev + 1);
            if (shuffledImages[newSelectedImages[0]] === shuffledImages[newSelectedImages[1]]) {
                setMatchedPairs(prev => [...prev, ...newSelectedImages]);
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
        const selectedImagesPool = _.sampleSize(defaultImages, numPairs);
        const newShuffled = _.shuffle([...selectedImagesPool, ...selectedImagesPool]);
        setShuffledImages(newShuffled);
        setPlaceHolderArray(new Array(cards).fill(placeholder));
        setSelectedImages([]);
        setMatchedPairs([]);
        setMoves(0);
    }

    const allImagesMatched = matchedPairs.length === shuffledImages.length;

    useEffect(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        if(!isLoggedIn()) {
            return;
        }
        const token = localStorage.getItem('token');
        if (allImagesMatched) {
            fetch(`${BACKEND_URL}/play`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
        body: JSON.stringify({ difficulty: name, moves: moves }) 
        })
        .then(res => res.json())
        .catch(err => console.error(err));
    }
    }, [allImagesMatched]);

    return (
        <div className="memory-game-container">
            <ul className="memory-grid">
                {placeholderArray.map((image, index) => (
                    <li key={index} className="memory-card memory-card-dimension" onClick={() => handleImageClick(index)}>
                        <img src={image} alt="memory" />
                    </li>
                ))}
            </ul>
            {!allImagesMatched && 
                <p className='big-text'>
                    Current attempts: <label className='light-color'>{moves}</label>
                </p>
                }
            {allImagesMatched && (
                <div className="memory-reset">
                    <h2>🎉 Completed in {moves} moves!</h2>
                    <div className="customButton-container">
                        <CustomButton text="Next Level" handleClick={() => handleNextDifficulty(difficulty.level + 1)}
                            disabled={getMaxDifficulty().name === name}/>
                        <CustomButton text="Play Again" handleClick={resetGame}/>
                        <CustomButton text="Go Back" handleClick={handleGoBack}/>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MemoryGame;