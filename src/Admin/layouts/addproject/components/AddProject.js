import React, { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDBox from "Admin/components/MDBox";
import MDSnackbar from "Admin/components/MDSnackbar";
import { FormControl, InputLabel, Select } from "@mui/material";
import { Api } from "Api/Api";
import { useNavigate } from "react-router-dom";
import Document_img from "assets/images/doc.png";
import circle_plus_img from "assets/images/plus.png";

function AddProjectForm() {
  const [name, setName] = useState("");
  const [project_id, setProject_id] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [start_date, setStart_date] = useState("");
  const [end_date, setEndDate] = useState("");
  const [developers_id, setDevelopers_id] = useState("");
  const [bider_id, setBider_id] = useState("");
  const [category_id, setCategory_id] = useState("");
  const [attemant_file, setAttemant_file] = useState("");
  const [profile_id, setProfile_id] = useState("");
  const [client_id, setClient_id] = useState("");
  const [sreach_client_value, setSreach_client_value] = useState("");
  const [Client_sreach_fild, Client_Serach_Filed] = useState("");
  const [developers_message, setDevelopers_message] = useState("");
  const [clientname, setclientName] = useState("");
  const [clientusername, setClientUsername] = useState("");
  const [clientemail, setClientemail] = useState("");
  const [clientphone, setClientPhone] = useState("");
  const [clientcity, setClientCity] = useState("");
  const [clientstate, setClientState] = useState("");
  const [clientcountry, setclientcountry] = useState("");
  const [clientimage, setclientimage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [successSB, setSuccessSB] = useState(false);
  const [developersData, setDevelopersData] = useState([]);
  const [biddersData, setBiddersData] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [clientpreviewUrl, setClientPreviewUrl] = useState(null);
  const [showTextField, setShowTextField] = useState(false);
  const [addClientTextField, setAddClientTextField] = useState(false);
  const [hideUlTag, setHideUlTeg] = useState("");
  const [ClientsGetData, setClientsGetData] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const dropdownRef = useRef(null);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  useEffect(() => {
    // Set the start_date to today's date when the component mounts
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const todayDate = `${year}-${month}-${day}`;
    setStart_date(todayDate);
    setEndDate(todayDate);

    async function fetchData() {
      try {
        const response = await Api.getAllUsers();
        if (response && response.User && Array.isArray(response.User)) {
          const data = response.User;

          // Filter users by category and set the state for Developers and Bidders
          const developerUsers = data.filter((user) => user.category === "Developers");
          const bidderUsers = data.filter((user) => user.category === "Bidder");

          setDevelopersData(developerUsers);
          setBiddersData(bidderUsers);
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      try {
        const response = await Api.getAllProfile();
        if (response && response.Profile && Array.isArray(response.Profile)) {
          const data = response.Profile;

          // Filter users by category and set the state for Developers and Bidder
          setProfileData(data);
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      try {
        const response = await Api.getAllCategory();
        if (response && response.Category && Array.isArray(response.Category)) {
          const data = response.Category;

          // Filter users by category and set the state for Developers and Bidder
          setCategoryData(data);
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Add Project"
      content="Add Project Successfully"
      dateTime="0 Sec ago"
      open={successSB}
      onClose={() => {
        navigate("/tables"); // Replace "/tables" with your actual route
      }}
      close={() => {
        navigate("/tables"); // Replace "/tables" with your actual route
      }}
      bgWhite
    />
  );
  if (successSB) {
    setTimeout(() => {
      setSuccessSB(false);
      navigate("/tables"); // Replace "/tables" with your actual route
    }, 2000); // 2000 milliseconds = 2 seconds
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const file_type = selectedFile.type.split("/")[0];
      if (file_type === "image") {
        // If it's an image file, display the image
        var reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = () => {
          setPreviewUrl(reader.result);
          setAttemant_file(reader.result);
        };
      } else {
        // If it's not an image file, display the default "doc.png"
        var reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = () => {
          setPreviewUrl(Document_img);
          setAttemant_file(reader.result);
        };
        // Replace with the actual path to your default image
        setAttemant_file(reader.result);
      }
      //setAttemant_file(selectedFile);
    }
  };

  const clienthandleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const file_type = selectedFile.type.split("/")[0];
      if (file_type === "image") {
        // If it's an image file, display the image
        var reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = () => {
          setClientPreviewUrl(reader.result);
          setclientimage(reader.result);
        };
      } else {
        // If it's not an image file, display the default "doc.png"
        var reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = () => {
          setClientPreviewUrl(Document_img);
          setclientimage(reader.result);
        };
        // Replace with the actual path to your default image
        setclientimage(reader.result);
      }
      //setAttemant_file(selectedFile);
    }
  };

  const Client_Serach = () => {
    setShowTextField(true);
  };

  const Add_Client_Fild = () => {
    setAddClientTextField(true);
  };

  const Sreach_client_press_key = (e) => {
    e.preventDefault();
    Sreach_client_api();
  };

  const Sreach_client_api = () => {
    setHideUlTeg(false);
    Api.client_search(sreach_client_value, Client_sreach_fild)
      .then((data) => {
        if (data.status) {
          const Clients_get_data = data.Client; // Access the "Client" array
          setClientsGetData(Clients_get_data);
        } else {
          setClientsGetData(["No Data Found"]);
        }
      })
      .catch((err) => {
        setErrors(err);
      });
  };

  const validateEmail = (clientemail) => {
    // Email validation using a simple regex pattern
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(clientemail);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate fields
    const newErrors = {};

    if (name.trim() === "") {
      newErrors.name = "Name is required";
    }
    if (amount.trim() === "") {
      newErrors.amount = "Amount is required";
    }
    if (bider_id.trim() === "") {
      newErrors.bider_id = "Select Bidder Name";
    }
    if (category_id.trim() === "") {
      newErrors.category_id = "Select Category Name";
    }
    if (profile_id.trim() === "") {
      newErrors.profile_id = "Select Profile Name";
    }
    if (description.trim() === "") {
      newErrors.description = "Description is required";
    }

    if (addClientTextField == true) {
      if (clientname.trim() == "") {
        newErrors.clientname = "Name is required";
      }
      if (!validateEmail(clientemail)) {
        newErrors.clientemail = "Email is required";
      }
      if (clientphone.trim() == "") {
        newErrors.clientphone = "Phone is required";
      }
      if (clientcountry.trim() == "") {
        newErrors.clientcountry = "Country is required";
      }
    }

    setErrors(newErrors); // Reset errors
    if (Object.keys(newErrors).length === 0) {
      if (addClientTextField) {
        Api.addClient(
          clientusername,
          clientname,
          clientemail,
          clientphone,
          clientcountry,
          clientcity,
          clientstate,
          clientimage
        )
          .then((clientResponse) => {
            if (clientResponse.errors) {
              if (clientResponse.errors.email) {
                newErrors.clientemail = clientResponse.errors.email[0];
              }
              setErrors(newErrors);
            } else if (clientResponse.status === true) {
              setClient_id(clientResponse.Data.id);
              // After successfully adding the client, call the addProject API
              Api.addProject(
                project_id,
                name,
                description,
                amount,
                start_date,
                end_date,
                developers_id,
                bider_id,
                category_id,
                clientResponse.Data.id,
                profile_id,
                attemant_file,
                developers_message
              )
                .then((projectResponse) => {
                  if (projectResponse.errors) {
                    setErrors({ ...newErrors, project: projectResponse.errors });
                  } else if (projectResponse.status === true) {
                    openSuccessSB();
                  } else {
                    setErrors({ ...newErrors, project: "Failed to add project" });
                  }
                })
                .catch((projectError) => {
                  // Handle the error for the addProject API appropriately
                  setErrors({ ...newErrors, project: projectError.message });
                });
            } else {
              setErrors({ ...newErrors, client: "Failed to add client" });
            }
          })
          .catch((clientError) => {
            // Handle the error for the addClient API appropriately
            setErrors({ ...newErrors, client: clientError.message });
          });
      } else {
        // Call the addProject API without adding a client
        Api.addProject(
          project_id,
          name,
          description,
          amount,
          start_date,
          end_date,
          developers_id,
          bider_id,
          category_id,
          client_id,
          profile_id,
          attemant_file,
          developers_message
        )
          .then((projectResponse) => {
            if (projectResponse.errors) {
              setErrors({ ...newErrors, project: projectResponse.errors });
            } else if (projectResponse.status === true) {
              openSuccessSB();
            } else {
              setErrors({ ...newErrors, project: "Failed to add project" });
            }
          })
          .catch((projectError) => {
            // Handle the error for the addProject API appropriately
            setErrors({ ...newErrors, project: projectError.message });
          });
      }
    } else {
      // If there are errors, update the errors state to display them to the user
      setErrors(newErrors);
    }
  };

  return (
    <div className="form-container">
      {" "}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ display: "flex", flexDirection: "row", marginBottom: "15px" }}>
          <div style={{ flex: 1, margin: "10px" }}>
            <TextField
              label="Project ID(Optional)"
              value={project_id}
              onChange={(e) => setProject_id(e.target.value)}
              fullWidth
            />
          </div>
          <div style={{ flex: 1, margin: "10px" }}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            {errors.name && <div style={{ color: "red", fontSize: "15px" }}>{errors.name}</div>}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row", marginBottom: "15px" }}>
          <div style={{ flex: 1, margin: "10px" }}>
            <TextField
              type="number"
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
            />
            {errors.amount && <div style={{ color: "red", fontSize: "15px" }}>{errors.amount}</div>}
          </div>
          <div style={{ flex: 1, margin: "10px" }}>
            <TextField
              label="Start Date"
              value={start_date}
              type="date"
              onChange={(e) => setStart_date(e.target.value)}
              fullWidth
            />
            {errors.start_date && (
              <div style={{ color: "red", fontSize: "15px" }}>{errors.start_date}</div>
            )}
          </div>
          <div style={{ flex: 1, margin: "10px" }}>
            <TextField
              label="End Date"
              value={end_date}
              type="date"
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
            />
            {errors.end_date && (
              <div style={{ color: "red", fontSize: "15px" }}>{errors.end_date}</div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row", marginBottom: "15px" }}>
          <div style={{ flex: 1, margin: "10px" }} className="dropdown">
            <FormControl fullWidth>
              <InputLabel label="">Developers (Optional)</InputLabel>
              <Select
                native
                value={developers_id}
                onChange={(e) => setDevelopers_id(e.target.value)}
                inputProps={{
                  name: "name",
                  id: "id",
                }}
              >
                <option value=""></option>
                {developersData.map((developer) => (
                  <option key={developer.id} value={developer.id}>
                    {developer.name || "Unknown Name"}
                  </option>
                ))}
              </Select>
            </FormControl>
            {errors.developers_id && (
              <div style={{ color: "red", fontSize: "15px" }}>{errors.developers_id}</div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row", marginBottom: "15px" }}>
          <div style={{ flex: 1, margin: "10px" }} className="dropdown">
            <FormControl fullWidth>
              <InputLabel label="">Bidder</InputLabel>
              <Select
                native
                value={bider_id}
                onChange={(e) => setBider_id(e.target.value)}
                inputProps={{
                  name: "name",
                  id: "id",
                }}
              >
                <option value=""></option>
                {biddersData.map((bidder) => (
                  <option key={bidder.id} value={bidder.id}>
                    {bidder.name || "Unknown Name"}
                  </option>
                ))}
              </Select>
            </FormControl>
            {errors.bider_id && (
              <div style={{ color: "red", fontSize: "15px" }}>{errors.bider_id}</div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row", marginBottom: "15px" }}>
          <div style={{ flex: 1, margin: "10px" }} className="dropdown">
            <FormControl fullWidth>
              <InputLabel label="">Category</InputLabel>
              <Select
                native
                value={category_id}
                onChange={(e) => setCategory_id(e.target.value)}
                inputProps={{
                  name: "name",
                  id: "id",
                }}
              >
                <option value=""></option>
                {categoryData.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </Select>
            </FormControl>
            {errors.category_id && (
              <div style={{ color: "red", fontSize: "15px" }}>{errors.category_id}</div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row", marginBottom: "15px" }}>
          <div style={{ flex: 1, margin: "10px" }} className="dropdown">
            <FormControl fullWidth>
              <InputLabel label="">Profile</InputLabel>
              <Select
                native
                value={profile_id}
                onChange={(e) => setProfile_id(e.target.value)}
                inputProps={{
                  name: "name",
                  id: "id",
                }}
              >
                <option value=""></option>
                {profileData.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.profile_name}
                  </option>
                ))}
              </Select>
            </FormControl>
            {errors.profile_id && (
              <div style={{ color: "red", fontSize: "15px" }}>{errors.profile_id}</div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row", marginBottom: "15px" }}>
          <div style={{ flex: 1, margin: "10px" }}>
            <FormControl fullWidth>
              <InputLabel label="" variant="outlined">
                Client Sreach
              </InputLabel>
              <Select
                native
                value={Client_sreach_fild}
                onChange={(e) => Client_Serach_Filed(e.target.value)}
                onClick={Client_Serach}
                inputProps={{
                  name: "name",
                  id: "id",
                }}
              >
                <option value=""></option>
                <option value="username">Username</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="city">City</option>
                <option value="state">State</option>
                <option value="country">Country</option>
              </Select>
            </FormControl>
          </div>
        </div>

        {showTextField && (
          <div style={{ display: "flex", flexDirection: "row", marginBottom: "15px" }}>
            <div style={{ flex: 1, margin: "10px" }}>
              <div style={{ position: "relative" }}>
                <TextField
                  type="search"
                  label="Search"
                  value={sreach_client_value}
                  onChange={(e) => setSreach_client_value(e.target.value)}
                  onKeyUp={Sreach_client_press_key}
                  fullWidth
                />

                {Array.isArray(ClientsGetData) && ClientsGetData.length > 0 && (
                  <div
                    style={{
                      top: "100%",
                      left: "27px",
                      right: 0,
                      backgroundColor: "#fff",
                      zIndex: 1,
                      listStyleType: "none",
                      fontSize: "16px",
                      PaddingLeft: "10px",
                      cursor: "pointer",
                      maxHeight: "140px",
                      overflowY: "scroll",
                    }}
                  >
                    {!hideUlTag && (
                      <ul>
                        {ClientsGetData.map((result) => (
                          <li
                            key={result.id}
                            onClick={() => {
                              setSreach_client_value(result.data); // Set the selected data in the input field
                              setClient_id(result.id); // Set the corresponding ID
                              setHideUlTeg(true); // Hide the <ul> tag
                            }}
                          >
                            {result.data}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div style={{ flex: 1, paddingTop: "10px", paddingLeft: 20, margin: "10px" }}>
              <img
                src={circle_plus_img}
                alt="circle_plus_img"
                style={{
                  width: "25px",
                }}
                onClick={Add_Client_Fild}
              />
            </div>
          </div>
        )}

        {addClientTextField && (
          <>
            <div style={{ display: "flex", flexDirection: "row", marginBottom: "15px" }}>
              <div style={{ flex: 1, margin: "10px" }}>
                <TextField
                  label="Client Username (optional)"
                  value={clientusername}
                  onChange={(e) => setClientUsername(e.target.value)}
                  fullWidth
                />
                {errors.clientusername && (
                  <div style={{ color: "red", fontSize: "15px" }}>{errors.clientusername}</div>
                )}
              </div>
              <div style={{ flex: 1, margin: "10px" }}>
                <TextField
                  label="Client Name"
                  value={clientname}
                  onChange={(e) => setclientName(e.target.value)}
                  fullWidth
                />
                {errors.clientname && (
                  <div style={{ color: "red", fontSize: "15px" }}>{errors.clientname}</div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "row", marginBottom: "15px" }}>
              <div style={{ flex: 1, margin: "10px" }}>
                <TextField
                  label="Email"
                  value={clientemail}
                  onChange={(e) => setClientemail(e.target.value)}
                  fullWidth
                />
                {errors.clientemail && (
                  <div style={{ color: "red", fontSize: "15px" }}>{errors.clientemail}</div>
                )}
              </div>
              <div style={{ flex: 1, margin: "10px" }}>
                <TextField
                  type="number"
                  label="Client Phone"
                  value={clientphone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  fullWidth
                />
                {errors.clientphone && (
                  <div style={{ color: "red", fontSize: "15px" }}>{errors.clientphone}</div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "row", marginBottom: "15px" }}>
              <div style={{ flex: 1, margin: "10px" }}>
                <TextField
                  label="Client City (Optinal)"
                  value={clientcity}
                  onChange={(e) => setClientCity(e.target.value)}
                  fullWidth
                />
                {errors.clientcity && (
                  <div style={{ color: "red", fontSize: "15px" }}>{errors.clientcity}</div>
                )}
              </div>
              <div style={{ flex: 1, margin: "10px" }}>
                <TextField
                  label="Client State (Optinal)"
                  value={clientstate}
                  onChange={(e) => setClientState(e.target.value)}
                  fullWidth
                />
                {errors.clientstate && (
                  <div style={{ color: "red", fontSize: "15px" }}>{errors.clientstate}</div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "row", marginBottom: "15px" }}>
              <div style={{ flex: 1, margin: "10px" }}>
                <TextField
                  label="Client Country"
                  value={clientcountry}
                  onChange={(e) => setclientcountry(e.target.value)}
                  fullWidth
                />
                {errors.clientcountry && (
                  <div style={{ color: "red", fontSize: "15px" }}>{errors.clientcountry}</div>
                )}
              </div>
              <div style={{ flex: 1, margin: "10px" }}>
                <label htmlFor="fileInput" style={{ fontSize: "14px" }}>
                  Client Images (Optional)
                </label>
                <input type="file" id="fileInput" onChange={clienthandleFileChange} />
                <br />
                {clientimage && (
                  <img
                    src={clientpreviewUrl}
                    alt="Preview"
                    style={{
                      width: "60px",
                    }}
                  />
                )}
              </div>
            </div>
          </>
        )}

        <div style={{ display: "flex", flexDirection: "row", marginBottom: "15px" }}>
          <div style={{ flex: 1, margin: "10px" }}>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={5}
            />
            {errors.description && (
              <div style={{ color: "red", fontSize: "15px" }}>{errors.description}</div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row", marginBottom: "15px" }}>
          <div style={{ flex: 1, margin: "10px" }}>
            <TextField
              label="Developers Message (Optinal)"
              value={developers_message}
              onChange={(e) => setDevelopers_message(e.target.value)}
              fullWidth
              multiline
              rows={5}
            />
          </div>
        </div>

        <div
          style={{
            flexDirection: "row",
            marginBottom: "15px",
            marginLeft: "15px",
          }}
        >
          <div style={{ flex: 1, margin: "10px" }}>
            <label htmlFor="fileInput" style={{ fontSize: "14px" }}>
              Document (Optional)
            </label>
            <br />
            <input type="file" onChange={handleFileChange} />
          </div>
          {attemant_file && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width: "60px",
              }}
            />
          )}
        </div>

        <MDBox p={2} style={{ textAlign: "center", color: "white" }} lineHeight={0}>
          <Button variant="contained" color="primary" type="submit">
            Add Project
          </Button>
        </MDBox>
        {renderSuccessSB}
      </form>
    </div>
  );
}

export default AddProjectForm;
