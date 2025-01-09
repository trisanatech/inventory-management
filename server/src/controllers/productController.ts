import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


/**
 * Retrieves all categories or a specific category by ID.
 * If an ID is provided in the request params, it fetches the category with that ID.
 */
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // If an ID is provided, fetch a specific category by ID.
    if (id) {
      const category = await prisma.categories.findUnique({
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
    const categories = await prisma.categories.findMany();

    // Return the list of categories.
    res.status(200).json(categories);
  } catch (error) {
    // Handle any errors during the process.
    res.status(500).json({ message: "Error retrieving categories", error });
  }
};

/**
 * Creates a new category in the database.
 * The request body must include the category's name and an optional description.
 */
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    // Destructure required fields from the request body.
    const { name, description } = req.body;

    // Create a new category record in the database.
    const category = await prisma.categories.create({
      data: {
        name,        // The name of the category (e.g., "Electronics").
        description, // A brief description of the category, if provided.
      },
    });

    // Send the created category as a response with status code 201 (Created).
    res.status(201).json(category);
  } catch (error) {
    // Handle any errors that occur during category creation.
    res.status(500).json({ message: "Error creating category", error });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Get the category ID from the route params.
    const { name, description } = req.body; // Destructure the updated fields from the request body.

    // Ensure the ID is provided and is a valid integer.
    const categoryId = parseInt(id, 10);
    if (isNaN(categoryId)) {
      res.status(400).json({ message: "Invalid category ID" });
      return;
    }

    // Update the category record in the database.
    const updatedCategory = await prisma.categories.update({
      where: { id: categoryId },
      data: {
        name,        // Update the name if provided.
        description, // Update the description if provided.
      },
    });

    // Send the updated category as a response.
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Ensure the ID is provided and valid
    if (!id) {
      res.status(400).json({ message: "Category ID is required" });
      return;
    }

    // Check if the category exists
    const category = await prisma.categories.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    // Delete the category
    await prisma.categories.delete({
      where: { id: parseInt(id, 10) },
    });

    // Send success response
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Error deleting category", error });
  }
};


/**
 * Retrieves all products or a specific product by ID.
 * If an ID is provided in the request params, it fetches the product with that ID.
 */
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;

    // If a product ID is provided, fetch the specific product.
    if (productId) {
      const product = await prisma.products.findUnique({
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
    const products = await prisma.products.findMany({
      include: {
        category: true, // Include related category details.
        ProductVariants: true, // Include related product variants.
      },
    });

    // Return the list of products.
    res.status(200).json(products);
  } catch (error) {
    // Handle any errors during the process.
    res.status(500).json({ message: "Error retrieving products", error });
  }
};

/**
 * Creates a new product in the database.
 * The request body must include all necessary product details.
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    // Destructure required fields from the request body.
    const { name, description, price, imageUrl, categoryId } = req.body;

    // Create a new product record in the database.
    const product = await prisma.products.create({
      data: {
        productId: crypto.randomUUID(), // Generate a unique ID for the product.
        name,                          // The name of the product (e.g., "Smartphone").
        description,                   // A brief description of the product, if provided.
        price,                         // The price of the product (e.g., 699.99).
        imageUrl,                      // The URL or path to the product's image.
        categoryId,                    // The ID of the category this product belongs to, if any.
      },
    });

    // Send the created product as a response with status code 201 (Created).
    res.status(201).json(product);
  } catch (error) {
    // Handle any errors that occur during product creation.
    res.status(500).json({ message: "Error creating product", error });
  }
};

/**
 * Retrieves all product variants or a specific product variant by ID.
 * If an ID is provided in the request params, it fetches the product variant with that ID.
 */
export const getProductVariants = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productVariantId } = req.params;

    // If a variant ID is provided, fetch the specific product variant.
    if (productVariantId) {
      const productVariant = await prisma.productVariants.findUnique({
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
    const productVariants = await prisma.productVariants.findMany({
      include: {
        product: true, // Include the related product details.
      },
    });

    // Return the list of product variants.
    res.status(200).json(productVariants);
  } catch (error) {
    // Handle any errors during the process.
    res.status(500).json({ message: "Error retrieving product variants", error });
  }
};

/**
 * Creates a new product variant in the database.
 * The request body must include the product ID and necessary variant details.
 */
export const createProductVariant = async (req: Request, res: Response): Promise<void> => {
  try {
    // Destructure required fields from the request body.
    const { productId, sku, variantName, attributes } = req.body;

    // Create a new product variant record in the database.
    const productVariant = await prisma.productVariants.create({
      data: {
        productVariantId: crypto.randomUUID(), // Generate a unique ID for the product variant.
        productId,                            // The ID of the product this variant belongs to.
        sku,                                  // The unique SKU (Stock Keeping Unit) for the variant.
        variantName,                          // The name of the variant (e.g., "Black, 128GB").
        attributes,                           // Additional attributes in JSON format (e.g., size, color).
      },
    });

    // Send the created product variant as a response with status code 201 (Created).
    res.status(201).json(productVariant);
  } catch (error) {
    // Handle any errors that occur during product variant creation.
    res.status(500).json({ message: "Error creating product variant", error });
  }
};
