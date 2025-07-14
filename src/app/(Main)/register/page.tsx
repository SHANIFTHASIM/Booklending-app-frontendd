"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

interface FormData {
  username: string;
  email: string;
  password: string;
}

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8000/books/api/register/", formData);
      router.push("/login");
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err.response) === 'object' &&
        err.response !== null &&
        'data' in (err.response as object)
      ) {
        // TypeScript type guard for error with response.data
        const errorWithResponse = err as { response: { data?: unknown }; message?: string };
        console.error("Registration error:", errorWithResponse.response.data || errorWithResponse.message);
      } else if (err instanceof Error) {
        console.error("Registration error:", err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black rounded-lg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create an account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input
            name="username"
            type="text"
            required
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="block w-full px-3 py-2 mt-3 border border-gray-300 rounded-md"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="block w-full px-3 py-2 mt-3 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full mt-5 py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            Register
          </button>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
