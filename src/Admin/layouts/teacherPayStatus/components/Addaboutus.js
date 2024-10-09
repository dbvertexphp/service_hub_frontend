import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDBox from "Admin/components/MDBox";
import MDSnackbar from "Admin/components/MDSnackbar";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Api } from "Api/Api";
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";

function AddUserForm() {
  const [amount, setAmount] = useState("");
  const [remainingAmount, setRemainingAmount] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [remark, setRemark] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [successSB, setSuccessSB] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const { teacher_id } = useParams();

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Add Category"
      content="Add Sub Category Successfully"
      dateTime="0 Sec ago"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  useEffect(() => {
    getAllTeachers();
    if (teacher_id) {
      fetchTeacherPaymentStatus(teacher_id);
    }
  }, [teacher_id]);

  const getAllTeachers = async () => {
    try {
      const response = await Api.getAllTeachersInAdmin();
      console.log(response.Users);
      if (response && Array.isArray(response.Users)) {
        setTeachers(response.Users);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTeacherPaymentStatus = async (teacherId) => {
    try {
      const response = await Api.getTeacherPaymentStatusById(teacherId);
      console.log(response);
      // Set the fetched data to the state
      setRemainingAmount(response.remaining_amount);
      setSelectedTeacher(response.teacher_id);
      setSelectedDate(new Date(response.payment_datetime));
    } catch (error) {
      console.error("Error fetching teacher payment status:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate fields
    const newErrors = {};

    if (amount === "") {
      newErrors.amount = "Amount is required";
    }
    if (selectedTeacher === "") {
      newErrors.selectedTeacher = "Teacher is required";
    }
    if (!selectedDate) {
      newErrors.paymentDate = "Payment date is required";
    }
    // const payment_datetime = "04/07/2024";
    const currentDate = new Date();
    const payment_datetime = `${currentDate.getDate().toString().padStart(2, "0")}/${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${currentDate.getFullYear()}`;

    setErrors(newErrors); // Reset errors

    if (Object.keys(newErrors).length === 0) {
      // Call the addCategory API here
      const formattedDate = selectedDate.toLocaleDateString("en-GB"); // Example format
      console.log(formattedDate);
      const data = {
        teacher_id: selectedTeacher,
        amount: Number(amount),
        remark: remark,
        payment_datetime: payment_datetime,
      };
      console.log(data);
      Api.updateTeacherPaymentStatus(data)
        .then((response) => {
          if (response.errors) {
            setErrors(response.errors);
          }
          if (response.status === true) {
            // Use strict equality (===)
            openSuccessSB();
            // Reset form fields
            setAmount("");
            setSelectedTeacher("");
            navigate("/teacher-pay-list");
          } else {
            setErrors(response.errors);
          }
        })
        .catch((error) => {
          // Handle the error appropriately
          setErrors(error);
        });
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <FormControl fullWidth>
            <Select
              value={selectedTeacher ? selectedTeacher : null}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              sx={{ height: "50px" }}
              MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
              disabled
            >
              <MenuItem disabled>Select Teacher</MenuItem>
              {teachers.map((teacher) => (
                <MenuItem key={teacher.user._id} value={teacher.user._id}>
                  {teacher.user.full_name}
                </MenuItem>
              ))}
            </Select>
            {/* {errors.selectedTeacher && errors.selectedTeacher !== null && (
              <div style={{ color: "red", fontSize: "15px" }}>{errors.selectedTeacher}</div>
            )} */}
          </FormControl>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Remaining Amount"
            value={remainingAmount !== null ? remainingAmount : ""}
            fullWidth
            type="text"
            InputLabelProps={{ shrink: true }} // This will ensure the label stays above the text
            disabled
          />
          {/* {errors.amount && errors.amount !== null && (
    <div style={{ color: "red", fontSize: "15px" }}>{errors.amount}</div>
  )} */}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Enter Remark"
            value={remark ? remark : null}
            onChange={(e) => setRemark(e.target.value)}
            fullWidth
            type="text"
          />
          {/* {errors.amount && errors.amount !== null && (
            <div style={{ color: "red", fontSize: "15px" }}>{errors.amount}</div>
          )} */}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Enter Amount"
            value={amount ? amount : null}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            type="text"
          />
          {/* {errors.amount && errors.amount !== null && (
            <div style={{ color: "red", fontSize: "15px" }}>{errors.amount}</div>
          )} */}
        </div>

        {/* <div style={{ marginBottom: "15px", width: "100%" }}>
          <DatePicker
            label="Payment Date"
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            renderInput={(params) => <TextField {...params} fullWidth />}
            // Disable future dates
            initialFocusedDate={selectedDate} // Initial focused date set to current date
          />
          {errors.paymentDate && (
            <div style={{ color: "red", fontSize: "15px", marginTop: "8px", width: "100%" }}>
              {errors.paymentDate}
            </div>
          )}
        </div> */}

        <div style={{ textAlign: "center", color: "white" }}>
          <Button variant="contained" color="primary" type="submit">
            Update
          </Button>
        </div>
        {renderSuccessSB}
      </form>
    </div>
  );
}

export default AddUserForm;
