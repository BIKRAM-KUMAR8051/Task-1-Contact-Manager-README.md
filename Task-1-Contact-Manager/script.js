
const API = "http://localhost:3000/api/contacts";

const form = document.getElementById("contactForm");
const contactList = document.getElementById("contactList");
const message = document.getElementById("message");

async function loadContacts() {
  try {
    const response = await fetch(API);
    if (!response.ok) throw new Error("Failed to load contacts");

    const contacts = await response.json();
    contactList.innerHTML = "";

    message.textContent = contacts.length
      ? ""
      : "No contacts added yet.";

    contacts.forEach(contact => {
      const div = document.createElement("div");
      div.className = "contact";

      const details = document.createElement("div");

      const name = document.createElement("strong");
      name.textContent = contact.name;

      const email = document.createElement("p");
      email.textContent = contact.email;

      const phone = document.createElement("p");
      phone.textContent = contact.phone;

      details.append(name, email, phone);

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete";
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => deleteContact(contact.id);

      div.append(details, deleteBtn);
      contactList.appendChild(div);
    });

  } catch (error) {
    message.textContent = "Server connection failed!";
  }
}

// Add Contact
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const contact = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim()
  };

  try {
    const response = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(contact)
    });

    if (!response.ok) throw new Error("Add failed");

    form.reset();
    loadContacts();

  } catch (error) {
    alert("Unable to add contact!");
  }
});

// Delete Contact
async function deleteContact(id) {
  try {
    const response = await fetch(`${API}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) throw new Error("Delete failed");

    loadContacts();

  } catch (error) {
    alert("Unable to delete contact!");
  }
}

loadContacts();
