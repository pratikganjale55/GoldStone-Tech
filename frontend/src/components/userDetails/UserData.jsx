import React, { useEffect, useState } from "react";
import axios from "axios";



const UserData = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/fetch-store");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const userId = editingUser.id;
    const updatedUser = {
      id: editingUser.id,
      name: e.target.name.value,
      email: e.target.email.value,
      gender: e.target.gender.value,
      status: e.target.status.value,
    };
    try {
      const response = await axios.put(
        `http://localhost:8080/users/${userId}`,
        updatedUser
      );
      console.log("User updated:", response.data);
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    
  };

  const handleCsvDownload = async () => {
    try {
      const response = await fetch("http://localhost:8080/export-to-csv");
      const blob = await response.blob();

      // Create a temporary anchor element to trigger the download
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "user_master.csv";
      downloadLink.click();
    } catch (error) {
      console.error("Error while download csv file:", error);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div>
      <div className="container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.gender}</td>
                <td>{user.status}</td>
                <td>
                  <button onClick={() => handleEditClick(user)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editingUser && (
          <div className="edit-popup">
            <h3>Edit User</h3>
            <form onSubmit={handleUpdateUser}>
              <input type="text" name="name" defaultValue={editingUser.name} />
              <input
                type="email"
                name="email"
                defaultValue={editingUser.email}
              />
              <input
                type="text"
                name="gender"
                defaultValue={editingUser.gender}
              />
              <input
                type="text"
                name="status"
                defaultValue={editingUser.status}
              />
              <br/>
              <br/>
              <button type="submit">Save</button> {" "}
              <button type="button" onClick={handleCancelEdit}>
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
      <div className="masterCSV">
        <button onClick={handleCsvDownload}>Download Master CSV</button>
      </div>
     
    </div>
  );
};

export default UserData;
