ALTER TABLE "recommendations" DROP CONSTRAINT "recommendations_productId_products_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
