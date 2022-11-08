import { Button, Alert, Form } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function UserForm(props) {

	const [name, setName] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("");

	const [errorMsg, setErrorMsg] = useState(""); // empty string '' = no error

	const navigate = useNavigate();

	const handleSubmit = (event) => {
		event.preventDefault();
		// validation
		if (name.trim().length !== 0) {
			let newUser;
			if (lastname.trim().length !== 0) {
				if (email.trim().length !== 0) {
					if (role.trim().length !== 0 && (role.toLowerCase() === "manager" || role.toLowerCase() === "officier")) {
						newUser = { name: name, lastname: lastname, email: email, password: password, role: role.toLowerCase() };
					} else {
						setErrorMsg("Error: Enter a valid role.");
						return;
					}
				} else {
					setErrorMsg("Error: Enter a valid email.");
					return;
				}
			} else {
				setErrorMsg("Error: Enter a valid lastname.");
				return;
			}
			props.addUser(newUser);
			navigate('/');
		} else {
			setErrorMsg("Error: Enter a valid name.");
		}
	};

	return (
		<>
			{errorMsg ? (
				<Alert variant="danger" onClose={() => setErrorMsg("")} dismissible>
					{errorMsg}
				</Alert>
			) : (
				false
			)}
			<Form onSubmit={handleSubmit}>
				<Form.Group>
					<Form.Label>Name</Form.Label>
					<Form.Control
						value={name}
						onChange={(ev) => setName(ev.target.value)}
					></Form.Control>
				</Form.Group>
				<Form.Group>
					<Form.Label>Lastname</Form.Label>
					<Form.Control
						value={lastname}
						onChange={(ev) => setLastname(ev.target.value)}
					></Form.Control>
				</Form.Group>
				<Form.Group>
					<Form.Label>Role</Form.Label>
					<Form.Control
						value={role}
						onChange={(ev) => setRole(ev.target.value)}
					></Form.Control>
				</Form.Group>
				<Form.Group>
					<Form.Label>Email</Form.Label>
					<Form.Control
						value={email}
						onChange={(ev) => setEmail(ev.target.value)}
					></Form.Control>
				</Form.Group>
				<Form.Group>
					<Form.Label>Password</Form.Label>
					<Form.Control
						value={password}
						onChange={(ev) => setPassword(ev.target.value)}
					></Form.Control>
				</Form.Group>
				<Button type='submit'>Save</Button>
				<Button onClick={props.cancel}>Cancel</Button>
			</Form>
		</>
	);
}

export { UserForm };