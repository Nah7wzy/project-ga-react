import React, {useState, useEffect} from 'react';
import './App.css';
import FileUploadScreen from './screens/uploadScreen';
import {getSingleFiles, getMultipleFiles} from './data/api';

function App() {;
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
          <h3 className="text-danger font-weight-bolder border-bottom text-center">Car Data Upload </h3>
          <FileUploadScreen getMultiple={() => getMultipleFilesList()}/>
       </div> 
       <div className="container-fluid mt-5">
         <div className="row">
          
           <div className="col-6">
             <h4 className="text-success font-weight-bold">Cars List</h4>
             {multipleFiles.map((element, index) =>
                <div key={element._id}>
                    <h6 className="text-danger font-weight-bold">{element.carId}</h6>
                    <div className="row">
                      {element.files.map((file, index) =>
                        <div className="col-6">
                            <div className="card mb-2 border-0 p-0">
                              <img src={`http://localhost:5000/${file.filePath}`} height="200" className="card-img-top img-responsive" alt="img"/>
                              </div>
                          </div>
                       )}
                      </div>
                </div>
              )}
           </div>
         </div>
       </div>
    </>
  );
}

export default App;
