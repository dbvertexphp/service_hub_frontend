import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDBox from "Admin/components/MDBox";
import MDSnackbar from "Admin/components/MDSnackbar";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { Api } from "Api/Api";
import { useNavigate } from "react-router-dom";
import FileInput from "../../components/FileInput.js";

function AddUserForm() {
  const [productName, setProductName] = useState("");
  const [productWeight, setProductWeight] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState([]);
  const [selectSupplier, setSelectSupplier] = useState("");
  const [supplier, setSupplier] = useState([]);
  const [productQuantity, setProductQuantity] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [successSB, setSuccessSB] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Add Product"
      content="Add Product Successfully"
      dateTime="0 Sec ago"
      open={successSB}
      onClose={() => {
        navigate("/fertilizer-list"); // Replace "/tables" with your actual route
      }}
      close={() => {
        navigate("/fertilizer-list"); // Replace "/tables" with your actual route
      }}
      bgWhite
    />
  );

  useEffect(() => {
    getAllSupplier();
  }, []);

  const getAllSupplier = async () => {
    try {
      const response = await Api.getAllSupplier();
      if (response && Array.isArray(response.Supplier)) {
        setSupplier(response.Supplier);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (productName.trim() === "") {
      newErrors.productName = "Product Name is required";
    }
    if (productWeight.trim() === "") {
      newErrors.productWeight = "Product Weight is required";
    }
    if (productPrice.trim() === "") {
      newErrors.productPrice = "Product Price is required";
    }
    if (productQuantity.trim() === "") {
      newErrors.productQuantity = "Product Quantity is required";
    }
    if (selectSupplier === "") {
      newErrors.selectSupplier = "Supplier is required";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log(productImage);

      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("english_name", productName);
      formData.append("price", productPrice);
      formData.append("product_weight", productWeight);
      formData.append("product_role", "fertilizer");
      if (productImage.length > 0) {
        productImage.forEach((image, index) => {
          formData.append(`product_images`, image);
        });
      }
      formData.append("supplier_id", selectSupplier);
      formData.append("quantity", productQuantity);

      try {
        const response = await Api.addFertilizer(formData, token);
        if (response.errors) {
          setErrors(response.errors);
        } else if (response.status === true) {
          openSuccessSB();
        } else {
          setErrors(response.errors);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setErrors({ submit: "An error occurred during submission." });
      }
    }
  };

  const handleFileChange = (e) => {
    setProductImage(Array.from(e.target.files));
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            fullWidth
            type="text"
          />
          {errors.productName && (
            <div style={{ color: "red", fontSize: "15px" }}>{errors.productName}</div>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Product Weight"
            value={productWeight}
            onChange={(e) => setProductWeight(e.target.value)}
            fullWidth
            type="text"
          />
          {errors.productWeight && (
            <div style={{ color: "red", fontSize: "15px" }}>{errors.productWeight}</div>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Product Price"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            fullWidth
            type="text"
          />
          {errors.productPrice && (
            <div style={{ color: "red", fontSize: "15px" }}>{errors.productPrice}</div>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <FileInput
            label="Product Images"
            onChange={handleFileChange}
            error={errors.productImage}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <FormControl fullWidth>
            <InputLabel id="supplier-select-label">Select Supplier</InputLabel>
            <Select
              labelId="supplier-select-label"
              value={selectSupplier}
              onChange={(e) => setSelectSupplier(e.target.value)}
              fullWidth
              style={{ height: "40px" }}
            >
              {supplier.map((supplier) => (
                <MenuItem key={supplier._id} value={supplier._id}>
                  {supplier.full_name}
                </MenuItem>
              ))}
            </Select>
            {errors.selectSupplier && (
              <FormHelperText error>{errors.selectSupplier}</FormHelperText>
            )}
          </FormControl>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Product Quantity"
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
            fullWidth
            type="text"
          />
          {errors.productQuantity && (
            <div style={{ color: "red", fontSize: "15px" }}>{errors.productQuantity}</div>
          )}
        </div>

        <MDBox p={2} style={{ textAlign: "center", color: "white" }} lineHeight={0}>
          <Button variant="contained" color="primary" type="submit">
            Add Product
          </Button>
        </MDBox>
        {renderSuccessSB}
      </form>
    </div>
  );
}

export default AddUserForm;
