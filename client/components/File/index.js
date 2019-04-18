import React from 'react';
import {message} from 'antd';
import {instance} from 'client/utils/ajax';

//文件选择器
class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static defaultProps = {
    size: 5 * 1024, // 1024KB
    suffix: ['xlsx', 'xls'], //上传文件类型
    accept: '', //input过滤类型
    onComplete: () => {
    },
  };

  componentDidMount() {
  }

  onChange = (e) => {
    const files = e.target.files;
    if (files[0]) {
      this.filter(files[0]);
      e.target.value = '';
    }
  };


  filter(file) {
    const {suffix, size, onComplete} = this.props;
    const s = this.getSuffix(file.name);
    if (suffix.indexOf(s.toLowerCase()) !== -1 || suffix.indexOf(s.toUpperCase()) !== -1) {
      file.suffix = s.toLowerCase();
      if (size === 0 || file.size < size * 1024) {
        onComplete && onComplete(file, this.getSizeText(file.size / 1024));
      } else {
        message.warn(`您选择的文件太大，最大支持${this.getSizeText(size)}的文件上传`);
      }
    } else {
      message.warn(`您选择的文件不支持，只支持${suffix.join('、')}的文件上传`);
    }
  }

  getSizeText(size) {
    const t = size * 1024; //KB
    if (t >= 1024 * 1024) {
      return `${(t / (1024 * 1024)).toFixed(1)}MB`;
    }
    return `${size.toFixed(1)}KB`;
  }

  getSuffix(name) {
    const temp = name.split('.');
    return temp.pop().toString();
  }

  render() {
    return (<input
      accept={this.props.accept}
      type={'file'}
      onChange={this.onChange}
    />);
  }
}

export const SendUpload = (url, data, onProgress, autoToast = true) => {
  const formData = new FormData();
  if (data) {
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
  }
  return instance.post(url, formData, {
    onUploadProgress: ({total, loaded}) => {
      const r = Math.round(loaded / total * 100).toFixed(0);
      onProgress && onProgress(r >= 100 ? 99 : r);
    },
  }).then(({data: response}) => {
    if (response.code !== 0) {
      autoToast && message.error(response.message || '上传失败');
    }
    return response;
  }).catch(() => {
    autoToast && message.error('上传失败');
  });
};

export default Class;
