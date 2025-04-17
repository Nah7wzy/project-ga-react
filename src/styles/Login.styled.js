import styled from "styled-components";

export const Holder = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #eef1f5 100%);
`;

export const LoginContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  height: auto;
  width: 25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 2.5rem 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  h2 {
    color: #333;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    font-weight: 600;
  }

  @media (max-width: 480px) {
    width: 90%;
    max-width: 25rem;
  }
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;

  label {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .error-message {
    color: #f03d4e;
    font-size: 0.8rem;
    margin-top: -0.6rem;
    margin-bottom: 0.8rem;
  }

  .show-password {
    display: flex;
    align-items: center;
    margin-top: 0.2rem;
    margin-bottom: 1rem;
    cursor: pointer;

    input {
      margin-right: 0.5rem;
      cursor: pointer;
    }

    span {
      font-size: 0.85rem;
      color: #666;
    }
  }
`;

export const InputForm = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: #f9f9fa;
  margin-bottom: 1rem;
  border-radius: 6px;
  outline: 0;
  border: 1px solid #e1e1e1;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.15);
  }

  &::placeholder {
    color: #aaa;
  }
`;

export const LoginButton = styled.input`
  width: 100%;
  padding: 12px 16px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  text-transform: uppercase;
  background: #4a90e2;
  border: none;
  border-radius: 6px;
  outline: 0;
  cursor: pointer;
  margin-top: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background: #3a7bc8;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background: #b3d1f5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;
