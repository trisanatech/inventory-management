/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `hasVariants` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the `Categories` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_categoryId_fkey";

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "categoryId",
DROP COLUMN "hasVariants",
DROP COLUMN "unit",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "Categories";

-- CreateTable
CREATE TABLE "Users" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "object" TEXT NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "inventoryId" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "warehouseStock" INTEGER NOT NULL DEFAULT 0,
    "shopStock" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("inventoryId")
);

-- CreateTable
CREATE TABLE "StockMovements" (
    "movementId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockMovements_pkey" PRIMARY KEY ("movementId")
);

-- CreateTable
CREATE TABLE "Audits" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "oldQuantity" INTEGER NOT NULL,
    "newQuantity" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sales" (
    "saleId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerContact" TEXT,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'Unpaid',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sales_pkey" PRIMARY KEY ("saleId")
);

-- CreateTable
CREATE TABLE "SalesOrderLineItems" (
    "id" TEXT NOT NULL,
    "salesOrderId" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SalesOrderLineItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchases" (
    "purchaseId" TEXT NOT NULL,
    "supplierName" TEXT NOT NULL,
    "supplierPhone" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedDeliveryDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Purchases_pkey" PRIMARY KEY ("purchaseId")
);

-- CreateTable
CREATE TABLE "PurchaseOrderLineItems" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PurchaseOrderLineItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesPayments" (
    "paymentId" TEXT NOT NULL,
    "salesOrderId" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "SalesPayments_pkey" PRIMARY KEY ("paymentId")
);

-- CreateTable
CREATE TABLE "PurchasePayments" (
    "paymentId" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "PurchasePayments_pkey" PRIMARY KEY ("paymentId")
);

-- CreateTable
CREATE TABLE "_PermissionsToRoles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionsToRoles_AB_unique" ON "_PermissionsToRoles"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionsToRoles_B_index" ON "_PermissionsToRoles"("B");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariants"("productVariantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovements" ADD CONSTRAINT "StockMovements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audits" ADD CONSTRAINT "Audits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audits" ADD CONSTRAINT "Audits_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("inventoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesOrderLineItems" ADD CONSTRAINT "SalesOrderLineItems_salesOrderId_fkey" FOREIGN KEY ("salesOrderId") REFERENCES "Sales"("saleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesOrderLineItems" ADD CONSTRAINT "SalesOrderLineItems_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariants"("productVariantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderLineItems" ADD CONSTRAINT "PurchaseOrderLineItems_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "Purchases"("purchaseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderLineItems" ADD CONSTRAINT "PurchaseOrderLineItems_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariants"("productVariantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesPayments" ADD CONSTRAINT "SalesPayments_salesOrderId_fkey" FOREIGN KEY ("salesOrderId") REFERENCES "Sales"("saleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchasePayments" ADD CONSTRAINT "PurchasePayments_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "Purchases"("purchaseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionsToRoles" ADD CONSTRAINT "_PermissionsToRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "Permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionsToRoles" ADD CONSTRAINT "_PermissionsToRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "Roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
