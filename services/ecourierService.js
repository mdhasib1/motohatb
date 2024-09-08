const fetch = require("node-fetch");

const ecourierRequest = async (endpoint, method, body) => {
  try {
    const response = await fetch(`${process.env.ECOURIER_API_ENDPOINT}/${endpoint}`, {
      method,
      headers: {
        "API-SECRET": process.env.ECOURIER_API_SECRET,
        "API-KEY": process.env.ECOURIER_API_KEY,
        "USER-ID": process.env.ECOURIER_USER_ID,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in ${endpoint} request:`, error);
    throw error;
  }
};

const getCity = async () => {
  try {
    const cities = await ecourierRequest("city-list", "POST");
    return cities;
  } catch (error) {
    throw new Error("Failed to fetch city list");
  }
};

const getThanaList = async (city) => {
  try {
    const thanaList = await ecourierRequest("thana-list", "POST", { city });
    return thanaList;
  } catch (error) {
    throw new Error("Failed to fetch thana list");
  }
};

const getAreaList = async (postcode) => {
  try {
    const areaList = await ecourierRequest("area-list", "POST", { postcode });
    return areaList;
  } catch (error) {
    throw new Error("Failed to fetch area list");
  }
};

const getBranchList = async () => {
  try {
    const branchList = await ecourierRequest("branch-list", "POST");
    return branchList;
  } catch (error) {
    throw new Error("Failed to fetch branch list");
  }
};

const getPackages = async () => {
  try {
    const packages = await ecourierRequest("packages", "POST");
    return packages;
  } catch (error) {
    throw new Error("Failed to fetch packages");
  }
};

const parcelTracking = async (product_id, ecr) => {
  try {
    const result = await ecourierRequest("track", "POST", { product_id, ecr });
    return result;
  } catch (error) {
    throw new Error("Failed to track parcel");
  }
};

const cancelOrder = async (tracking, comment) => {
  try {
    const result = await ecourierRequest("cancel-order", "POST", { tracking, comment });
    return result;
  } catch (error) {
    throw new Error("Failed to cancel order");
  }
};

const paymentStatus = async (tracking) => {
  try {
    const paymentStatus = await ecourierRequest("payment-status", "POST", { tracking });
    return paymentStatus;
  } catch (error) {
    throw new Error("Failed to fetch payment status");
  }
};

const placeOrderReseller = async (orderData) => {
  try {
    const orderResponse = await ecourierRequest("order-place-reseller", "POST", orderData);
    return orderResponse;
  } catch (error) {
    throw new Error("Failed to place order");
  }
};

module.exports = {
  getCity,
  getThanaList,
  getAreaList,
  getBranchList,
  getPackages,
  parcelTracking,
  cancelOrder,
  paymentStatus,
  placeOrderReseller,
};
