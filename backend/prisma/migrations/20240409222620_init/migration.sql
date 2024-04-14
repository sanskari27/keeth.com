-- CreateEnum
CREATE TYPE "MetalType" AS ENUM ('WHITE_GOLD', 'YELLOW_GOLD');

-- CreateEnum
CREATE TYPE "DimondType" AS ENUM ('NONE', 'WHITE', 'YELLOW');

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "productOptionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("sessionId","productOptionId")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "product_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "baseOptionIndex" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductOption" (
    "id" TEXT NOT NULL,
    "product_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "metal_type" "MetalType" NOT NULL,
    "metal_purity" TEXT NOT NULL,
    "metal_weight" DOUBLE PRECISION NOT NULL,
    "dimond_type" "DimondType" NOT NULL,
    "dimond_weight" DOUBLE PRECISION NOT NULL,
    "dimond_count" INTEGER NOT NULL,
    "others" JSONB NOT NULL,
    "tags" TEXT[],
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("phone")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_product_code_key" ON "Product"("product_code");

-- CreateIndex
CREATE UNIQUE INDEX "ProductOption_product_code_key" ON "ProductOption"("product_code");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productOptionId_fkey" FOREIGN KEY ("productOptionId") REFERENCES "ProductOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOption" ADD CONSTRAINT "ProductOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
