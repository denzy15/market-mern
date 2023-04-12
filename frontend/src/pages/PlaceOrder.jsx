import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import React, { useContext, useState } from "react";
import AddressForm from "../components/AddressForm";
import PaymentForm from "../components/PaymentForm";
import ReviewOrder from "../components/ReviewOrder";
import { Store } from "../Store";
import { orderAddressValidator, orderPaymentValidator } from "../utils";
import axios from "axios";
import OrderSuccess from "./OrderSuccess";
import Loader from "../components/Loader";

const steps = ["Адрес", "Способ оплаты", "Обзор"];

const initialAddress = {
  firstName: "",
  secondName: "",
  street: "",
  apartment: "",
  country: "",
  state: "",
  city: "",
  postalCode: "",
  errors: {
    valid: true,
    firstName: true,
    secondName: true,
    street: true,
    country: true,
    city: true,
    postalCode: true,
  },
};

const initialPaymentDetails = {
  cardName: "",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  errors: {
    cardName: true,
    cardNumber: true,
    expiryDate: true,
    cvv: true,
  },
};

export default function PlaceOrder() {
  const { state, dispatch } = useContext(Store);

  const { cart, userInfo } = state;

  const [loading, setLoading] = useState(false);

  const [orderId, setOrderId] = useState(null);

  const [payment, setPayment] = useState(initialPaymentDetails);

  const [address, setAddress] = useState(initialAddress);

  const [activeStep, setActiveStep] = useState(0);

  const itemsPrice = cart.cartItems.reduce(
    (a, b) => a + b.price * b.quantity,
    0
  );

  const shippingPrice = itemsPrice < 100000 ? 5000 : 0;

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <AddressForm address={address} setAddress={setAddress} />;
      case 1:
        return <PaymentForm payment={payment} setPayment={setPayment} />;
      case 2:
        return (
          <ReviewOrder
            cart={cart.cartItems}
            payment={payment}
            address={address}
            itemsPrice={itemsPrice}
            shippingPrice={shippingPrice}
          />
        );
      case 3:
        return <OrderSuccess orderId={orderId} />;
      default:
        throw new Error("Unknown step");
    }
  };

  const handleNext = () => {
    switch (activeStep) {
      case 0:
        const addressValid = orderAddressValidator(address);
        addressValid.valid
          ? setActiveStep(activeStep + 1)
          : setAddress((prev) => ({ ...prev, errors: addressValid }));
        break;
      case 1:
        const payValid = orderPaymentValidator(payment);
        payValid.valid
          ? setActiveStep(activeStep + 1)
          : setPayment((prev) => ({ ...prev, errors: payValid }));
        break;
      case 2:
        placeOrder();
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const placeOrder = async () => {
    const filledAddress = {
      fullName: `${address.firstName} ${address.secondName}`,
      address: `${address.street}, ${address.apartment} ${address.state}`,
      country: address.country,
      city: address.city,
      postalCode: address.postalCode,
    };

    const filledPayment = {
      cardName: payment.cardName,
      cardNumber: payment.cardNumber,
      cvv: payment.cvv,
      expiryDate: payment.expiryDate,
    };

    setLoading(true);

    try {
      await axios
        .post(
          "/api/orders",
          {
            orderItems: cart.cartItems,
            shippingAddress: filledAddress,
            paymentDetails: filledPayment,
            itemsPrice,
            shippingPrice,
            totalPrice: itemsPrice + shippingPrice,
          },
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        )
        .then((res) => {
          setOrderId(res.data.order._id);
          dispatch({ type: "CART_CLEAR" });
          setActiveStep(activeStep + 1);
        });
    } catch (error) {
      alert(error);
    }

    setLoading(false);
  };

  return loading ? (
    <Loader />
  ) : (
    <Box>
      <Container component="section" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Оформление заказа
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <React.Fragment>
            {getStepContent(activeStep)}
            {activeStep !== 3 && (
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Назад
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? "Оформить заказ" : "Далее"}
                </Button>
              </Box>
            )}
          </React.Fragment>
        </Paper>
      </Container>
    </Box>
  );
}
