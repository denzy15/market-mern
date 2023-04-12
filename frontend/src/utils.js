import { toast } from "react-toastify";

export const getError = (err) => {
  return err.response && err.response.data.message
    ? err.response.data.message
    : err.message;
};

export const orderAddressValidator = (address) => {
  let errors = {
    firstName: true,
    secondName: true,
    street: true,
    country: true,
    city: true,
    postalCode: true,
  };

  if (!address.firstName) {
    errors.firstName = false;
  }

  if (!address.secondName) {
    errors.secondName = false;
  }

  if (!address.street) {
    errors.street = false;
  }
  if (!address.country) {
    errors.country = false;
  }
  if (!address.city) {
    errors.city = false;
  }
  if (!address.postalCode) {
    errors.postalCode = false;
  }

  let valid = true;

  for (const val of Object.values(errors)) {
    if (!val) {
      valid = false;
      break;
    }
  }

  errors.valid = valid;

  return errors;
};

export const orderPaymentValidator = (payment) => {
  let errors = {
    cardName: true,
    cardNumber: true,
    expiryDate: true,
    cvv: true,
  };

  if (!payment.cardName || payment.cardName.split(" ").length < 2)
    errors.cardName = false;

  if (!payment.cardNumber || isNaN(parseInt(payment.cardNumber)))
    errors.cardNumber = false;

  if (
    !payment.expiryDate ||
    payment.expiryDate.length < 5 ||
    isNaN(parseInt(payment.expiryDate.split("/")[0])) ||
    parseInt(payment.expiryDate.split("/")[0]) > 12 ||
    parseInt(payment.expiryDate.split("/")[0]) < 0
  )
    errors.expiryDate = false;

  if (!payment.cvv || payment.cvv.length !== 3) errors.cvv = false;

  let valid = true;

  for (const val of Object.values(errors)) {
    if (!val) {
      valid = false;
      break;
    }
  }

  errors.valid = valid;

  return errors;
};

export const expriy_format = (value) => {
  const expdate = value;
  const expDateFormatter =
    expdate.replace(/\//g, "").substring(0, 2) +
    (expdate.length > 2 ? "/" : "") +
    expdate.replace(/\//g, "").substring(2, 4);

  return expDateFormatter;
};

export function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber);
  let month = date.toLocaleString("ru-RU", { month: "long" });
  return month.charAt(0).toUpperCase() + month.slice(1);
}

export function numberWithSpaces(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}

export const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const toastNotifier = (promise, pending, success, error) => {
  toast.promise(
    promise,
    {
      pending,
      success,
      error,
    },
    {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    }
  );
};

export const getMaxPrice = (products) => {
  const prices = products.map((p) => p.price);
  return Math.max(...prices);
};
