//Libraries
import { useState } from 'react';
import _ from 'lodash';

//Components
import { CustomButton } from '../../components/ComponentsDependencies';

//Objects
import defaultImages from '../../../public/DefaultImages';

//CSSFiles
import './NatureGallery.css';

function NatureGallery() {
    const [randomImages, setRandomImages] = useState(
        getUniqueRandomImage());

    function getUniqueRandomImage() {
        const shuffledImages = _.shuffle(defaultImages);
        return shuffledImages.slice(0, 6);
    }

    function handleClick() {    
        const newImages = getUniqueRandomImage();
        setRandomImages(newImages);
    }

    return (
        <>
            <div className="gallery-container">
                {
                    randomImages.map((src, index) => (
                        <img key={index} className="gallery-item" src={src} alt={`Nature ${index + 1}`} />
                    ))
                }
            </div>
            <p className='big-text'>
                Total different pictures in the gallery: <label className='light-color'>{defaultImages.length}</label>
            </p>
            <CustomButton text={"See more"} handleClick={handleClick} />
        </>
  )
}

export default NatureGallery;