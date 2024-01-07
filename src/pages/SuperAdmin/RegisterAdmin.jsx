import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

export default function RegisterAdmin() {
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [values, setValues] = useState({
    name: "",
    username: "", // Assuming username maps to email
    password: "",
    status: "admin", // Set a default status
    gender: "",
    image: null, // Use null initially
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setValues({ ...values, image: file }); // Update the 'image' property with the File object
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (values.password !== passwordConfirmation) {
      console.error("Password and password confirmation do not match");
      return;
    }

    try {
      // Create a FormData object and append the image file
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("username", values.username);
      formData.append("password", values.password);
      formData.append("status", values.status);
      formData.append("gender", values.gender);
      formData.append("profileImage", values.image); // Append the File object

      console.log("FormData:", formData);

      const response = await axios.post(
        "https://smartexamhub.vercel.app/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
          },
        }
      );

      if (response.data.Status === "Success") {
        setRegistrationStatus("success");
        setTimeout(() => {
          // navigate("/Log-in");
        }, 2000);
      } else {
        setRegistrationStatus("error");
      }
    } catch (err) {
      console.error(err); // Log the error
      setRegistrationStatus("error");
    }
  };

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  
  return (
    <div className="flex dark:bg-black w-full">
      {registrationStatus === "success" && (
        <div
          className=" flex w-1/2 mx-auto rounded-lg bg-green-200 px-6 py-2 text-base text-green-500 justify-center items-center"
          role="alert"
        >
          Registration successful! Redirecting to login page...
        </div>
      )}
      {registrationStatus === "error" && (
        <div
          className="mb-4 rounded-lg bg-red-400 px-6 py-5 text-base text-red-500"
          role="alert"
        >
          Registration failed. Please try again.
        </div>
      )}
      <div className="flex dark:bg-black pt-3 w-full sm:justify-center sm:pt-0 bg-gray-50 shadow-sm shadow-black">
        <div className="px-6 py-4 w-2/3 mt-3 overflow-hidden items-center bg-white dark:bg-slate-900 shadow-md sm:max-w-lg sm:rounded-lg">
          <form
            className="w-full"
            onSubmit={handleRegister}
            encType="multipart/form-data"
          >
            <div className="flex flex-row items-start justify-start">
              {/* Left Column for Name and Email */}
              <div className="w-2/3 p-1">
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium dark:text-white text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={(e) =>
                      setValues({ ...values, name: e.target.value })
                    }
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm shadow-indigo-700/50 ring-1 ring-inset sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="mt-4 lg:w-[300px] md:w-52 sm:w-32 md:text-sm">
                <Select
                  id="gender"
                  name="gender"
                  value={genderOptions.find(
                    (option) => option.value === values.gender
                  )} // Set the value based on the 'value' property
                  onChange={(selectedOption) =>
                    setValues({ ...values, gender: selectedOption.value })
                  } // Update values.gender
                  options={genderOptions}
                  isSearchable
                  placeholder="Select Gender"
                />
                </div>
              </div>
              {/* Right Column for Image Upload */}
              <div className="w-1/3">
                <div className="bg-white ml-2 p-1">
                  <label
                    htmlFor="profileImage"
                    className="w-32 h-32 rounded-full overflow-hidden cursor-pointer"
                  >
                    <img
                      src={selectedImage || "default-profile-image.jpg"}
                      alt="Upload Image of your ID to verify"
                      className="w-full h-28 text-md object-cover"
                    />
                  </label>
                  <div className="mb-0 hidden dark:text-[blue]">
                    <input
                      type="file"
                      accept="image/*"
                      id="profileImage"
                      name="profileImage"
                      className="w-15 text-[11px]"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-start mt-2">
              <div className="flex flex-col items-start w-full">
                <label
                    htmlFor="email"
                    className="block text-sm font-medium dark:text-white text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="username"
                    value={values.username}
                    onChange={(e) =>
                      setValues({ ...values, username: e.target.value })
                    }
                    className="block w-full rounded-md py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
              </div>
            </div>
            <div className="mt-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-white undefined"
              >
                Password
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={(e) =>
                    setValues({ ...values, password: e.target.value })
                  }
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {values.password.length < 8 && values.password.length > 0 && (
                  <p className="text-red-500 text-sm mt-1">
                    Password must be at least 8 characters long.
                  </p>
                )}
              </div>
            </div>
            <div className="mt-2">
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium dark:text-white text-gray-700 undefined"
              >
                Confirm Password
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="password"
                  name="password_confirmation"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <a href="/" className="text-xs text-purple-600 hover:underline">
              Forget Password?
            </a>
            <div className="flex items-center mt-4">
              <button
                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 
                transform bg-purple-700 rounded-md focus:outline-none 
                focus:bg-purple-600 shadow-md hover:shadow-indigo-500/30"
                type="submit"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
