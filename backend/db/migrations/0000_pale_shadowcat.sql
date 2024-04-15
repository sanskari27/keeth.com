CREATE TABLE IF NOT EXISTS "product-options" (
	"id" uuid NOT NULL,
	"productCode" varchar(255) NOT NULL,
	"price" real NOT NULL,
	"description" text,
	"customization" json,
	CONSTRAINT "product-options_productCode_unique" UNIQUE("productCode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"images" text[],
	"customizations" json[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommendations" (
	"productId" uuid PRIMARY KEY NOT NULL,
	"recommendedProductIds" uuid[]
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product-options" ADD CONSTRAINT "product-options_id_products_id_fk" FOREIGN KEY ("id") REFERENCES "products"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
