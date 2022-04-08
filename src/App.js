import React, { useState, useEffect } from 'react';
import './App.css';
import FileUploadScreen from './screens/uploadScreen';
import { getMultipleFiles, removeImageapi, deleteCar, findCar } from './data/api';
import { Car, CarContainer, CarImage, RemoveCarButton } from './styles/CarCard.styled';
import axios from 'axios';
// import showUploadWidget from './screens/showwidget';
function App() {
  const [multipleFiles, setMultipleFiles] = useState([]);

  const removeImage = async(carId) => {
    // await files.forEach(element => {
    //   removeImageapi(element.filePath)
    // })
    // window.location.reload();
    await findCar(carId);
    
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
            <h3 className="font-weight-bold">{element.carId}. {element.make} {element.year}</h3>
            {/* <CarImage src={`http://localhost:5000/${element.files[0].filePath}`} height="200" alt="img" /> */}
            <h5 className='text-center'>{element.price}</h5>
            <h5 className='text-center'>{element.transmission}</h5>
            <RemoveCarButton onClick={()=>removeImage(element._id)}>Remove Car</RemoveCarButton>
          </Car>
        )}
      </CarContainer>
    </>
  );
}

export default App;