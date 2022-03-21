import styled from 'styled-components';

export const CarContainer = styled.div`
  display: grid;
  gap: 10px 10px;
  grid-template-columns: auto auto auto;
  justify-content: space-evenly;
`;

export const Car = styled.div`
  height: auto;
  width: 300px;
  background-color: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const CarImage = styled.img`
    align-self: center;
    justify-self: center;
`;

export const RemoveCarButton = styled.button`
    background-color: #ff0000;
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid palevioletred;
    border-radius: 3px;
    /* align-self: flex-end; */
    justify-self: center;
`;