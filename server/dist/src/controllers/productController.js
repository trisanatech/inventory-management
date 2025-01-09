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
exports.createProductVariant = exports.getProductVariants = exports.createProduct = exports.getProducts = exports.createCategory = exports.getCategories = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Retrieves all categories or a specific category by ID.
 * If an ID is provided in the request params, it fetches the category with that ID.
 */
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // If an ID is provided, fetch a specific category by ID.
        if (id) {
            const category = yield prisma.categories.findUnique({
                where: { id: parseInt(id, 10) }, // Ensure ID is an integer.
            });
            // If the category does not exist, return a 404 response.
            if (!category) {
                res.status(404).json({ message: "Category not found" });
                return;
            }
            // Return the found category.
            res.status(200).json(category);
            return;
        }
        // Fetch all categories if no ID is provided.
        const categories = yield prisma.categories.findMany();
        // Return the list of categories.
        res.status(200).json(categories);
    }
    catch (error) {
        // Handle any errors during the process.
        res.status(500).json({ message: "Error retrieving categories", error });
    }
});
exports.getCategories = getCategories;
/**
 * Creates a new category in the database.
 * The request body must include the category's name and an optional description.
 */
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure required fields from the request body.
        const { name, description } = req.body;
        // Create a new category record in the database.
        const category = yield prisma.categories.create({
            data: {
                name, // The name of the category (e.g., "Electronics").
                description, // A brief description of the category, if provided.
            },
        });
        // Send the created category as a response with status code 201 (Created).
        res.status(201).json(category);
    }
    catch (error) {
        // Handle any errors that occur during category creation.
        res.status(500).json({ message: "Error creating category", error });
    }
});
exports.createCategory = createCategory;
/**
 * Retrieves all products or a specific product by ID.
 * If an ID is provided in the request params, it fetches the product with that ID.
 */
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        // If a product ID is provided, fetch the specific product.
        if (productId) {
            const product = yield prisma.products.findUnique({
                where: { productId }, // Match by product ID.
                include: {
                    category: true, // Include related category details.
                    ProductVariants: true, // Include related product variants.
                },
            });
            // If the product does not exist, return a 404 response.
            if (!product) {
                res.status(404).json({ message: "Product not found" });
                return;
            }
            // Return the found product.
            res.status(200).json(product);
            return;
        }
        // Fetch all products if no ID is provided.
        const products = yield prisma.products.findMany({
            include: {
                category: true, // Include related category details.
                ProductVariants: true, // Include related product variants.
            },
        });
        // Return the list of products.
        res.status(200).json(products);
    }
    catch (error) {
        // Handle any errors during the process.
        res.status(500).json({ message: "Error retrieving products", error });
    }
});
exports.getProducts = getProducts;
/**
 * Creates a new product in the database.
 * The request body must include all necessary product details.
 */
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure required fields from the request body.
        const { name, description, price, imageUrl, categoryId } = req.body;
        // Create a new product record in the database.
        const product = yield prisma.products.create({
            data: {
                productId: crypto.randomUUID(), // Generate a unique ID for the product.
                name, // The name of the product (e.g., "Smartphone").
                description, // A brief description of the product, if provided.
                price, // The price of the product (e.g., 699.99).
                imageUrl, // The URL or path to the product's image.
                categoryId, // The ID of the category this product belongs to, if any.
            },
        });
        // Send the created product as a response with status code 201 (Created).
        res.status(201).json(product);
    }
    catch (error) {
        // Handle any errors that occur during product creation.
        res.status(500).json({ message: "Error creating product", error });
    }
});
exports.createProduct = createProduct;
/**
 * Retrieves all product variants or a specific product variant by ID.
 * If an ID is provided in the request params, it fetches the product variant with that ID.
 */
const getProductVariants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productVariantId } = req.params;
        // If a variant ID is provided, fetch the specific product variant.
        if (productVariantId) {
            const productVariant = yield prisma.productVariants.findUnique({
                where: { productVariantId }, // Match by product variant ID.
                include: {
                    product: true, // Include the related product details.
                },
            });
            // If the product variant does not exist, return a 404 response.
            if (!productVariant) {
                res.status(404).json({ message: "Product Variant not found" });
                return;
            }
            // Return the found product variant.
            res.status(200).json(productVariant);
            return;
        }
        // Fetch all product variants if no ID is provided.
        const productVariants = yield prisma.productVariants.findMany({
            include: {
                product: true, // Include the related product details.
            },
        });
        // Return the list of product variants.
        res.status(200).json(productVariants);
    }
    catch (error) {
        // Handle any errors during the process.
        res.status(500).json({ message: "Error retrieving product variants", error });
    }
});
exports.getProductVariants = getProductVariants;
/**
 * Creates a new product variant in the database.
 * The request body must include the product ID and necessary variant details.
 */
const createProductVariant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure required fields from the request body.
        const { productId, sku, variantName, attributes } = req.body;
        // Create a new product variant record in the database.
        const productVariant = yield prisma.productVariants.create({
            data: {
                productVariantId: crypto.randomUUID(), // Generate a unique ID for the product variant.
                productId, // The ID of the product this variant belongs to.
                sku, // The unique SKU (Stock Keeping Unit) for the variant.
                variantName, // The name of the variant (e.g., "Black, 128GB").
                attributes, // Additional attributes in JSON format (e.g., size, color).
            },
        });
        // Send the created product variant as a response with status code 201 (Created).
        res.status(201).json(productVariant);
    }
    catch (error) {
        // Handle any errors that occur during product variant creation.
        res.status(500).json({ message: "Error creating product variant", error });
    }
});
exports.createProductVariant = createProductVariant;
