
const express = require("express");
const app = express();

app.use(express.json());

let contacts = [];
let nextId = 1;

// Frontend
app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Contact Manager</title>
        <style>
            body {
                font-family: Arial;
                background: #f1f5f9;
                padding: 30px;
                text-align: center;
            }
            .container {
                background: white;
                max-width: 500px;
                margin: auto;
                padding: 25px;
                border-radius: 12px;
            }
            input {
                padding: 12px;
                margin: 7px;
                width: 85%;
            }
            button {
                padding: 10px 20px;
                background: #2563eb;
                color: white;
                border: none;
                cursor: pointer;
                border-radius: 5px;
            }
            .contact {
                background: #e2e8f0;
                padding: 12px;
                margin: 10px;
                border-radius: 8px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Contact Manager</h1>
            <p>Manage your contacts easily</p>

            <input id="name" placeholder="Enter Name">
            <input id="email" placeholder="Enter Email">
            <input id="phone" placeholder="Enter Phone">

            <button onclick="addContact()">Add Contact</button>

            <h2>My Contacts</h2>
            <div id="contacts"></div>
        </div>

        <script>
            async function loadContacts() {
                const response = await fetch('/api/contacts');
                const contacts = await response.json();

                document.getElementById('contacts').innerHTML =
                    contacts.map(c => \`
                    <div class="contact">
                        <b>\${c.name}</b><br>
                        \${c.email}<br>
                        \${c.phone}<br>
                        <button onclick="deleteContact(\${c.id})">
                            Delete
                        </button>
                    </div>
                    \`).join('');
            }

            async function addContact() {
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;

                if (!name || !email || !phone) {
                    alert('Please fill all fields');
                    return;
                }

                const response = await fetch('/api/contacts', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({name, email, phone})
                });

                if (response.ok) {
                    document.getElementById('name').value = '';
                    document.getElementById('email').value = '';
                    document.getElementById('phone').value = '';
                    loadContacts();
                } else {
                    alert('Could not add contact');
                }
            }

            async function deleteContact(id) {
                await fetch('/api/contacts/' + id, {
                    method: 'DELETE'
                });
                loadContacts();
            }

            loadContacts();
        </script>
    </body>
    </html>
    `);
}

// Get contacts
app.get('/api/contacts', (req, res) => {
    res.json(contacts);
});

// Add contact
app.post('/api/contacts', (req, res) => {
    const {name, email, phone} = req.body;

    if (!name || !email || !phone) {
        return res.status(400).json({message: 'All fields required'});
    }

    const contact = {id: nextId++, name, email, phone};
    contacts.push(contact);

    res.status(201).json(contact);
});

// Delete contact
app.delete('/api/contacts/:id', (req, res) => {
    const id = Number(req.params.id);
    contacts = contacts.filter(c => c.id !== id);
    res.json({message: 'Contact deleted'});
});

// Start server
app.listen(5000, () => {
    console.log('Server running at http://localhost:5000');
});
