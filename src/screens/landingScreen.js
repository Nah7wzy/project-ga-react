import React, { useState, useEffect } from 'react';
import '../App.css'
// import { Car, CarContainer, CarImage, RemoveCarButton } from '../styles/CarCard.styled';
import Car from "../components/Car";
import EmptyState from "../components/EmptyState";


import { deleteCar, getMultipleFiles, getCarsAPI } from '../data/api';
import FileUploadScreen from './uploadScreen';

import {
    Pagination,
    BackToTop,
  } from "../styles/Herosection.style";


function LandingPage() {
    const [cars, setCars] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [filterRules, setFilterRules] = useState({});
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [multipleFiles, setMultipleFiles] = useState([]);

    const removeCar = async (carId, public_id) => {

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
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

    return function cleanup() {
      window.removeEventListener("resize", () =>
        setWindowWidth(window.innerWidth)
      );
    };
  }, []);
    useEffect(() => {
        const getCars = async () => {
          // To resume loader
          setCars(null);
    
          try {
            const carsList = await getCarsAPI(pageNumber, filterRules);
            setCars(carsList);
          } catch (error) {
            console.log(error);
          }
        };
    
        getCars();
      }, [pageNumber, filterRules]);

    return (

        <>
        <div className="container">
        <h3 className="text-primary font-weight-bolder border-bottom text-center">Upload Car</h3>
        <FileUploadScreen getMultiple={() => getMultipleFilesList()} />
      </div>
                  {cars && (
        <>
          {cars.data.length ? (
            <>
              <Car
                cars={cars.data}
                sortUtil={filterRules}
                updateSortUtil={setFilterRules}
                removeCar={removeCar}
              />
              {windowWidth < 768 && (
                <BackToTop
                  onClick={() =>
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    })
                  }
                />
              )}
              <Pagination>
                {[
                  ...new Array(
                    Math.ceil(cars.amountOfCars / cars.itemsPerPage)
                  ),
                ].map((item, index) => {
                  return (
                    <button
                      key={index}
                      className={pageNumber === index + 1 ? "active-page" : ""}
                      onClick={() => {
                        setPageNumber(index + 1);
                      }}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </Pagination>
            </>
          ) : (
            <EmptyState />
          )}
        </>
      )}
        </>
    );
}

export default LandingPage;