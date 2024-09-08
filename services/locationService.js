class LocationService {
    constructor({ locationUtils }) {
        this.locationUtils = locationUtils;
    }

    getNearestProducts = async (latitude, longitude, radius) => {
        return await this.locationUtils.getNearestProducts(latitude, longitude, radius);
    };
}

module.exports = LocationService;
