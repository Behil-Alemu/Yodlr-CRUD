// Fetch the user data from the server
fetch('/users')
	.then((response) => response.json())
	.then((users) => {
		// Loop through the users and add them to the table
		const userList = document.getElementById('userList');
		users.forEach((user) => {
			const row = document.createElement('tr');
			const firstNameCell = document.createElement('td');
			const lastNameCell = document.createElement('td');
			const emailCell = document.createElement('td');
			const stateCell = document.createElement('td');
			const adminActivateCell = document.createElement('td');
			const adminActivateButton = document.createElement('button');

			firstNameCell.textContent = user.firstName;
			lastNameCell.textContent = user.lastName;
			emailCell.textContent = user.email;
			stateCell.textContent = user.state;
			adminActivateButton.textContent = user.state === 'active' ? 'Deactivate' : 'Activate';

			row.appendChild(firstNameCell);
			row.appendChild(lastNameCell);
			row.appendChild(emailCell);
			row.appendChild(stateCell);
			adminActivateCell.appendChild(adminActivateButton);
			row.appendChild(adminActivateCell);
			userList.appendChild(row);

			adminActivateButton.addEventListener('click', () => {
				const newState = user.state === 'active' ? 'pending' : 'active';

				fetch(`/users/${user.id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						id: user.id,
						email: user.email,
						firstName: user.firstName,
						lastName: user.lastName,
						state: newState
					})
				})
					.then((response) => {
						if (response.ok) {
							stateCell.textContent = newState;
							adminActivateButton.textContent = newState === 'active' ? 'Deactivate' : 'Activate';
						}
					})
					.then(() => {
						location.reload();
					})
					.catch((error) => console.error(error));
			});
		});
	})
	.catch((error) => console.error(error));
