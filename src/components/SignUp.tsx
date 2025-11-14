import { useCallback, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

import { authClient } from "../lib/auth-client";

export function SignUpForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
  }>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSignup = useCallback<React.FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault();
      if (loading) return;

      setLoading(true);

      await authClient.signUp.email(
        {
          email: formData.email,
          password: formData.password,
          name: formData.name,
        },
        {
          onSuccess: () => {
            navigate("/");
          },
          onError: (ctx) => {
            // display the error message
            alert(ctx.error.message);
            setLoading(false);
          },
        },
      );
    },
    [formData.email, formData.name, formData.password, loading, navigate],
  );

  return (
    <form onSubmit={onSignup}>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Signup</legend>

        <label className="label">Email</label>
        <input
          name="email"
          type="email"
          className="input"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <label className="label">Display Name</label>
        <input
          name="name"
          type="text"
          className="input"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <label className="label">Password</label>
        <input
          name="password"
          type="password"
          className="input"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button className="btn btn-neutral mt-4" disabled={loading}>
          Signup
        </button>
      </fieldset>
    </form>
  );
}
