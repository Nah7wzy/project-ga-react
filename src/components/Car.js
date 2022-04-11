
import {
  CarsWrapper,
  CarDetails,
  CarTitle,
  CarContainer,
  CarImageContainer,
  CarImage,
  CarDate,
  CarDescription,
  CarDescriptionGroup,
  CarFooter,
} from "../styles/Car.style";

import {
  RemoveCarButton
} from "../styles/CarCard.styled";


function Car({ cars, sortUtil, updateSortUtil, removeCar }) {

  return (
    <>
      {/* // cars.length on it's own displays 0 when empty, !! makes it boolean */}
      {!!cars.length && (
        <>
          <CarsWrapper>
            <select
              name="sort"
              id=""
              defaultValue="dcreatedAt"
              value={sortUtil.sort}
              onChange={(e) => {
                sortUtil.sort = e.target.value;
                sortUtil.sortDirection = e.target.value.startsWith("a")
                  ? 1
                  : -1;

                updateSortUtil({ ...sortUtil });
              }}
            >
              <option value="dyear">Newest Year</option>
              <option value="ayear">Oldest Year</option>
              <option value="dcreatedAt">Recently Added</option>
              <option value="dprice">Highest Price</option>
              <option value="aprice">Lowest Price</option>
            </select>

            {cars.map(
              (
                {
                  files: images,
                  make,
                  model,
                  price,
                  transmission,
                  year,
                  pids,
                  _id
                },
                index
              ) => {
                return (
                  <CarContainer key={index}>
                    <CarImageContainer>
                      <CarImage src={images[0]} />
                    </CarImageContainer>
                    <CarDetails>
                      <CarTitle>
                        {make} {model.toLowerCase()}
                      </CarTitle>
                      <CarDate>{year}</CarDate>
                      <CarDescription>
                        
                        <CarDescriptionGroup>
                          <div>
                            
                            <p>
                              {new Intl.NumberFormat("en-GB", {
                                style: "currency",
                                currency: "ETB",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }).format(price)}
                            </p>
                          </div>
                          <div>
                            
                            <p>{transmission || "N/A"}</p>
                          </div>
                         
                        </CarDescriptionGroup>
                      </CarDescription>
                      <CarFooter>
                        <RemoveCarButton onClick={()=>removeCar(_id, pids)}>Remove Car</RemoveCarButton>
                        
                      </CarFooter>
                    </CarDetails>
                  </CarContainer>
                );
              }
            )}
          </CarsWrapper>
        </>
      )}
    </>
  );
}

export default Car;

