const Compress = {
  init: options => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      Compress.getIMG(e.target.result, options, resolve, reject);
    };
    reader.readAsDataURL(options.file);
  }),

  getIMG: (url, options, resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      Compress.c(img, options, resolve, reject);
    };
    img.onerror = reject;
    img.src = url;
  },

  c: (img, options, resolve, reject) => {
    const {quality = 0.8, width = 1024, suffix, file} = options;

    let iW = img.width;
    let iH = img.height;

    if (iW > width) {
      const a = width / iW;
      iH = Math.round(iH * a);
      iW = width;
    }

    if (iH > width) {
      const a = width / iH;
      iW = Math.round(iW * a);
      iH = width;
    }

    const canvas = document.createElement('canvas');
    canvas.width = iW;
    canvas.height = iH;
    const ctx = canvas.getContext('2d');
    try {
      ctx.drawImage(img, 0, 0, iW, iH);
      const ct = file.type || Compress.getContentType(suffix);
      const base64 = canvas.toDataURL(ct, quality);
      resolve(Compress.dataURLtoFile(base64, file.name, ct));
    } catch (e) {
      reject(e);
    }
  },

  getContentType: (suffix) => {
    //因需求， jpg 也改换成 png
    if (suffix === "jpg" || suffix === "jpeg") {
      // return "image/jpeg"
      return "image/png";
    } else if (suffix === "png" || suffix === "gif") {
      return "image/png";
    } else {
      return `image/${suffix}`;
    }
  },

  //将base64转换为文件
  dataURLtoFile: (dataurl, filename, mime) => {
    const arr = dataurl.split(',');
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
  },
};

export default Compress;
