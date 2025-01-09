"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Fetches all products from the database, optionally filtering by a search term.
 * Includes associated product variants and category details.
 */
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Extract the search query parameter, if provided.
        // `req.query.search` retrieves the `search` query parameter from the URL.
        // Example URL: `/products?search=phone`
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        // Query the database for products.
        const products = yield prisma.products.findMany({
            where: {
                // If a search term is provided, filter products by name containing the search term.
                // The `contains` operator performs a case-insensitive search by default.
                name: {
                    contains: search,
                },
            },
            include: {
                ProductVariants: true, // Include related product variants in the response.
                category: true, // Include the associated category details for each product.
            },
        });
        // Return the products as a JSON response.
        res.json(products);
    }
    catch (error) {
        // Handle any errors that occur during the database query.
        // Respond with a 500 Internal Server Error and include the error details.
        res.status(500).json({ message: "Error retrieving products", error });
    }
});
exports.getProducts = getProducts;
