export const success = (data, message = 'Success') => ({
  success: true,
  message,
  data
});

export const error = (message = 'Error', statusCode = 400) => ({
  success: false,
  message,
  statusCode
});

export const paginate = (data, page, limit, total) => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  }
});
