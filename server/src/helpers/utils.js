export const paginate = {
  limit(limit, value) {
    return limit !== undefined ? limit : value || 20;
  },
  offset(offset, value) {
    return offset !== undefined ? offset : value || 0;
  },
};
