class MapController {
    constructor({ locationService }) {
        this.locationService = locationService;
    }

    getNearestProducts = async (req, res, next) => {
        try {
            const { latitude, longitude, radius } = req.query;
            const products = await this.locationService.getNearestProducts(latitude, longitude, radius);
            res.status(200).json({ products });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = MapController;
