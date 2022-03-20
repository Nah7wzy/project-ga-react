import React, { useState, useEffect } from 'react';
import './App.css';
import FileUploadScreen from './screens/uploadScreen';
import { getMultipleFiles } from './data/api';
import { Car, CarContainer, CarImage, RemoveCarButton } from './styles/CarCard.styled';

function App() {
  const [multipleFiles, setMultipleFiles] = useState([]);

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
            <h3 className="text-danger font-weight-bold">{element.make}</h3>
            <CarImage src={`http://localhost:5000/${element.files[0].filePath}`} height="200" alt="img" />
            <RemoveCarButton>Remove Car</RemoveCarButton>
          </Car>
        )}
      </CarContainer>
    </>
  );
}

export default App;