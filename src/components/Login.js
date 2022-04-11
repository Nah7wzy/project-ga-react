import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../data/api";

import {
    FormContainer,
    Holder,
    InputForm,
    LoginButton,
    LoginContainer,
} from "../styles/Login.styled";

export default function Login() {
    const [inputs, setInputs] = useState({});
    const [passwordShown, setPasswordShown] = useState(false);

    const handleChange = (event) => {
        event.preventDefault();
        const name = event.target.name;
        const value = event.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await loginUser(inputs.password);
            // console.log("res has been returned", res);
            if (res)
                window.location.assign('/landing')
            else
                alert("Incorrect Username or password!")
        } catch (error) {
            console.log(error);
        }
    };

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    return (
        <>
            <Holder>
                <LoginContainer>
                    <h1>LOGIN</h1>
                    <FormContainer onSubmit={handleSubmit}>
                        <label>Email</label>
                        <InputForm
                            type="email"
                            name="email"
                            value={inputs.email || ""}
                            onChange={handleChange}
                        />
                        <br />
                        <label>Password</label>
                        <InputForm
                            type={passwordShown ? "text" : "password"}
                            name="password"
                            value={inputs.password || ""}
                            onChange={handleChange}
                        />
                        <label htmlFor="toggle">
                            <input
                                type="checkbox"
                                name="toggle"
                                id="toggle"
                                onChange={togglePassword}
                            />
                            Show Password
                        </label>
                        <br />



                        <LoginButton type="submit" onSubmit={handleSubmit} />
                    </FormContainer>
                </LoginContainer>
            </Holder>
        </>
    );
}
