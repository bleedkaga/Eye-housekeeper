const chunkStorage = {};

const cached = {};

const registerModel = (app, model) => {
  model = model.default || model;

  if (model.namespace && !cached[model.namespace]) {
    app.model(model);
    cached[model.namespace] = 1;
  }
};

const ChunkHelper = {
  add(k, c) {
    if (!chunkStorage[k]) chunkStorage[k] = c;
  },
  set(k, c) {
    chunkStorage[k] = c;
  },
  get(k) {
    return chunkStorage[k] ? chunkStorage[k] : null;
  },
  remove(k) {
    delete chunkStorage[k];
  },
  load(k) {
    const loadable = ChunkHelper.get(k);
    if (loadable) {
      let models = [];
      if (loadable.models) {
        //包含models
        const resolveModels = loadable.models;
        if (typeof resolveModels === 'function') {
          const v = resolveModels();
          if (Array.isArray(v)) models = v;
          else models.push(v);
        }
      }
      return Promise.all(models.concat(loadable.load())).then((ret) => {
        let m = null;
        if (!models || !models.length) {
          m = ret[0];
        } else {
          const len = models.length;
          ret.slice(0, len).forEach((model) => {
            m = model.default || m;

            if (!Array.isArray(m)) {
              m = [m];
            }
            m.map(_ => registerModel(ChunkHelper.app, _));
          });
          m = ret[len];
        }
        const c = m.default ? m.default : m;
        loadable.error = false;
        loadable.component = c;
        return loadable;
      }).catch((err) => {
        console.log(err);
        loadable.error = true;
        loadable.component = null;
        throw err;
      });
    } else {
      const error = new Error('loadable is null');
      return Promise.reject(error);
    }
  },
};

export default ChunkHelper;
