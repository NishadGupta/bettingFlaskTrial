import { useState } from "react"

export const Login = ({ userData, setUserData }) => {
    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        await fetch('https://bettingtrial1.azurewebsites.net/loginPlayer', {
            mode: 'cors',
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json",
            }, method: form.method, body: JSON.stringify(formJson)
        })
            .then((response) => response.json())
            .then(async (response) => {
                if (response.uuid) {
                    setUserData(response);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        //calluserData

    }
    return (<>
        <form method="post" onSubmit={handleSubmit}>
            <label>
                Email: <input name="emailAddress" type="text" />
            </label>
            <hr />
            <label>
                Password: <input name="password" type="password" />
            </label>
            <hr />
            <button type="reset">Reset form</button>
            <button type="submit">Submit form</button>
        </form>
    </>)
}