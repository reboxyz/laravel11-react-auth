import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useEffect, useState } from "react";

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        id: null,
        name: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        if (id) {
            setLoading(true);
            axiosClient
                .get(`/users/${id}`)
                .then(({ data }) => {
                    console.log("data", data);
                    setLoading(false);
                    setUser(data.data);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        }
    }, [id]);

    const onSubmit = (ev) => {
        ev.preventDefault();
        if (user.id) {
            axiosClient
                .put(`/users/${user.id}`, user)
                .then(() => {
                    navigate("/users");
                })
                .catch((err) => {
                    console.log(err);
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient
                .post("/users", user)
                .then(() => {
                    navigate("/users");
                })
                .catch((err) => {
                    console.log(err);
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }
    };

    if (loading) {
        return (
            <div className="card animated fadeInDown">
                <div className="text-center">Loading...</div>;
            </div>
        );
    }

    return (
        <>
            {user.id && <h1>Update User: {user.name}</h1>}
            {!user.id && <h1>New User</h1>}
            <div className="card animated fadeInDown">
                {errors && (
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}

                <form onSubmit={onSubmit}>
                    <input
                        value={user.name}
                        onChange={(ev) =>
                            setUser({ ...user, name: ev.target.value })
                        }
                        placeholder="Name"
                    />
                    <input
                        value={user.email}
                        onChange={(ev) =>
                            setUser({ ...user, email: ev.target.value })
                        }
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        onChange={(ev) =>
                            setUser({ ...user, password: ev.target.value })
                        }
                        placeholder="Password"
                    />
                    <button className="btn">Save</button>
                </form>
            </div>
        </>
    );
};

export default UserForm;
