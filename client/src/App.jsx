import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from './api';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', age: '', email: '' });
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await getUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleCreate = async () => {
    const { data } = await createUser(newUser);
    setUsers([...users, data]);
    setNewUser({ name: '', age: '', email: '' });
  };

  const handleUpdate = async (id) => {
    const { data } = await updateUser(id, editUser);
    setUsers(users.map(user => (user._id === id ? data : user)));
    setEditUser(null);
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    setUsers(users.filter(user => user._id !== id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">CRUD Application</h1>

      <div className="mb-6 p-4 border rounded shadow-md bg-white">
        <h2 className="text-xl font-semibold mb-4">Create User</h2>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="block w-full mb-2 p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Age"
          value={newUser.age}
          onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
          className="block w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="block w-full mb-2 p-2 border rounded"
        />
        <button
          onClick={handleCreate}
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add User
        </button>
      </div>

      <div className="mb-6 p-4 border rounded shadow-md bg-white">
        <h2 className="text-xl font-semibold mb-4">Users List</h2>
        <ul>
          {users.map(user => (
            <li key={user._id} className="flex justify-between items-center mb-2 p-2 border-b">
              <span>{user.name} - {user.age} - {user.email}</span>
              <div>
                <button
                  onClick={() => setEditUser(user)}
                  className="py-1 px-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="py-1 px-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {editUser && (
        <div className="p-4 border rounded shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-4">Edit User</h2>
          <input
            type="text"
            placeholder="Name"
            value={editUser.name}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
            className="block w-full mb-2 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Age"
            value={editUser.age}
            onChange={(e) => setEditUser({ ...editUser, age: e.target.value })}
            className="block w-full mb-2 p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={editUser.email}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            className="block w-full mb-2 p-2 border rounded"
          />
          <button
            onClick={() => handleUpdate(editUser._id)}
            className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Update User
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
