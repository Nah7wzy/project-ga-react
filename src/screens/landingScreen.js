import React, { useState, useEffect } from 'react';
import '../App.css'
import { Car, CarContainer, CarImage, RemoveCarButton } from '../styles/CarCard.styled';
import axios from 'axios';
import { deleteCar, getMultipleFiles } from '../data/api';
import FileUploadScreen from './uploadScreen';
// import showUploadWidget from './screens/showwidget';
function LandingPage() {
    const [multipleFiles, setMultipleFiles] = useState([]);

    const removeCar = async (carId, public_id) => {
        // await files.forEach(element => {
        //   removeImageapi(element.filePath)
        // })
        await deleteCar(carId, public_id);
        // window.location.reload();
    }

    const getMultipleFilesList = async () => {
        try {
            const fileslist = await getMultipleFiles();
            setMultipleFiles(fileslist);
            console.log(multipleFiles);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getMultipleFilesList();
    }, []);
    return (
        <>
            {/* <showUploadWidget/> */}
            <div className="container">
                <h3 className="text-danger font-weight-bolder border-bottom text-center">Upload Car</h3>
                <FileUploadScreen getMultiple={() => getMultipleFilesList()} />
            </div>
            <br />
            <h3 className="text-danger font-weight-bold text-center">Cars on DB</h3>
            <br />
            <CarContainer>
                {multipleFiles.map((element, index) =>
                    <Car key={element._id}>
                        <h3 className="font-weight-bold">{element.carId}. {element.make} {element.model} {element.year}</h3>
                        <CarImage src={`${element.files[0]}`} height="200" alt="img" />
                        <h5 className='text-center'>{element.price}</h5>
                        <h5 className='text-center'>{element.transmission}</h5>
                        <RemoveCarButton onClick={() => removeCar(element._id, element.pids)}>Remove Car</RemoveCarButton>
                    </Car>
                )}
            </CarContainer>
        </>
    );
}

export default LandingPage;