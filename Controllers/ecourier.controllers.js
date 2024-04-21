const fetch = require("node-fetch");

const getCity = async (req, res) => {
  const response = await fetch(
    `${process.env.ECOURIER_API_ENDPOINT}/city-list`,
    {
      method: "POST",
      headers: {
        "API-SECRET": process.env.ECOURIER_API_SECRET,
        "API-KEY": process.env.ECOURIER_API_KEY,
        "USER-ID": process.env.ECOURIER_USER_ID,
        "Content-Type": "application/json",
      },
    }
  );
  const cities = await response.json();
  res.status(201).json({ cities });
};

const getThanaList = async (req, res) => {
  const { city } = req.body;
  try {
    const response = await fetch(
      `${process.env.ECOURIER_API_ENDPOINT}/thana-list`,
      {
        method: "POST",
        headers: {
          "API-SECRET": process.env.ECOURIER_API_SECRET,
          "API-KEY": process.env.ECOURIER_API_KEY,
          "USER-ID": process.env.ECOURIER_USER_ID,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city }),
      }
    );

    const thanaList = await response.json();
    res.status(200).json({ thanaList });
  } catch (error) {
    console.log(error);
  }
};

const getAreaList = async (req, res) => {
  const { postcode } = req.body;
  try {
    const response = await fetch(
      `${process.env.ECOURIER_API_ENDPOINT}/area-list`,
      {
        method: "POST",
        headers: {
          "API-SECRET": process.env.ECOURIER_API_SECRET,
          "API-KEY": process.env.ECOURIER_API_KEY,
          "USER-ID": process.env.ECOURIER_USER_ID,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postcode }),
      }
    );

    const areaList = await response.json();
    res.status(200).json({ areaList });
  } catch (error) {
    console.log(error);
  }
};
const getBranceList = async (req, res) => {
  try {
    const response = await fetch(
      `${process.env.ECOURIER_API_ENDPOINT}/branch-list`,
      {
        method: "POST",
        headers: {
          "API-SECRET": process.env.ECOURIER_API_SECRET,
          "API-KEY": process.env.ECOURIER_API_KEY,
          "USER-ID": process.env.ECOURIER_USER_ID,
          "Content-Type": "application/json",
        },
      }
    );

    const areaList = await response.json();
    res.status(200).json({ areaList });
  } catch (error) {
    console.log(error);
  }
};

const getPackages = async (req, res) => {
  try {
    const response = await fetch(
      `${process.env.ECOURIER_API_ENDPOINT}/packages`,
      {
        method: "POST",
        headers: {
          "API-SECRET": process.env.ECOURIER_API_SECRET,
          "API-KEY": process.env.ECOURIER_API_KEY,
          "USER-ID": process.env.ECOURIER_USER_ID,
          "Content-Type": "application/json",
        },
      }
    );

    const packages = await response.json();
    res.status(200).json({ packages });
  } catch (error) {
    console.log(error);
  }
};

const parcelTraking = async (req, res) => {
  const { product_id, ecr } = req.body;
  try {
    const response = await fetch(`${process.env.ECOURIER_API_ENDPOINT}/track`, {
      method: "POST",
      headers: {
        "API-SECRET": process.env.ECOURIER_API_SECRET,
        "API-KEY": process.env.ECOURIER_API_KEY,
        "USER-ID": process.env.ECOURIER_USER_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id, ecr }),
    });

    const result = await response.json();
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
  }
};
const cancelOrder = async (req, res) => {
  const { tracking, comment } = req.body;
  try {
    const response = await fetch(
      `${process.env.ECOURIER_API_ENDPOINT}/cancel-order`,
      {
        method: "POST",
        headers: {
          "API-SECRET": process.env.ECOURIER_API_SECRET,
          "API-KEY": process.env.ECOURIER_API_KEY,
          "USER-ID": process.env.ECOURIER_USER_ID,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tracking, comment }),
      }
    );

    const result = await response.json();
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
  }
};
const paymentStatus = async (req, res) => {
  const { tracking } = req.body;
  try {
    const response = await fetch(
      `${process.env.ECOURIER_API_ENDPOINT}/payment-status`,
      {
        method: "POST",
        headers: {
          "API-SECRET": process.env.ECOURIER_API_SECRET,
          "API-KEY": process.env.ECOURIER_API_KEY,
          "USER-ID": process.env.ECOURIER_USER_ID,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tracking }),
      }
    );

    const paymentStatus = await response.json();
    res.status(200).json({ paymentStatus });
  } catch (error) {
    console.log(error);
  }
};

const placeOrderReseller = async (req, res) => {
  const {
    ep_name,
    pick_contact_person,
    pick_division,
    pick_district,
    pick_thana,
    pick_union,
    pick_address,
    pick_mobile,
    recipient_name,
    recipient_mobile,
    recipient_city,
    recipient_area,
    recipient_thana,
    recipient_union,
    recipient_address,
    recipient_district,
    package_code,
    product_price,
    payment_method,
    parcel_detail,
    ep_id,
    actual_product_price,
    number_of_item,
    product_id,
    pick_hub,
    comments,
    pgwid,
    pgwtxn_id,
    payment_to_child,
    child_payment_method,
    child_account,
    child_bank_name,
    child_bank_branch,
    child_account_holder_name,
    child_account_route,
    child_bkash,
    child_bkash_type,
    child_rocket,
    child_rocket_type,
    parcel_type,
    is_fragile,
    sending_type,
    is_ipay,
  } = req.body;

  try {
    const response = await fetch(
      `${process.env.ECOURIER_API_ENDPOINT}/order-place-reseller`,
      {
        method: "POST",
        headers: {
          "API-SECRET": process.env.ECOURIER_API_SECRET,
          "API-KEY": process.env.ECOURIER_API_KEY,
          "USER-ID": process.env.ECOURIER_USER_ID,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ep_name,
          pick_contact_person,
          pick_division,
          pick_district,
          pick_thana,
          pick_union,
          pick_address,
          pick_mobile,
          recipient_name,
          recipient_mobile,
          recipient_city,
          recipient_area,
          recipient_thana,
          recipient_union,
          recipient_address,
          recipient_district,
          package_code,
          product_price,
          payment_method,
          parcel_detail,
          ep_id,
          actual_product_price,
          number_of_item,
          product_id,
          pick_hub,
          comments,
          pgwid,
          pgwtxn_id,
          payment_to_child,
          child_payment_method,
          child_account,
          child_bank_name,
          child_bank_branch,
          child_account_holder_name,
          child_account_route,
          child_bkash,
          child_bkash_type,
          child_rocket,
          child_rocket_type,
          parcel_type,
          is_fragile,
          sending_type,
          is_ipay,
        }),
      }
    );

    const orderResponse = await response.json();
    res.status(200).json(orderResponse);
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  getCity,
  getThanaList,
  getAreaList,
  getBranceList,
  placeOrderReseller,
  getPackages,
  parcelTraking,
  cancelOrder,
  paymentStatus,
};
