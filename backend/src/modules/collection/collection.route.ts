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

router.route('/home-collections').get(CollectionController.homeCollections);

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

router
	.route('/:id')
	.all(CollectionIDValidator)
	.delete(CollectionController.deleteCollection)
	.put(CollectionController.updateName)
	.patch(CollectionController.updateImage);

router
	.route('/')
	.get(CollectionController.listCollections)
	.post(CreateValidator, CollectionController.create);

export default router;
