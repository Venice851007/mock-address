/**
 * MiniSpaceX Address — serves SPA assets; generation is 100% client-side.
 */
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
