import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import { Link } from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        setLoading(true);
        axiosClient
            .get("/users")
            .then(({ data }) => {
                setUsers(data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };

    const onDeleteClick = (user) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }
        axiosClient
            .delete(`/users/${user.id}`)
            .then(() => {
                getUsers();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Users</h1>
                <Link className="btn-add" to="/users/new">
                    Add new
                </Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading && (
                        <tbody>
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    )}
                    {!loading && (
                        <tbody>
                            {users
                                ? users.map((u) => (
                                      <tr key={u.id}>
                                          <td>{u.id}</td>
                                          <td>{u.name}</td>
                                          <td>{u.email}</td>
                                          <td>
                                              <Link
                                                  className="btn-edit"
                                                  to={"/users/" + u.id}
                                              >
                                                  Edit
                                              </Link>
                                              &nbsp;
                                              <button
                                                  className="btn-delete"
                                                  onClick={() =>
                                                      onDeleteClick(u)
                                                  }
                                              >
                                                  Delete
                                              </button>
                                          </td>
                                      </tr>
                                  ))
                                : null}
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
};

export default Users;
