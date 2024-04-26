import express from 'express';
import CollectionController from './collection.controller';
import {
	CollectionIDValidator,
	CreateValidator,
	ProductsValidator,
	TagsValidator,
	VisibilityValidator,
} from './collection.validator';

const router = express.Router();

router
	.route('/:id/products')
	.all(CollectionIDValidator, ProductsValidator)
	.post(CollectionController.setProducts)
	.patch(CollectionController.addProducts)
	.delete(CollectionController.removeProducts);

router
	.route('/:id/tags')
	.all(CollectionIDValidator, TagsValidator)
	.post(CollectionController.addTags)
	.put(CollectionController.replaceTags)
	.delete(CollectionController.removeTags);

router
	.route('/:id/home-visibility')
	.all(CollectionIDValidator, VisibilityValidator)
	.patch(CollectionController.updateVisibility);

router.route('/:id').all(CollectionIDValidator).patch(CollectionController.updateImage);

router
	.route('/')
	.get(CollectionController.listCollections)
	.post(CreateValidator, CollectionController.create)
	.delete(CollectionIDValidator, CollectionController.remove);

export default router;
