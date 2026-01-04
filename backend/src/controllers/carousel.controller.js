import { carouselService } from '../services/index.js';

export const getPublicCarousel = async (req, reply) => {
  try {
    const items = await carouselService.getAll(true);
    return reply.send({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching public carousel:', error);
    return reply.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

export const getAll = async (req, reply) => {
  try {
    const items = await carouselService.getAll(false);
    return reply.send({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching carousel items:', error);
    return reply.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

export const create = async (req, reply) => {
  try {
    const item = await carouselService.create(req.body);
    return reply.status(201).send({ success: true, data: item });
  } catch (error) {
    console.error('Error creating carousel item:', error);
    return reply.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

export const update = async (req, reply) => {
  try {
    const { id } = req.params;
    const item = await carouselService.update(id, req.body);
    if (!item) {
      return reply.status(404).send({ success: false, message: 'Item not found' });
    }
    return reply.send({ success: true, data: item });
  } catch (error) {
    console.error('Error updating carousel item:', error);
    return reply.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

export const remove = async (req, reply) => {
  try {
    const { id } = req.params;
    await carouselService.delete(id);
    return reply.send({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting carousel item:', error);
    return reply.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

export const reorder = async (req, reply) => {
  try {
    const { items } = req.body; // Array of { id, order }
    await carouselService.updateOrder(items);
    return reply.send({ success: true, message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error reordering carousel items:', error);
    return reply.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};
