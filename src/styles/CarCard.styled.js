import styled from "styled-components";

export const CarContainer = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
  margin: 0 auto;
  width: 100%;

  @media screen and (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 650px) {
    grid-template-columns: 1fr;
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

export const EditCarButton = styled.button`
  flex-grow: 1;
  margin-right: var(--spacing-base);
  font-size: var(--text-base);
  cursor: pointer;
  text-decoration: none;
  border: none;
  background: #e6f7ff;
  color: #0066cc;
  padding: 8px 12px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #cceeff;
  }

  & svg {
    width: 20px;
    margin-right: var(--spacing-small);
  }
`;

export const RemoveCarButton = styled.button`
  flex-grow: 1;
  margin-right: var(--spacing-base);
  font-size: var(--text-base);
  cursor: pointer;
  text-decoration: none;
  border: none;
  background: pink;
  color: darkred;
  padding: 8px 12px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #ffcccb;
  }

  & svg {
    width: 20px;
    margin-right: var(--spacing-small);
  }
`;
