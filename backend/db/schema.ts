import { json, pgTable, real, text, uuid, varchar } from 'drizzle-orm/pg-core';

// -----------------------------------------------------        Product          -------------------------------------

export const ProductTable = pgTable('products', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	images: text('images').array(),
	customizations: json('customizations')
		.$type<{
			kind: string;
			type: string;
			value: string;
		}>()
		.array(),
});

export const ProductOptionTable = pgTable('product-options', {
	id: uuid('id').primaryKey().defaultRandom(),
	productId: uuid('id')
		.references(() => ProductTable.id, {
			onDelete: 'set null',
		})
		.notNull(),

	productCode: varchar('productCode', { length: 255 }).notNull().unique(),
	price: real('price').notNull(),
	description: text('description'),

	customization: json('customization').$type<{
		kind: string;
		type: string;
		value: string;
	}>(),
});

export const RecommendedTable = pgTable('recommendations', {
	productId: uuid('productId')
		.references(() => ProductTable.id, {
			onDelete: 'set null',
		})
		.primaryKey(),
	recommendedProductIds: uuid('recommendedProductIds')
		.references(() => ProductTable.id,{
			onDelete:'set null'
		})
		.array(),
});

// export const SessionTable = pgTable('sessions', {
// 	id: uuid('id').primaryKey().defaultRandom(),
//     cart:
// })

// export const CartItemTable = pgTable('cart-item', {
//     productOptionId
// }, (table) => {
//   return {
//     pk: primaryKey({ columns: [table.bookId, table.authorId] }),
//     pkWithCustomName: primaryKey({ name: 'custom_name', columns: [table.bookId, table.authorId] }),
//   };
// });
