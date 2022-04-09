import styled from 'styled-components';

export const CarContainer = styled.div`
  display: grid;
  gap: 10px 10px;
  grid-template-columns: auto auto auto;
  justify-content: space-evenly;
  
  @media screen and (max-width: 750px) and (min-width: 500px) {
    grid-template-columns: auto auto
  }
  @media screen and (max-width: 500px) {
    grid-template-columns: auto
  }
`;

export const Car = styled.div`
  height: 100%;
  width: 100%;
  background-color: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const CarImage = styled.img`
width: 100%;
height: auto;

    align-self: center;
    justify-self: center;
`;

export const RemoveCarButton = styled.button`
    background-color: #808080;
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid white;
    border-radius: 3px;
    /* align-self: flex-end; */
    justify-self: center;
`;