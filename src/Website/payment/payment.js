import { WebsiteApi } from "Api/WebsiteApi";

const checkoutHandler = async (amount, hireId, calendarid, userId, handleClickOpen) => {
  try {
    const key = process.env.REACT_APP_REZORPAY_KEY;
    const response = await WebsiteApi.checkout(amount); // Pass hireId and calendarid to the checkout function
    // Prepare options for Razorpay
    const options = {
      key: key,
      amount: response.order.amount, // Make sure the response structure is correct
      currency: "INR",
      name: "Hire",
      description: "Tutorial of RazorPay",
      image: "https://tobuu.com/assets/images/auth_logo.png",
      order_id: response.order.id, // Assuming the response contains order ID
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      notes: {
        address: "Indore",
        hireId: hireId, // Include hireId in the notes
        calendarid: calendarid,
        userId: userId, // Include calendarid in the notes
      },
      theme: {
        color: "#121212",
      },
      handler: function (response) {
        console.log(response);
        handleClickOpen(hireId, amount, calendarid);
        // Handle successful payment
      },
      preOpen: function () {
        // Handle pre-open event
        alert("Payment Faild!");
      },
    };

    // Initialize Razorpay
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error("Error during payment:", error);
    // Handle errors
  }
};

export default checkoutHandler;
