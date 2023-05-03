({
  access: 'public',
  method: async () => {
    await admin.create();
    return { status: 'logged' };
  },
});
