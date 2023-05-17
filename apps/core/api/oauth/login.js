({
  access: 'public',
  method: async () => {
    await domain.admin.create();
    return { status: 'logged' };
  },
});
