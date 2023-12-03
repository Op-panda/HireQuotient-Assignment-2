import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import {
  FaAngleLeft,
  FaAngleDoubleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);

  const usersPerPage = 10;

  useEffect(() => {
    axios
      .get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json",
      )
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleCheckboxChange = (userId) => {
    const newSelectedRows = selectedRows.includes(userId)
      ? selectedRows.filter((id) => id !== userId)
      : [...selectedRows, userId];

    setSelectedRows(newSelectedRows);
  };

  const handleSelectAll = () => {
    const allUserIds = users.map((user) => user.id);
    setSelectedRows(
      selectedRows.length === allUserIds.length ? [] : allUserIds,
    );
  };

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter(
      (user) => !selectedRows.includes(user.id),
    );
    setUsers(updatedUsers);
    setSelectedRows([]);
  };

  const handleEdit = (user) => {
    const newName = prompt("Enter new name", user.name);
    const newEmail = prompt("Enter new email", user.email);
    const newRole = prompt("Enter new role", user.role);

    if (newName !== null || newEmail !== null || newRole !== null) {
      const updatedUsers = users.map((u) =>
        u.id === user.id
          ? {
              ...u,
              name: newName ?? u.name,
              email: newEmail ?? u.email,
              role: newRole ?? u.role,
            }
          : u,
      );

      setUsers(updatedUsers);
      setEditingUser(null);
    }
  };

  const handleEditChange = (e, field) => {
    const updatedUser = { ...editingUser, [field]: e.target.value };
    setEditingUser(updatedUser);
  };

  const handleDelete = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    setSelectedRows(selectedRows.filter((selectedId) => selectedId !== userId));
  };

  const renderTableRows = () => {
    return currentUsers.map((user) => (
      <tr
        key={user.id}
        className={selectedRows.includes(user.id) ? "selected" : ""}
      >
        <td>
          <input
            type="checkbox"
            onChange={() => handleCheckboxChange(user.id)}
            checked={selectedRows.includes(user.id)}
          />
        </td>
        <td>
          {editingUser && editingUser.id === user.id ? (
            <input type="text" value={editingUser.id} readOnly />
          ) : (
            user.id
          )}
        </td>
        <td>
          {editingUser && editingUser.id === user.id ? (
            <input
              type="text"
              value={editingUser.name}
              onChange={(e) => handleEditChange(e, "name")}
            />
          ) : (
            user.name
          )}
        </td>
        <td>
          {editingUser && editingUser.id === user.id ? (
            <input
              type="text"
              value={editingUser.email}
              onChange={(e) => handleEditChange(e, "email")}
            />
          ) : (
            user.email
          )}
        </td>
        <td>
          {editingUser && editingUser.id === user.id ? (
            <input
              type="text"
              value={editingUser.role}
              onChange={(e) => handleEditChange(e, "role")}
            />
          ) : (
            user.role
          )}
        </td>
        <td>
          <div className="flex">
            <FaRegEdit
              onClick={() => handleEdit(user)}
              style={{
                border: "0.5px solid #ddd",
                padding: "3px",
                color: "#4caf50",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            />
            <MdOutlineDeleteOutline
              onClick={() => handleDelete(user.id)}
              style={{
                color: "red",
                border: "0.5px solid #ddd",
                padding: "3px",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            />
          </div>
        </td>
      </tr>
    ));
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const renderPaginationButtons = () => {
    const pageNumbers = Array.from(
      { length: Math.ceil(filteredUsers.length / usersPerPage) },
      (_, index) => index + 1,
    );

    return (
      <div className="pagination-container">
        <FaAngleDoubleLeft
          onClick={() => setCurrentPage(1)}
          className="first-page"
        />
        <FaAngleLeft
          onClick={() => {
            if (currentPage > 1) setCurrentPage(currentPage - 1);
          }}
          className="previous-page"
        />

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={currentPage === number ? "active" : ""}
          >
            {number}
          </button>
        ))}

        <FaAngleRight
          onClick={() => {
            if (currentPage < pageNumbers.length)
              setCurrentPage(currentPage + 1);
          }}
          className="next-page"
        />
        <FaAngleDoubleRight
          onClick={() => setCurrentPage(pageNumbers.length)}
          className="last-page"
        />
      </div>
    );
  };

  return (
    <div className="container">
      <div className="header">
        <input
          type="text"
          className="search-bar"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <MdOutlineDeleteOutline
          style={{
            color: "white",
            border: "0.5px solid #ddd",
            padding: "3px",
            borderRadius: "5px",
            fontSize: "25px",
            backgroundColor: "red",
          }}
          onClick={handleDeleteSelected}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedRows.length === currentUsers.length}
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
      <div className="wrap">
        <div className="pagination">{renderPaginationButtons()}</div>
      </div>
    </div>
  );
};

export default App;
