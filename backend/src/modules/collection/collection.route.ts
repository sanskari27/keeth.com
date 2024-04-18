import express from 'express';
import CollectionController from './collection.controller';
import {
	CollectionIDValidator,
	CreateValidator,
	ProductsValidator,
	TagsValidator,
} from './collection.validator';

const router = express.Router();

router
	.route('/:id/products')
	.all(CollectionIDValidator, ProductsValidator)
	.post(CollectionController.addProducts)
	.delete(CollectionController.removeProducts);

router
	.route('/:id/tags')
	.all(CollectionIDValidator, TagsValidator)
	.post(CollectionController.addTags)
	.delete(CollectionController.removeTags);

router.route('/:id').all(CollectionIDValidator).patch(CollectionController.updateImage);

router
	.route('/')
	.get(CollectionController.listCollections)
	.post(CreateValidator, CollectionController.create)
	.delete(CollectionIDValidator, CollectionController.remove);

export default router;
