import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Fetches all products from the database, optionally filtering by a search term.
 * Includes associated product variants and category details.
 */
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract the search query parameter, if provided.
    // `req.query.search` retrieves the `search` query parameter from the URL.
    // Example URL: `/products?search=phone`
    const search = req.query.search?.toString();

    // Query the database for products.
    const products = await prisma.products.findMany({
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
  } catch (error) {
    // Handle any errors that occur during the database query.
    // Respond with a 500 Internal Server Error and include the error details.
    res.status(500).json({ message: "Error retrieving products", error });
  }
};
