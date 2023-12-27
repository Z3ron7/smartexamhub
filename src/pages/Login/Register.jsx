import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { RadioGroup } from "@headlessui/react";
import Select from 'react-select';
import RP from '../../assets/images/1.jpg'

export default function Register() {
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [schoolIdError, setSchoolIdError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    username: "", // Assuming username maps to email
    password: "",
    status: "student", // Set a default status
    gender: "",
    school_id: "",
    image: null, // Use null initially
    isVerified: 0,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result); // Set the data URL as the preview
        setValues({ ...values, image: file });
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
  
    setLoading(true); // Show loading spinner
    
    if (values.password.length < 8 ) {
      console.error("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }
    if (values.password !== passwordConfirmation) {
      console.error("Password and confirmation password do not match.");
      setLoading(false); // Hide loading spinner
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("username", values.username);
      formData.append("password", values.password);
      formData.append("status", values.status);
      formData.append("gender", values.gender);
      formData.append("school_id", values.school_id);
      formData.append("profileImage", values.image);
      formData.append("isVerified", values.isVerified);
  
      console.log("FormData:", formData);
  
      const response = await axios.post("http://localhost:3001/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Backend Response:", response.data);
  
      if (response.data.Status === "Success") {
        setRegistrationStatus("success");
        setAlertMessage("Registration successful! Redirecting to the login page...");
        setTimeout(() => {
          navigate("/Log-in");
        }, 2000);
      } else if (response.data.Error === "Username already exists") {
        setRegistrationStatus("error");
        setUsernameError("Username already exists.");

      } else if (response.data.Error === "School ID already exists") {
        setRegistrationStatus("error");
        setSchoolIdError("School ID already exists.");
        setUsernameError("");
      } else {
        console.error("Registration failed:", response.data.Error);
        setRegistrationStatus("error");
        setAlertMessage("Registration failed. Please try again!");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setAlertMessage("Registration failed. Please try again.");
    } finally {
      setTimeout(() => {
        // Reset the loading state to false after 2 seconds
        setLoading(false);
      }, 2000);
    }
  };
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 170, // Adjust the width as needed
    }),
  };
  return (
    <div className="bg-white" style={{ backgroundImage: `url(${RP})`, backgroundSize: "100% 100%", backgroundPosition: "center", display: "flex", flexDirection: "column", alignItems: "center", height: "100vh" }}>
      {registrationStatus === "success" && (
        <div
          className=" flex w-1/2 mx-auto rounded-lg bg-green-100 px-6 py-3 text-base text-green-700 justify-center items-center"
          role="alert"
        >
          Registration successful! Redirecting to login page...
        </div>
      )}
      {registrationStatus === "error" && (
        <div
          className=" rounded-lg bg-error-100 px-6 py-3 text-base text-red-500"
          role="alert"
        >
          {alertMessage}
        </div>
      )}
      <div className="items-center mx-auto justify-center">
          <a href="/">
            <h3 className="text-2xl lg:text-4xl font-bold font-mono text-white">Account Registration</h3>
          </a>
        </div>
        <div className="px-2 lg:px-6 py-4 mt-6 overflow-hidden items-center bg-transparent shadow-lg shadow-black w-[360px] lg:w-[510px]  sm:rounded-lg">
      <form className="w-full" onSubmit={handleRegister} encType="multipart/form-data">
      <div className="flex flex-row items-start justify-start">
  {/* Left Column for Name and Email */}
  <div className="w-2/3 p-1">
    <div className="mb-4">
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
        Name
      </label>
      <input
        type="text"
        name="name"
        value={values.name}
        onChange={(e) => setValues({ ...values, name: e.target.value })}
        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
        required
      />
    </div>
    <div className="mt-4">
  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
    Email
  </label>
  <input
    type="email"
    name="username"
    value={values.username}
    onChange={(e) => {
      setValues({ ...values, username: e.target.value })
      setUsernameError("");
    }}
    className="block w-full rounded-md py-1.5 px-2 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
    required
  />
  {registrationStatus === "error" && (
    <div className="rounded-lg px-2 text-sm text-red-500" role="alert">
      {usernameError}
    </div>
  )}
</div>
  </div>

  {/* Right Column for Image Upload */}
  <div className="w-1/3">
    <div className="bg-transparent p-1 border-1 border-black shadow-sm shadow-black">
      <label htmlFor="profileImage" className="w-32 h-28 rounded-full overflow-hidden cursor-pointer">
          <img
            src={selectedImage || "default-profile-image.jpg"}
            alt="Click to Upload Image for verification"
            className="w-full h-32 object-contain text-sm text-white text-center justify-center bg-transparent"
          />
        </label>
      <div className="mb-0">
        <input
          type="file"
          accept="image/*"
          id="profileImage"
          name="profileImage"
          className="hidden w-15 text-[11px]"
          onChange={handleImageChange}
        />
      </div>
    </div>
  </div>
</div>

            <div className="flex items-start mt-4">
            <div className="flex flex-col items-start mr-2 text-sm lg:text-base">
  <Select
    id="gender"
    name="gender"
    value={genderOptions.find((option) => option.value === values.gender)} // Set the value based on the 'value' property
    onChange={(selectedOption) => setValues({ ...values, gender: selectedOption.value })} // Update values.gender
    options={genderOptions}
    styles={customStyles}
    isSearchable
    placeholder="Select Gender"
    required
  />
</div>

            <RadioGroup value={values.status} onChange={status => setValues({ ...values, status })}>
              <div className=" lg:flex items-start lg:mt-3 mr-3 mb-3">
                <RadioGroup.Label className="block text-sm text-center font-medium text-gray-700">
                  Status:
                </RadioGroup.Label>
                <div className="flex items-center lg:ml-4 space-x-4">
                  <RadioGroup.Option value="student">
                    {({ checked }) => (
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <div
                          className={`w-5 h-5 border rounded-full ${
                            checked ? "bg-blue-500" : "bg-white border-gray-400"
                          } transition-colors`}
                        ></div>
                        <div
                          className={`text-sm ${
                            checked ? "text-blue-500" : "text-gray-800"
                          }`}
                        >
                          Student
                        </div>
                      </label>
                    )}
                  </RadioGroup.Option>
                  <RadioGroup.Option value="alumni">
                    {({ checked }) => (
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <div
                          className={`w-5 h-5 border rounded-full ${
                            checked ? "bg-blue-500" : "bg-white border-gray-400"
                          } transition-colors`}
                        ></div>
                        <div
                          className={`text-sm ${
                            checked ? "text-blue-500" : "text-gray-800"
                          }`}
                        >
                          Alumni
                        </div>
                      </label>
                    )}
                  </RadioGroup.Option>
                </div>
              </div>
            </RadioGroup>
            </div>
            <div className="mt-4">
  <label htmlFor="school_id" className="block text-sm font-medium text-gray-700">
    School ID
  </label>
  <input
    type="text"
    name="school_id"
    value={values.school_id}
    onChange={(e) => {
      setValues({ ...values, school_id: e.target.value });
      // Clear the error when the input changes
      setSchoolIdError("");
    }}
    className="block w-full rounded-md py-1.5 px-2 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
    placeholder="ex. 2020-0077"
    required
  />
  {registrationStatus === "error" && (
    <div className="rounded-lg px-2 text-sm text-red-500" role="alert">
      {schoolIdError}
    </div>
  )}
</div>

            <div className="mt-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 undefined"
              >
                Password
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={(e) => setValues({ ...values, password: e.target.value })}
                  className="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm sm:text-sm sm:leading-6"
                  required
                />
                {values.password.length < 8 && values.password.length > 0 && (
                  <p className="text-red-500 text-sm mt-1">Password must be at least 8 characters long.</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-gray-700 undefined"
              >
                Confirm Password
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="password"
                  name="password_confirmation"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm sm:text-sm sm:leading-6"
                  required
                />
                {values.password !== passwordConfirmation && passwordConfirmation.length > 0 && (
      <p className="text-red-500 text-sm mt-1">Password and confirmation password do not match.</p>
    )}
              </div>
            </div>
        
            <div className="flex items-center mt-4">
        <button
          className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
          type="submit"
          disabled={loading} // Disable the button when loading
        >
          {loading ? (
      <span className="mr-2">
        <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      </span>
    ) : null}
    {loading ? 'Processing...' : 'Register'}
        </button>
      </div>
            
          </form>
          <div className="mt-4 justify-center text-center text-white">
            Already have an account?{" "}
            <span>
              <Link to="/Log-in" className="text-blue-800 hover:underline">
                Log in
              </Link>
            </span>
          </div>
        </div>
      </div>
  );
}
