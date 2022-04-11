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
flex-grow: 1;
margin-right: var(--spacing-base);

font-size: var(--text-base);

cursor: pointer;
text-decoration: none;
border: none;
background:  pink;
color: darkred;
padding-top: 4px;
padding-bottom: 4px;

display: flex;
justify-content: center;
align-items: center;

& svg {
  width: 20px;
  margin-right: var(--spacing-small);
}

`;